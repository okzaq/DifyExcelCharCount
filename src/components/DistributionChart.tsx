import React from 'react';
import type { DistributionBucket } from '../types';

interface DistributionChartProps {
  buckets: DistributionBucket[];
  onDownload?: () => void;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({ buckets, onDownload }) => {
  const maxCount = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div className="section">
      <div className="section-header">
        <h3 className="section-title">文字数分布</h3>
        {onDownload && (
          <button className="btn-small" onClick={onDownload}>CSV ダウンロード</button>
        )}
      </div>
      <div className="distribution-table-wrapper">
        <table className="distribution-table">
          <thead>
            <tr>
              <th>範囲</th>
              <th>件数</th>
              <th>割合</th>
              <th className="bar-col">分布</th>
            </tr>
          </thead>
          <tbody>
            {buckets.map((bucket) => {
              const pct = ((bucket.count / Math.max(buckets.reduce((s, b) => s + b.count, 0), 1)) * 100).toFixed(1);
              const barWidth = Math.round((bucket.count / maxCount) * 100);
              return (
                <tr key={bucket.label} className={bucket.count > 0 ? '' : 'empty-bucket'}>
                  <td className="range-cell">{bucket.label}</td>
                  <td className="count-cell">{bucket.count.toLocaleString()}</td>
                  <td className="pct-cell">{pct}%</td>
                  <td className="bar-cell">
                    <div
                      className="bar-fill"
                      style={{ width: `${barWidth}%` }}
                      title={`${bucket.count}件`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
