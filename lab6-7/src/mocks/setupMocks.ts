import * as http from 'http';
import { URL } from 'url';

const mockPort = 3000;      

export async function setupCurrencyMock() {
  const usdRates = {
    base: 'USD',
    rates: {
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110.0,
      CAD: 1.23,
      AUD: 1.32,
      RUB: 79.26,
      CNY: 6.47
    },
    date: new Date().toISOString().split('T')[0],
    time_last_updated: Date.now()
  };

  const eurRates = {
    base: 'EUR',
    rates: {
      USD: 1.18,
      GBP: 0.86,
      JPY: 129.42,
      CAD: 1.45,
      AUD: 1.55,
      RUB: 93.36,
      CNY: 7.61,
    },
    date: new Date().toISOString().split('T')[0],
    time_last_updated: Date.now()
  };

  const gbpRates = {
    base: 'GBP',
    rates: {
      USD: 1.37,
      EUR: 1.16,
      JPY: 150.68,
      CAD: 1.69,
      AUD: 1.81,
      RUB: 109.73,
      CNY: 8.86
    },
    date: new Date().toISOString().split('T')[0],
    time_last_updated: Date.now()
  };

  const routes: Record<string, any> = {
    '/': { 
      message: 'Currency Exchange API Mock Server', 
      version: '1.0.0',
      availableEndpoints: [
        '/latest/USD',
        '/latest/EUR',
        '/latest/GBP'
      ]
    },
    '/latest/USD': usdRates,
    '/latest/EUR': eurRates,
    '/latest/GBP': gbpRates
  };

  return new Promise<{ mockUrl: string; stop: () => Promise<void> }>((resolve) => {
    const server = http.createServer((req, res) => {
      const parsedUrl = new URL(req.url || '', `http://localhost:${mockPort}`);
      const path = parsedUrl.pathname;
      
      console.log(`request: ${req.method} ${path}`);
      
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
      }

      if (routes[path]) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(routes[path]));
        return;
      }

      const currencyCodeMatch = path.match(/\/latest\/([A-Z]{3})$/);
      if (currencyCodeMatch) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Currency not supported' }));
        return;
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    });

    server.listen(mockPort, () => {
      console.log(`Mock currency API server started on port ${mockPort}`);
      
      resolve({
        mockUrl: `http://localhost:${mockPort}`,
        stop: () => {
          return new Promise<void>((resolveStop) => {
            console.log('Stop mock...');
            server.close(() => {
              console.log('Mock server stopped');
              resolveStop();
            });
          });
        }
      });
    });
  });
} 

