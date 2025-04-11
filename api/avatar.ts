import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Avatar API called with query:', req.query);
    console.log('Avatar API called with path:', req.url);
    
    let options = req.query.options as string;
    
    // URL에서 직접 옵션을 추출 (경로 파라미터로 전달된 경우)
    if (!options && req.url) {
      const match = req.url.match(/\/api\/avatar\/([^/?]+)/);
      if (match) {
        options = match[1];
      }
    }

    if (!options) {
      console.error('No options provided');
      return res.status(400).json({ error: 'Missing options parameter' });
    }

    let decodedOptions;
    try {
      decodedOptions = JSON.parse(Buffer.from(options, 'base64').toString());
      console.log('Decoded options:', decodedOptions);
    } catch (error) {
      console.error('Failed to decode options:', error);
      return res.status(400).json({ error: 'Invalid options format' });
    }

    const response = await fetch('https://api.notion-avatar.com/svg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'image/svg+xml',
      },
      body: JSON.stringify(decodedOptions),
    });

    console.log('Notion API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Notion API error:', errorText);
      return res.status(response.status).json({ 
        error: 'Failed to generate avatar',
        details: errorText
      });
    }

    const buffer = await response.buffer();
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    return res.status(200).send(buffer);

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
} 