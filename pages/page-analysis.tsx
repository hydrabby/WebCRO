import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import PageAnalysisTable from '../components/PageAnalysisTable';
import PageAnalysisDetail from '../components/PageAnalysisDetail';
import { useAnalysis } from '../contexts/AnalysisContext';
import { PageAnalysisData } from '../types';

export default function PageAnalysisPage() {
  const { seoAnalysisData } = useAnalysis();
  const [pages, setPages] = useState<PageAnalysisData[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageAnalysisData | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('url');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterText, setFilterText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (seoAnalysisData && seoAnalysisData.pages) {
      setPages(seoAnalysisData.pages);
    }
  }, [seoAnalysisData]);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredPages = pages.filter(page => 
    page.url.toLowerCase().includes(filterText.toLowerCase()) ||
    page.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedPages = filteredPages.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedPages = sortedPages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedPages.length / itemsPerPage);

  return (
    <Layout>
      <Head>
        <title>Page Analysis - CRO App</title>
        <meta name="description" content="Detailed SEO analysis for individual pages and blog posts" />
      </Head>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Page Analysis</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Filter pages..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <PageAnalysisTable
          pages={paginatedPages}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSelectPage={setSelectedPage}
        />

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>

        {selectedPage && (
          <PageAnalysisDetail page={selectedPage} onClose={() => setSelectedPage(null)} />
        )}
      </div>
    </Layout>
  );
}