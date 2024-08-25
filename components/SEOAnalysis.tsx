// File: components/SEOAnalysis.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEOAnalysisData } from '../types';

interface Props {
  data: SEOAnalysisData | null;
}

const SEOAnalysis: React.FC<Props> = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null);

  const categories = [
    { name: 'On-page Optimization', key: 'onPageOptimization' },
    { name: 'Technical Aspects', key: 'technicalAspects' },
    { name: 'Content Quality', key: 'contentQuality' },
  ];

  if (!data) {
    return <div className="text-center py-8">Loading SEO analysis data...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-8 text-slate">SEO Analysis</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.key}
            layout
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer ${
              selectedCategory === category.key ? 'w-full order-last' : 'w-1/3 min-w-[250px]'
            }`}
            onClick={() => setSelectedCategory(category.key === selectedCategory ? null : category.key)}
          >
            <h2 className="text-xl font-semibold p-4 bg-primary text-white">{category.name}</h2>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8"
          >
            <h3 className="text-2xl font-bold mb-4">{categories.find(c => c.key === selectedCategory)?.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(data[selectedCategory]).map(([factorKey, factorData]) => (
                <AnalysisCard
                  key={factorKey}
                  title={formatTitle(factorKey)}
                  data={factorData}
                  onShowDetails={() => setSelectedFactor(factorKey)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFactor && (
          <AnalysisPopup
            data={data[selectedCategory][selectedFactor]}
            title={formatTitle(selectedFactor)}
            onClose={() => setSelectedFactor(null)}
          />
        )}
      </AnimatePresence>

      <OverallAnalysis
        overallAnalysis={data.overallAnalysis}
        overallRecommendations={data.overallRecommendations}
      />
    </div>
  );
};

const AnalysisCard: React.FC<{ title: string; data: any; onShowDetails: () => void }> = ({ title, data, onShowDetails }) => {
  return (
    <motion.div
      className="bg-card p-6 rounded-lg shadow-md"
      whileHover={{ y: -5, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      <h3 className="text-xl font-semibold mb-4 text-primary">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">Aspects covered: {data.aspectsCovered.join(', ')}</p>
      <motion.button
        className="mt-4 bg-secondary text-white px-4 py-2 rounded-md hover:bg-primary transition-colors duration-300 w-full"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={onShowDetails}
      >
        Show Details
      </motion.button>
    </motion.div>
  );
};

const AnalysisPopup: React.FC<{ data: any; title: string; onClose: () => void }> = ({ data, title, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-text bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-card p-8 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-6 text-primary">{title}</h2>
                <FactorDetails data={data} />
                <motion.button
                  className="mt-6 bg-secondary text-white px-4 py-2 rounded-md hover:bg-primary transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          );
        };

        const FactorDetails: React.FC<{ data: any }> = ({ data }) => {
          return (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-accent mb-2">Aspects Covered:</h4>
                <ul className="list-disc list-inside text-text">
                  {data.aspectsCovered.map((aspect, index) => (
                    <li key={index}>{aspect}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-accent mb-2">Analysis:</h4>
                <p className="text-text">{data.analysis}</p>
              </div>
              <div>
                <h4 className="font-semibold text-accent mb-2">Strengths:</h4>
                <ul className="list-disc list-inside text-text">
                  {data.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-accent mb-2">Weaknesses:</h4>
                <ul className="list-disc list-inside text-text">
                  {data.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-accent mb-2">Recommendations:</h4>
                <ul className="list-disc list-inside text-text">
                  {data.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        };

        const OverallAnalysis: React.FC<{ overallAnalysis: string; overallRecommendations: string[] }> = ({ overallAnalysis, overallRecommendations }) => (
          <div className="bg-slate rounded-lg shadow-md overflow-hidden mt-8">
            <h2 className="text-2xl font-semibold p-4 bg-umber text-oatmeal">Overall Analysis</h2>
            <div className="p-6 space-y-4">
              <p className="text-oatmeal">{overallAnalysis}</p>
              <h3 className="text-xl font-semibold text-coral">Recommendations</h3>
              <ul className="list-disc list-inside text-oatmeal">
                {overallRecommendations.map((recommendation, index) => (
                  <li key={index} className="mb-2">{recommendation}</li>
                ))}
              </ul>
            </div>
          </div>
        );

        function formatTitle(key: string): string {
          return key.split(/(?=[A-Z])/).join(' ');
        }

        export default SEOAnalysis;