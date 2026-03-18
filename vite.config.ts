import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages でのデプロイ先に合わせて base を設定
// リポジトリ名を環境変数 VITE_BASE_PATH で上書き可能
// 例: VITE_BASE_PATH=/excel-row-analyzer/ npm run build
const base = process.env['VITE_BASE_PATH'] ?? '/excel-row-analyzer/';

export default defineConfig({
  plugins: [react()],
  base,
});
