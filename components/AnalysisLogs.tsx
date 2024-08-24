// File: /components/AnalysisLogs.tsx

import React from 'react';

interface Props {
  logs: string[];
}

export default function AnalysisLogs({ logs }: Props) {
  return (
    <div className="bg-oatmeal p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-slate">Analysis Logs</h3>
      <div className="bg-sea p-2 rounded">
        {logs.map((log, index) => (
          <p key={index} className="text-sm text-slate mb-1">
            {log}
          </p>
        ))}
      </div>
    </div>
  );
}