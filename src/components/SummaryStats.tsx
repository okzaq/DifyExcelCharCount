import React from 'react';
import type { Statistics } from '../types';

interface SummaryStatsProps {
  stats: Statistics;
  onDownload?: () => void;
}

const StatCard: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
  <div className="stat-card">
    <div className="stat-value">{value.toLocaleString()}</div>
    <div className="stat-label">{label}</div>
  </div>
);

export const SummaryStats: React.FC<SummaryStatsProps> = ({ stats, onDownload }) => {
  return (
    <div className="section">
      <div className="section-header">
        <h3 className="section-title">サマリー</h3>
        {onDownload && (
          <button className="btn-small" onClick={onDownload}>CSV ダウンロード</button>
        )}
      </div>
      <div className="stat-grid">
        <StatCard label="総行数" value={stats.totalRows} />
        <StatCard label="最小文字数" value={stats.minChars} />
        <StatCard label="最大文字数" value={stats.maxChars} />
        <StatCard label="平均文字数" value={stats.avgChars} />
        <StatCard label="中央値" value={stats.medianChars} />
        <StatCard label="95パーセンタイル" value={stats.p95Chars} />
      </div>
    </div>
  );
};
