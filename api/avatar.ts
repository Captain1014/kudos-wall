import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // URL에서 base64Options 추출
    const base64Options = req.url?.split('/api/avatar/')[1]?.split('?')[0];
    if (!base64Options) {
      return res.status(400).json({ error: 'Missing avatar options' });
    }

    console.log('Base64 options:', base64Options);

    // base64 디코딩
    const options = JSON.parse(Buffer.from(base64Options, 'base64').toString());
    console.log('Decoded options:', options);
    
    // Notion Avatar API로 요청
    const response = await fetch('https://notion-avatar.app/api/svg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      console.error('Notion API error:', await response.text());
      throw new Error(`Notion Avatar API responded with ${response.status}`);
    }

    const svg = await response.text();
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    return res.send(svg);
  } catch (error) {
    console.error('Error generating avatar:', error);
    return res.status(500).json({ error: 'Failed to generate avatar' });
  }
} 