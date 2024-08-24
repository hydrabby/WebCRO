import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message, websiteContent } = req.body;

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    });

    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "You are a CRO expert assistant. Analyze the provided website content and answer user questions based solely on the information present in the HTML content. Do not make assumptions or provide general advice not directly related to the content. If asked about something not present in the HTML, clearly state that the information is not available in the provided content. Keep responses concise and directly related to the user's question." 
          },
          { role: "user", content: `Website content: ${websiteContent}\n\nUser question: ${message}` }
        ],
        max_tokens: 300,
        temperature: 0.7,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        res.write(content);
      }
    } catch (error) {
      console.error('Error in chat API:', error);
      res.write('An error occurred while processing your request. Please try again later.');
    } finally {
      res.end();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}