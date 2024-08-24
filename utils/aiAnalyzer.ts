import { AnalysisData } from '../types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_RETRIES = 3;

async function analyzeGroup(group: string, aspects: string[], pageContent: string): Promise<any> {
  const prompt = `
  Analyze the following webpage content critically and honestly for the ${aspects.join(', ')} aspects of web design, user experience, and marketing effectiveness:
  ${pageContent}

  Provide a detailed, unbiased analysis in JSON format with the following structure:
  {
    ${aspects.map(aspect => `"${aspect}": {
      "strengths": [],
      "weaknesses": [],
      "recommendations": []
    }`).join(',')}
  }

  Ensure your response is thorough, critical, and in valid JSON format.
  `;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a web design and marketing expert analyzing websites. Provide your analysis in valid JSON format." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error("No content received from OpenAI");
      }

      console.log(`Raw OpenAI response for ${group}:`, content);

      const jsonString = content.replace(/^```json\s*|```$/g, '').trim();
      return JSON.parse(jsonString);
    } catch (error) {
      console.error(`Error in AI analysis for ${group} (attempt ${attempt + 1}):`, error);
      if (attempt === MAX_RETRIES - 1) {
        throw new Error(`Failed to analyze ${group} after ${MAX_RETRIES} attempts`);
      }
    }
  }
}

export async function analyzeWithAI(pageContent: string): Promise<AnalysisData> {
  const groups = [
    { name: 'Design and Copy', aspects: ['Design', 'Copy'] },
    { name: 'UX and CTA', aspects: ['User Experience (UX)', 'Call to Action (CTA)'] },
    { name: 'SEO', aspects: ['SEO - On-page optimization', 'SEO - Technical aspects', 'SEO - Content quality'] },
    { name: 'Mobile and Performance', aspects: ['Mobile responsiveness', 'Performance'] },
    { name: 'Trust', aspects: ['Trust and Credibility'] }
  ];

  const analysisResults = await Promise.all(
    groups.map(group => analyzeGroup(group.name, group.aspects, pageContent))
  );

  const combinedAnalysis = analysisResults.reduce((acc, result) => ({ ...acc, ...result }), {});

  return combinedAnalysis as AnalysisData;
}