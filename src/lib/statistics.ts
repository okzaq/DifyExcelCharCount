/**
 * statistics.ts
 * 文字数配列から統計値を計算する純関数群
 */
import type { Statistics } from '../types';

/** パーセンタイル値を計算する（線形補間） */
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  const frac = index - lower;
  return sorted[lower] * (1 - frac) + sorted[upper] * frac;
}

/**
 * 文字数配列から統計情報を計算する
 * @param charCounts 全行の文字数配列
 */
export function calcStatistics(charCounts: number[]): Statistics {
  if (charCounts.length === 0) {
    return {
      totalRows: 0,
      minChars: 0,
      maxChars: 0,
      avgChars: 0,
      medianChars: 0,
      p95Chars: 0,
    };
  }

  const sorted = [...charCounts].sort((a, b) => a - b);
  const total = charCounts.reduce((sum, n) => sum + n, 0);

  return {
    totalRows: charCounts.length,
    minChars: sorted[0],
    maxChars: sorted[sorted.length - 1],
    avgChars: Math.round(total / charCounts.length),
    medianChars: Math.round(percentile(sorted, 50)),
    p95Chars: Math.round(percentile(sorted, 95)),
  };
}
