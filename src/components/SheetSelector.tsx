import React from 'react';

interface SheetSelectorProps {
  sheetNames: string[];
  selectedSheet: string;
  onSheetChange: (name: string) => void;
}

export const SheetSelector: React.FC<SheetSelectorProps> = ({
  sheetNames,
  selectedSheet,
  onSheetChange,
}) => {
  if (sheetNames.length <= 1) return null;

  return (
    <div className="section">
      <label className="section-label">シート選択</label>
      <div className="sheet-tabs">
        {sheetNames.map((name) => (
          <button
            key={name}
            className={`sheet-tab ${name === selectedSheet ? 'active' : ''}`}
            onClick={() => onSheetChange(name)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};
