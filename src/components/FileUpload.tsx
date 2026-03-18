import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, isLoading }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !['xlsx', 'xls', 'csv'].includes(ext)) {
      alert('対応ファイル形式: .xlsx, .xls, .csv');
      return;
    }
    onFileSelected(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // 同ファイル再選択も検知できるようリセット
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`file-upload-area ${isDragOver ? 'drag-over' : ''} ${isLoading ? 'loading' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !isLoading && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      {isLoading ? (
        <p className="upload-text">📊 読み込み・解析中...</p>
      ) : (
        <>
          <p className="upload-icon">📁</p>
          <p className="upload-text">クリックまたはドラッグ&amp;ドロップでファイルを選択</p>
          <p className="upload-sub">.xlsx / .xls / .csv 対応</p>
        </>
      )}
    </div>
  );
};
