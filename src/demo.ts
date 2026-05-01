import Groq from 'groq-sdk';
import { 
  searchDuckDuckGo, 
  searchWikipedia, 
  searchHackerNews, 
  scrapeUrl, 
  SearchSource 
} from './sources'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface ResearchReport {
  topic: string;
  summary: string;
  key_findings: string[];
  sources: SearchSource[];
  report: string;
  generated_at: string;
}

export async function generateResearchReport(topic: string): Promise<ResearchReport> {
  // 1. Concurrent Search
  const [ddgResults, wikiResults, hnResults] = await Promise.all([
    searchDuckDuckGo(topic),
    searchWikipedia(topic),
    searchHackerNews(topic),
  ]);

  const allSources = [...ddgResults, ...wikiResults, ...hnResults].slice(0, 10);

  // 2. Scrape Content for top sources
  const sourcesWithContent = await Promise.all(
    allSources.map(async (source) => {
      if (source.url && source.url.includes('wikipedia.org')) {
        // Wikipedia content is often in the snippet already or we can skip heavy scrape
        return source;
      }
      const content = await scrapeUrl(source.url);
      return { ...source, content };
    })
  );

  // 3. Summarize each source using Groq
  const summaries = await Promise.all(
    sourcesWithContent.map(async (source) => {
      const textToSummarize = source.content || source.snippet;
      if (!textToSummarize) return '';

      try {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are a research assistant. Summarize the following text in one concise sentence focused on numerical data, key facts, or controversial insights.',
            },
            {
              role: 'user',
              content: textToSummarize.slice(0, 3000),
            },
          ],
          model: 'llama-3.3-70b-versatile',
        });
        return completion.choices[0]?.message?.content || '';
      } catch (err) {
        return '';
      }
    })
  );

  const contextForSynthesis = sourcesWithContent
    .map((s, i) => `Source [${i}]: ${s.title}\nSummary: ${summaries[i]}`)
    .join('\n\n');

  // 4. Final Synthesis
  const finalSynthesis = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are an expert research analyst. Create a deep structured report in Markdown.
        Include:
        1. Executive Summary (1 paragraph)
        2. Key Findings (Bullet points)
        3. Detailed Analysis (Multiple sections)
        4. Conclusion
        
        Word count goal: ~600 words. Format clearly with headers.`,
      },
      {
        role: 'user',
        content: `Topic: ${topic}\n\nContext:\n${contextForSynthesis}`,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5,
  });

  const reportContent = finalSynthesis.choices[0]?.message?.content || 'Failed to generate report content.';

  // 5. Extract summary and key findings for JSON structure
  const extraction = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'Extract the executive summary and top 3 key findings from the provided report. Return as JSON: { "summary": "...", "key_findings": ["...", "...", "..."] }',
      },
      {
        role: 'user',
        content: reportContent,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
  });

  const { summary, key_findings } = JSON.parse(extraction.choices[0]?.message?.content || '{}');

  return {
    topic,
    summary: summary || 'Topic summary generated.',
    key_findings: key_findings || [],
    sources: allSources.map(s => ({ title: s.title, url: s.url, snippet: s.snippet })),
    report: reportContent,
    generated_at: new Date().toISOString(),
  };
}
