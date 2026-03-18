// =====================================================================
// 共通型定義
// =====================================================================

/** シートから抽出したデータ */
export interface SheetData {
  /** ヘッダー行（元の順序を保持） */
  headers: string[];
  /** データ行（ヘッダーをキーとした文字列マップの配列） */
  rows: Record<string, string>[];
}

/** 行ごとの分析結果 */
export interface RowAnalysis {
  /** 元のデータ行番号（1始まり、ヘッダーを除く） */
  rowIndex: number;
  /** 生成した行文字列 */
  rowString: string;
  /** 文字数 */
  charCount: number;
}

/** 統計情報 */
export interface Statistics {
  totalRows: number;
  minChars: number;
  maxChars: number;
  avgChars: number;
  medianChars: number;
  p95Chars: number;
}

/** 分布バケット */
export interface DistributionBucket {
  /** バケットの開始値（inclusive） */
  min: number;
  /** バケットの終了値（inclusive） */
  max: number;
  /** ラベル文字列 例: "0–99" */
  label: string;
  /** このバケットに含まれる行数 */
  count: number;
}

/** 行文字列生成オプション */
export interface RowStringOptions {
  /** 除外するヘッダー名のセット */
  excludedHeaders: Set<string>;
  /** 値が空の項目をスキップするか */
  skipEmpty: boolean;
  /** 値をトリムするか */
  trim: boolean;
}

/** 解析全体のオプション */
export interface AnalysisOptions extends RowStringOptions {
  /** 閾値（文字数） */
  threshold: number;
}

/** ファイル解析エラー種別 */
export type ParseErrorKind =
  | 'NO_FILE'
  | 'NO_SHEET'
  | 'NO_HEADER'
  | 'READ_FAILED'
  | 'UNKNOWN';

export interface ParseError {
  kind: ParseErrorKind;
  message: string;
}
