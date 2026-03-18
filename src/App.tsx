import React, { useState, useCallback, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { fileToWorkbook, getSheetNames } from './lib/fileParser';
import { extractSheetData } from './lib/sheetUtils';
import { analyzeRows } from './lib/rowStringBuilder';
import { calcStatistics } from './lib/statistics';
import { calcDistribution } from './lib/distribution';
import { filterByThreshold, getTopRows } from './lib/thresholdFilter';
import {
  downloadRowAnalysisCsv,
  downloadStatsCsv,
  downloadDistributionCsv,
} from './lib/csvExporter';
import { FileUpload } from './components/FileUpload';
import { SheetSelector } from './components/SheetSelector';
import { OptionsPanel } from './components/OptionsPanel';
import { SummaryStats } from './components/SummaryStats';
import { DistributionChart } from './components/DistributionChart';
import { RowTable } from './components/RowTable';
import type { SheetData, RowAnalysis, Statistics, DistributionBucket, ParseError } from './types';
import './App.css';

interface AppState {
  workbook: XLSX.WorkBook | null;
  sheetNames: string[];
  selectedSheet: string;
  sheetData: SheetData | null;
  error: ParseError | null;
  isLoading: boolean;
}

const DEFAULT_TOP_N = 20;
const DEFAULT_THRESHOLD = 500;

const App: React.FC = () => {
  // ファイル・シート状態
  const [appState, setAppState] = useState<AppState>({
    workbook: null,
    sheetNames: [],
    selectedSheet: '',
    sheetData: null,
    error: null,
    isLoading: false,
  });

  // オプション状態
  const [excludedHeaders, setExcludedHeaders] = useState<Set<string>>(new Set());
  const [skipEmpty, setSkipEmpty] = useState(false);
  const [trim, setTrim] = useState(false);
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
  const [topN, setTopN] = useState(DEFAULT_TOP_N);

  // ファイル選択ハンドラ
  const handleFileSelected = useCallback(async (file: File) => {
    setAppState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const workbook = await fileToWorkbook(file);
      const sheetNames = getSheetNames(workbook);
      if (sheetNames.length === 0) {
        setAppState((prev) => ({
          ...prev,
          isLoading: false,
          error: { kind: 'NO_SHEET', message: 'シートが存在しません' },
        }));
        return;
      }
      const selectedSheet = sheetNames[0];
      const sheetData = extractSheetData(workbook, selectedSheet);
      // 除外列設定は維持しながら、新ファイルで存在しない列は自動除外から外す
      setExcludedHeaders((prev) => {
        const validHeaders = new Set(sheetData.headers);
        const next = new Set([...prev].filter((h) => validHeaders.has(h)));
        return next;
      });
      setAppState({
        workbook,
        sheetNames,
        selectedSheet,
        sheetData,
        error: null,
        isLoading: false,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setAppState((prev) => ({
        ...prev,
        isLoading: false,
        error: { kind: 'READ_FAILED', message: msg },
      }));
    }
  }, []);

  // シート切り替えハンドラ
  const handleSheetChange = useCallback(
    (name: string) => {
      if (!appState.workbook) return;
      try {
        const sheetData = extractSheetData(appState.workbook, name);
        setAppState((prev) => ({
          ...prev,
          selectedSheet: name,
          sheetData,
          error: null,
        }));
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setAppState((prev) => ({
          ...prev,
          selectedSheet: name,
          sheetData: null,
          error: { kind: 'READ_FAILED', message: msg },
        }));
      }
    },
    [appState.workbook]
  );

  // 行分析（オプション変更のたびに再計算）
  const analyses: RowAnalysis[] = useMemo(() => {
    if (!appState.sheetData) return [];
    return analyzeRows(appState.sheetData, { excludedHeaders, skipEmpty, trim });
  }, [appState.sheetData, excludedHeaders, skipEmpty, trim]);

  const charCounts = useMemo(() => analyses.map((r) => r.charCount), [analyses]);

  const stats: Statistics | null = useMemo(
    () => (charCounts.length > 0 ? calcStatistics(charCounts) : null),
    [charCounts]
  );

  const buckets: DistributionBucket[] = useMemo(
    () => calcDistribution(charCounts),
    [charCounts]
  );

  const topRows: RowAnalysis[] = useMemo(
    () => getTopRows(analyses, topN),
    [analyses, topN]
  );

  const overThresholdRows: RowAnalysis[] = useMemo(
    () => filterByThreshold(analyses, threshold),
    [analyses, threshold]
  );

  const hasData = appState.sheetData !== null && analyses.length > 0;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Excel 行長分析ツール</h1>
        <p className="app-desc">
          Dify ナレッジベース投入前の行文字数を可視化します
        </p>
      </header>

      <main className="app-main">
        {/* ファイルアップロード */}
        <FileUpload onFileSelected={handleFileSelected} isLoading={appState.isLoading} />

        {/* エラー表示 */}
        {appState.error && (
          <div className="error-banner">
            ⚠️ {appState.error.message}
          </div>
        )}

        {/* シート選択 */}
        {appState.sheetNames.length > 0 && (
          <SheetSelector
            sheetNames={appState.sheetNames}
            selectedSheet={appState.selectedSheet}
            onSheetChange={handleSheetChange}
          />
        )}

        {/* オプション */}
        {appState.sheetData && (
          <OptionsPanel
            headers={appState.sheetData.headers}
            excludedHeaders={excludedHeaders}
            onExcludedChange={setExcludedHeaders}
            skipEmpty={skipEmpty}
            onSkipEmptyChange={setSkipEmpty}
            trim={trim}
            onTrimChange={setTrim}
            threshold={threshold}
            onThresholdChange={setThreshold}
            topN={topN}
            onTopNChange={setTopN}
          />
        )}

        {/* 結果エリア */}
        {hasData && stats && (
          <>
            <SummaryStats
              stats={stats}
              onDownload={() => downloadStatsCsv(stats)}
            />

            <DistributionChart
              buckets={buckets}
              onDownload={() => downloadDistributionCsv(buckets)}
            />

            <RowTable
              title={`長い行 上位 ${topN} 件`}
              rows={topRows}
              displayLimit={topN}
              highlightThreshold={threshold}
              onDownload={() => downloadRowAnalysisCsv(topRows)}
            />

            <RowTable
              title={`閾値超過行（${threshold.toLocaleString()}文字超）`}
              rows={overThresholdRows}
              displayLimit={200}
              highlightThreshold={threshold}
              onDownload={
                overThresholdRows.length > 0
                  ? () => downloadRowAnalysisCsv(overThresholdRows)
                  : undefined
              }
            />
          </>
        )}

        {/* ファイルなし初期状態 */}
        {!appState.workbook && !appState.isLoading && !appState.error && (
          <div className="initial-hint">
            <p>ファイルを選択すると分析を開始します</p>
            <p className="hint-sub">ヘッダー行 + データ行の構成を前提とします</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
