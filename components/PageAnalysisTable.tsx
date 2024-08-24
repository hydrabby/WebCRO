import React from 'react';
import { PageAnalysisData } from '../types';

interface Props {
  pages: PageAnalysisData[];
  onSort: (column: string) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSelectPage: (page: PageAnalysisData) => void;
}

const PageAnalysisTable: React.FC<Props> = ({ pages, onSort, sortColumn, sortDirection, onSelectPage }) => {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 text-left cursor-pointer" onClick={() => onSort('url')}>
            URL {sortColumn === 'url' && (sortDirection === 'asc' ? '▲' : '▼')}
          </th>
          <th className="p-2 text-left cursor-pointer" onClick={() => onSort('title')}>
            Title {sortColumn === 'title' && (sortDirection === 'asc' ? '▲' : '▼')}
          </th>
          <th className="p-2 text-left cursor-pointer" onClick={() => onSort('seoScore')}>
            SEO Score {sortColumn === 'seoScore' && (sortDirection === 'asc' ? '▲' : '▼')}
          </th>
        </tr>
      </thead>
      <tbody>
        {pages.map((page, index) => (
          <tr key={index} className="border-b hover:bg-gray-100 cursor-pointer" onClick={() => onSelectPage(page)}>
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