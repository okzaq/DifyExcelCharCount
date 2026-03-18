import React, { useState } from 'react';
import type { RowAnalysis } from '../types';

interface RowTableProps {
  title: string;
  rows: RowAnalysis[];
  /** 表示上限（デフォルト 200） */
  displayLimit?: number;
  highlightThreshold?: number;
  onDownload?: () => void;
}

export const RowTable: React.FC<RowTableProps> = ({
  title,
  rows,
  displayLimit = 200,
  highlightThreshold,
  onDownload,
}) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const displayed = rows.slice(0, displayLimit);
  const omitted = rows.length - displayed.length;

  return (
    <div className="section">
      <div className="section-header">
        <h3 className="section-title">
          {title}
          <span className="count-badge">{rows.length.toLocaleString()}件</span>
        </h3>
        {onDownload && (
          <button className="btn-small" onClick={onDownload}>CSV ダウンロード</button>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="empty-message">該当する行はありません</p>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="row-table">
              <thead>
                <tr>
                  <th>行番号</th>
                  <th>文字数</th>
                  <th>生成文字列</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((row) => {
                  const isExpanded = expandedRow === row.rowIndex;
                  const isOver = highlightThreshold !== undefined && row.charCount > highlightThreshold;
                  return (
                    <tr
                      key={row.rowIndex}
                      className={isOver ? 'over-threshold' : ''}
                      onClick={() => setExpandedRow(isExpanded ? null : row.rowIndex)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="row-num-cell">{row.rowIndex}</td>
                      <td className="char-count-cell">{row.charCount.toLocaleString()}</td>
                      <td className="row-string-cell">
                        {isExpanded ? (
                          <span className="row-string-full">{row.rowString}</span>
                        ) : (
                          <span className="row-string-truncated" title={row.rowString}>
                            {row.rowString.length > 120
                              ? row.rowString.slice(0, 120) + '…'
                              : row.rowString}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {omitted > 0 && (
            <p className="omit-note">
              ※ 表示上限（{displayLimit}件）のため {omitted.toLocaleString()}件 を省略しています。集計は全件対象です。
            </p>
          )}
        </>
      )}
    </div>
  );
};
