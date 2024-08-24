import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEOAnalysisData } from '../types';
import { ensureString } from '../utils/seoAnalyzer';

interface Props {
  data: SEOAnalysisData | null;
}

const SEOAnalysis: React.FC<Props> = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null);

  if (!data) {
    return <div className="text-center py-8">Loading SEO analysis data...</div>;
  }

  if ('error' in data) {
    return <div className="text-center py-8 text-red-500">{data.error}</div>;
  }

  const categories = [
    { name: 'On-Page Optimization', key: 'onPageOptimization' },
    { name: 'User Experience and Engagement', key: 'userExperienceAndEngagement' },
    { name: 'Content Quality', key: 'contentQuality' },
    { name: 'Link Optimization', key: 'linkOptimization' },
    { name: 'Technical SEO', key: 'technicalSEO' },
    { name: 'Advanced On-Page Techniques', key: 'advancedOnPageTechniques' },
    { name: 'Technical Performance and Architecture', key: 'technicalPerformanceAndArchitecture' }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-8 text-slate">SEO Analysis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.key}
            category={category}
            isSelected={selectedCategory === category.key}
            onClick={() => setSelectedCategory(category.key === selectedCategory ? null : category.key)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedCategory && (
          <CategoryDetails
            category={categories.find(c => c.key === selectedCategory)!}
            data={data[selectedCategory]}
            onShowDetails={setSelectedFactor}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFactor && selectedCategory && (
          <AnalysisPopup
            data={data[selectedCategory][selectedFactor]}
            title={formatTitle(selectedFactor)}
            onClose={() => setSelectedFactor(null)}
          />
        )}
      </AnimatePresence>

      <OverallAnalysis
        overallAnalysis={ensureString(data.overallAnalysis)}
        overallRecommendations={data.overallRecommendations || []}
      />
    </div>
  );
};

const CategoryCard: React.FC<{ category: any; isSelected: boolean; onClick: () => void }> = ({ category, isSelected, onClick }) => (
  <motion.div
    layout
    className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer ${
      isSelected ? 'col-span-full' : ''
    }`}
    onClick={onClick}
  >
    <h2 className="text-xl font-semibold p-4 bg-primary text-white">{category.name}</h2>
  </motion.div>
);

const CategoryDetails: React.FC<{ category: any; data: any; onShowDetails: (factor: string) => void }> = 
  ({ category, data, onShowDetails }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="mt-8"
  >
    <h3 className="text-2xl font-bold mb-4">{category.name}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(data || {}).map(([factor, factorData]) => (
        <AnalysisCard
          key={factor}
          title={formatTitle(factor)}
          data={factorData}
          onShowDetails={() => onShowDetails(factor)}
        />
      ))}
    </div>
  </motion.div>
);

const AnalysisCard: React.FC<{ title: string; data: any; onShowDetails: () => void }> = ({ title, data, onShowDetails }) => (
  <motion.div
    className="bg-card p-6 rounded-lg shadow-md"
    whileHover={{ y: -5, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
  >
    <h3 className="text-xl font-semibold mb-4 text-primary">{title}</h3>
    <p className="text-sm mb-4">{data.score ? `Score: ${data.score}/100` : 'No score available'}</p>
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

const AnalysisPopup: React.FC<{ data: any; title: string; onClose: () => void }> = ({ data, title, onClose }) => (
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
      <div className="space-y-4">
        {Object.entries(data || {}).map(([key, value]) => (
          <div key={key}>
            <h4 className="font-semibold text-accent">{formatTitle(key)}:</h4>
            {Array.isArray(value) ? (
              <ul className="list-disc list-inside text-text">
                {value.map((item, index) => (
                  <li key={index}>{ensureString(item)}</li>
                ))}
              </ul>
            ) : (
              <p className="text-text">{ensureString(value)}</p>
            )}
          </div>
        ))}
      </div>
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

const OverallAnalysis: React.FC<{ overallAnalysis: string; overallRecommendations: any[] }> = 
  ({ overallAnalysis, overallRecommendations }) => (
  <div className="bg-slate rounded-lg shadow-md overflow-hidden mt-8">
    <h2 className="text-2xl font-semibold p-4 bg-umber text-oatmeal">Overall Analysis</h2>
    <div className="p-6 space-y-4">
      <p className="text-oatmeal">{overallAnalysis}</p>
      <h3 className="text-xl font-semibold text-coral">Recommendations</h3>
      <ul className="list-disc list-inside text-oatmeal">
        {overallRecommendations.map((recommendation, index) => (
          <li key={index} className="mb-2">
            {ensureString(recommendation.recommendation)}
            <span className="block text-sm text-coral">
              Priority: {recommendation.priority} | Impact: {recommendation.impact} | Effort: {recommendation.effort}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const formatTitle = (key: string): string => key.split(/(?=[A-Z])/).join(' ');

export default SEOAnalysis;