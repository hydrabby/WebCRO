import type { NextApiRequest, NextApiResponse } from 'next';
import { analyzeWithAI } from '../../utils/aiAnalyzer';
import { analyzeCopy } from '../../utils/copyAnalyzer';
import { analyzeTrustConversion } from '../../utils/trustConversionAnalyzer';
import { analyzeSEO } from '../../utils/seoAnalyzer';
import axios from 'axios';
import { parse } from 'node-html-parser';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { domain } = req.body;

      // Fetch the main page HTML
      const response = await axios.get(`https://${domain}`);
      const html = response.data;

      // Parse the HTML to extract the text content
      const root = parse(html);
      const textContent = root.textContent;

      // Fetch the sitemap
      let sitemap = '';
      try {
        const sitemapResponse = await axios.get(`https://${domain}/sitemap.xml`);
        sitemap = sitemapResponse.data;
      } catch (error) {
        console.error('Error fetching sitemap:', error);
        sitemap = 'Sitemap not found or inaccessible';
      }

      // Perform the analyses
      const analysis = await analyzeWithAI(textContent);
      const trustConversionData = await analyzeTrustConversion(html);
      const copyAnalysisData = await analyzeCopy(textContent);
      const seoAnalysisData = await analyzeSEO(html, sitemap);

      res.status(200).json({ 
        analysis, 
        trustConversionData, 
        copyAnalysisData, 
        seoAnalysisData,
        websiteContent: textContent 
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred during analysis' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}