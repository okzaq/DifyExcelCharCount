/**
 * csvExporter.ts
 * 分析結果を CSV ダウンロードするユーティリティ
 */
import type { RowAnalysis, Statistics, DistributionBucket } from '../types';

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toCsvRow(fields: string[]): string {
  return fields.map(escapeCsvField).join(',');
}

function downloadCsv(content: string, filename: string): void {
  // BOM付きUTF-8でExcelでも文字化けしないように
  const bom = '\uFEFF';
  const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** 全行の分析結果を CSV ダウンロード */
export function downloadRowAnalysisCsv(analyses: RowAnalysis[]): void {
  const header = toCsvRow(['行番号', '文字数', '生成文字列']);
  const rows = analyses.map((r) =>
    toCsvRow([String(r.rowIndex), String(r.charCount), r.rowString])
  );
  const content = [header, ...rows].join('\r\n');
  downloadCsv(content, 'row_analysis.csv');
}

/** 統計情報を CSV ダウンロード */
export function downloadStatsCsv(stats: Statistics): void {
  const rows = [
    ['項目', '値'],
    ['総行数', String(stats.totalRows)],
    ['最小文字数', String(stats.minChars)],
    ['最大文字数', String(stats.maxChars)],
    ['平均文字数', String(stats.avgChars)],
    ['中央値', String(stats.medianChars)],
    ['95パーセンタイル', String(stats.p95Chars)],
  ];
  const content = rows.map(toCsvRow).join('\r\n');
  downloadCsv(content, 'statistics.csv');
}

/** 分布を CSV ダウンロード */
export function downloadDistributionCsv(buckets: DistributionBucket[]): void {
  const header = toCsvRow(['範囲', '件数']);
  const rows = buckets.map((b) => toCsvRow([b.label, String(b.count)]));
  const content = [header, ...rows].join('\r\n');
  downloadCsv(content, 'distribution.csv');
}
