// File: /components/AnalysisResult.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisData, AnalysisAspect } from '../types';

interface Props {
  analysis: AnalysisData;
}

const categories = {
  'Design & Performance': ['Design', 'Performance'],
  'User Experience': ['User Experience (UX)', 'Mobile responsiveness'],
  'Content & Copy': ['Copy', 'SEO - Content quality'],
  'Technical SEO': ['SEO - On-page optimization', 'SEO - Technical aspects'],
  'Trust & Conversion': ['Trust and Credibility', 'Call to Action (CTA)'],
};

export default function AnalysisResult({ analysis }: Props) {
  return (
    <div className="space-y-8">
      {Object.entries(categories).map(([category, aspects], index) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-oatmeal rounded-lg shadow-md overflow-hidden"
        >
          <h2 className="text-xl font-semibold p-4 bg-slate text-oatmeal">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {aspects.map((aspect) => (
              <AspectCard key={aspect} title={aspect} aspect={analysis[aspect]} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AspectCard({ title, aspect }: { title: string; aspect: AnalysisAspect | undefined }) {
  if (!aspect || (aspect.strengths.length === 0 && aspect.weaknesses.length === 0 && aspect.recommendations.length === 0)) {
    return (
      <div className="bg-sea rounded-lg shadow-sm overflow-hidden">
        <h3 className="text-lg font-semibold p-3 bg-slate text-oatmeal">{title}</h3>
        <p className="p-3 text-sm text-slate">No data available for this aspect.</p>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-sea rounded-lg shadow-sm overflow-hidden transition-all duration-300"
    >
      <h3 className="text-lg font-semibold p-3 bg-slate text-oatmeal">{title}</h3>
      <div className="p-3 space-y-3">
        <AspectSection title="Strengths" items={aspect.strengths} />
        <AspectSection title="Weaknesses" items={aspect.weaknesses} />
        <AspectSection title="Recommendations" items={aspect.recommendations} />
      </div>
    </motion.div>
  );
}

function AspectSection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h4 className="font-medium text-slate text-sm uppercase tracking-wide mb-1">{title}</h4>
      <ul className="list-disc list-inside text-sm text-slate space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}