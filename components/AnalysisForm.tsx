import React, { useState } from 'react';
import { motion } from 'framer-motion';
interface Props {
  onSubmit: (domain: string) => Promise<void>;
  isLoading: boolean;
}
export default function AnalysisForm({ onSubmit, isLoading }: Props) {
  const [domain, setDomain] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (domain) {
      await onSubmit(domain);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="domain" className="block text-sm font-medium text-text mb-1">
          Website URL
        </label>
        <input
          type="text"
          id="domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter domain name"
          className="w-full p-2 border border-secondary rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-text"
          required
        />
      </div>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 0.5,
          duration: 0.3
        }}
        className="w-full px-4 py-2 bg-secondary text-white rounded-md transition-colors duration-300 disabled:bg-accent disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Analyze'}
      </motion.button>
    </form>
  );
}