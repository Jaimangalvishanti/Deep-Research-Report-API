import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { generateResearchReport } from './src/services/research';
import { x402 } from '@x402/express';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const WALLET_ADDRESS = process.env.METAMASK_WALLET_ADDRESS;

  if (!WALLET_ADDRESS) {
    console.warn('METAMASK_WALLET_ADDRESS not set in .env. API will likely fail payment verification.');
  }

  // x402 Payment Middleware Configuration
  const x402Middleware = x402({
    amount: "1.00",
    currency: "USDC",
    network: "base-mainnet",
    recipient: WALLET_ADDRESS || "0x0000000000000000000000000000000000000000",
    // facilitator is default https://x402.org/facilitator
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  /**
   * Agent Discovery Route (GET /research)
   * Returns 402 with payment requirements for agents like ClawCredit.
   */
  app.get('/research', x402Middleware, (req, res) => {
    // If they get here, they already paid (or middleware passed them because it's a GET and they might just be probing)
    // But usually discovery is 402.
    res.status(200).json({
      message: "Ready to research. POST to this endpoint with a 'topic' and valid x402 payment proof.",
      price: "1.00 USDC",
      network: "Base"
    });
  });

  /**
   * Main Research Endpoint (POST /research)
   */
  app.post('/research', x402Middleware, async (req, res) => {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: "Missing 'topic' in request body" });
    }

    try {
      console.log(`Starting research for: ${topic}`);
      const report = await generateResearchReport(topic);
      res.json(report);
    } catch (error: any) {
      console.error('Research API Error:', error);
      res.status(500).json({ 
        error: "Internal Server Error during research",
        message: error.message 
      });
    }
  });

  // Vite middleware for frontend development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: any, res: any) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`x402 Merchant active for wallet: ${WALLET_ADDRESS}`);
  });
}

startServer();
