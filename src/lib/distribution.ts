/**
 * distribution.ts
 * 文字数の分布バケットを計算する純関数
 */
import type { DistributionBucket } from '../types';

/** デフォルトのバケット幅 */
const DEFAULT_BUCKET_SIZE = 100;

/**
 * 文字数配列から分布バケット配列を計算する
 * @param charCounts 全行の文字数配列
 * @param bucketSize バケット幅（デフォルト 100）
 */
export function calcDistribution(
  charCounts: number[],
  bucketSize: number = DEFAULT_BUCKET_SIZE
): DistributionBucket[] {
  if (charCounts.length === 0) return [];

  const maxVal = Math.max(...charCounts);
  const bucketCount = Math.ceil((maxVal + 1) / bucketSize);

  // バケット配列を初期化
  const buckets: DistributionBucket[] = Array.from(
    { length: bucketCount },
    (_, i) => {
      const min = i * bucketSize;
      const max = (i + 1) * bucketSize - 1;
      return {
        min,
        max,
        label: `${min}–${max}`,
        count: 0,
      };
    }
  );

  // 各行をバケットに振り分け
  for (const count of charCounts) {
    const bucketIndex = Math.floor(count / bucketSize);
    // 念のため境界チェック
    const idx = Math.min(bucketIndex, buckets.length - 1);
    buckets[idx].count++;
  }

  return buckets;
}
