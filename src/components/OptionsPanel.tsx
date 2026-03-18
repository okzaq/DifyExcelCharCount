import React from 'react';

interface OptionsPanelProps {
  headers: string[];
  excludedHeaders: Set<string>;
  onExcludedChange: (excluded: Set<string>) => void;
  skipEmpty: boolean;
  onSkipEmptyChange: (v: boolean) => void;
  trim: boolean;
  onTrimChange: (v: boolean) => void;
  threshold: number;
  onThresholdChange: (v: number) => void;
  topN: number;
  onTopNChange: (v: number) => void;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({
  headers,
  excludedHeaders,
  onExcludedChange,
  skipEmpty,
  onSkipEmptyChange,
  trim,
  onTrimChange,
  threshold,
  onThresholdChange,
  topN,
  onTopNChange,
}) => {
  const toggleHeader = (header: string) => {
    const next = new Set(excludedHeaders);
    if (next.has(header)) {
      next.delete(header);
    } else {
      next.add(header);
    }
    onExcludedChange(next);
  };

  const toggleAll = (exclude: boolean) => {
    onExcludedChange(exclude ? new Set(headers) : new Set());
  };

  return (
    <div className="section">
      <h3 className="section-title">オプション</h3>

      {/* 除外列 */}
      <div className="option-group">
        <label className="option-group-label">除外する列</label>
        <div className="exclude-controls">
          <button className="btn-small" onClick={() => toggleAll(true)}>全除外</button>
          <button className="btn-small" onClick={() => toggleAll(false)}>全選択</button>
        </div>
        <div className="header-checkboxes">
          {headers.map((h) => (
            <label key={h} className="checkbox-label">
              <input
                type="checkbox"
                checked={excludedHeaders.has(h)}
                onChange={() => toggleHeader(h)}
              />
              <span>{h}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 出力オプション */}
      <div className="option-group option-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={skipEmpty}
            onChange={(e) => onSkipEmptyChange(e.target.checked)}
          />
          <span>空値の項目をスキップ</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={trim}
            onChange={(e) => onTrimChange(e.target.checked)}
          />
          <span>前後の空白をトリム</span>
        </label>
      </div>

      {/* 閾値・上位件数 */}
      <div className="option-group option-row">
        <label className="inline-label">
          <span>閾値（文字数）</span>
          <input
            type="number"
            min={0}
            value={threshold}
            onChange={(e) => onThresholdChange(Math.max(0, Number(e.target.value)))}
            className="number-input"
          />
        </label>
        <label className="inline-label">
          <span>上位表示件数</span>
          <input
            type="number"
            min={1}
            max={1000}
            value={topN}
            onChange={(e) => onTopNChange(Math.max(1, Math.min(1000, Number(e.target.value))))}
            className="number-input"
          />
        </label>
      </div>
    </div>
  );
};
