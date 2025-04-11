import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const path = req.url?.split('/api/avatar')[1] || '';
    const targetUrl = `https://notion-avatar.app/api/svg${path}`;

    const response = await fetch(targetUrl);
    const contentType = response.headers.get('content-type');
    const buffer = await response.buffer();

    res.setHeader('Content-Type', contentType || 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    return res.send(buffer);
  } catch (error) {
    console.error('Error proxying avatar:', error);
    return res.status(500).json({ error: 'Failed to proxy avatar' });
  }
} 