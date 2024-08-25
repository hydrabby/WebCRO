import React from 'react';
import { PageAnalysisData } from '../types';

interface Props {
  pages: PageAnalysisData[];
}

const PageAnalysisTable: React.FC<Props> = ({ pages }) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 text-left">URL</th>
          <th className="p-2 text-left">Title</th>
          <th className="p-2 text-left">SEO Score</th>
        </tr>
      </thead>
      <tbody>
        {pages.map((page, index) => (
          <tr key={index} className="border-b">
            <td className="p-2">{page.url}</td>
            <td className="p-2">{page.title}</td>
            <td className="p-2">{page.seoScore}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PageAnalysisTable;