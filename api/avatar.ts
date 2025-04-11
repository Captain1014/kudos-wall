import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Avatar API called with query:', req.query);
    
    const { options } = req.query;
    if (!options) {
      console.error('No options provided');
      return res.status(400).json({ error: 'Missing options parameter' });
    }

    let decodedOptions;
    try {
      decodedOptions = JSON.parse(Buffer.from(options as string, 'base64').toString());
      console.log('Decoded options:', decodedOptions);
    } catch (error) {
      console.error('Failed to decode options:', error);
      return res.status(400).json({ error: 'Invalid options format' });
    }

    const response = await fetch('https://notion-avatar-api.vercel.app/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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