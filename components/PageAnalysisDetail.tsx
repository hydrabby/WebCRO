import React from 'react';
import { PageAnalysisData } from '../types';
import { motion } from 'framer-motion';

interface Props {
  page: PageAnalysisData;
  onClose: () => void;
}

const PageAnalysisDetail: React.FC<Props> = ({ page, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-4">{page.title}</h2>
        <p className="mb-4">{page.url}</p>

        <h3 className="text-xl font-semibold mb-2">On-Page Optimization</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Title Tag: {page.titleTag}</li>
          <li>Meta Description: {page.metaDescription}</li>
          <li>H1: {page.h1}</li>
          <li>Keyword Usage: {page.keywordUsage}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">Content Analysis</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Word Count: {page.wordCount}</li>
          <li>Readability Score: {page.readabilityScore}</li>
          <li>Content Quality: {page.contentQuality}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">Technical Aspects</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Load Time: {page.loadTime}</li>
          <li>Mobile Friendly: {page.mobileFriendly ? 'Yes' : 'No'}</li>
          <li>HTTPS: {page.https ? 'Yes' : 'No'}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">Recommendations</h3>
        <ul className="list-disc list-inside mb-4">
          {page.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>

        <button 
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

export default PageAnalysisDetail;