import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrustConversionData } from '../types';

interface Props {
  data: TrustConversionData;
}

const TrustConversionAnalysis: React.FC<Props> = ({ data }) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);

  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-slate">Trust & Conversion Analysis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-background">
        {Object.entries(data).map(([key, value]) => {
          if (key !== 'overallAnalysis') {
            return (
              <AnalysisCard
                key={key}
                title={formatTitle(key)}
                data={value}
                onShowDetails={() => setSelectedAnalysis(key)}
              />
            );
          }
          return null;
        })}
      </div>
      <AnimatePresence>
        {selectedAnalysis && (
          <AnalysisPopup
            data={data[selectedAnalysis]}
            title={formatTitle(selectedAnalysis)}
            onClose={() => setSelectedAnalysis(null)}
          />
        )}
      </AnimatePresence>
    </>
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
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="mb-4">
            <h3 className="text-lg font-semibold text-accent">{formatTitle(key)}</h3>
            {key === 'recommendations' ? (
              <ul className="list-disc list-inside text-text">
                {value.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-text">{formatValue(value)}</p>
            )}
          </div>
        ))}
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

function formatTitle(key: string): string {
  return key.split(/(?=[A-Z])/).join(' ');
}

function formatValue(value: any): string {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'object' && value !== null) {
    if ('present' in value && 'easilyAccessible' in value) {
      return `Present: ${value.present ? 'Yes' : 'No'}, Easily Accessible: ${value.easilyAccessible ? 'Yes' : 'No'}`;
    }
    return JSON.stringify(value);
  }
  return value.toString();
}

export default TrustConversionAnalysis;