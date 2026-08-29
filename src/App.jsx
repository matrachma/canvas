import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import PreviewCanvas from './components/PreviewCanvas';
import { SIPGN_DASHBOARD_CODE } from './templates/sampleCode';
import { transpileReactCode, generateSandboxHtml } from './utils/transpiler';
import { Play, Sparkles, CheckCircle2, FileCode, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'canvas_jsx_code_v1';

export default function App() {
  const [code, setCode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? saved : SIPGN_DASHBOARD_CODE;
  });

  const [viewMode, setViewMode] = useState('split'); // 'form' | 'split' | 'preview'
  const [htmlContent, setHtmlContent] = useState('');
  const [compilationError, setCompilationError] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Compile and generate HTML
  const compileAndRender = useCallback((codeToCompile, switchMode = false) => {
    const { transpiledCode, error } = transpileReactCode(codeToCompile);

    if (error) {
      setCompilationError(error);
      setHtmlContent('');
    } else {
      setCompilationError(null);
      const generatedHtml = generateSandboxHtml(transpiledCode);
      setHtmlContent(generatedHtml);
      if (switchMode && viewMode === 'form') {
        setViewMode('preview');
      }
    }
  }, [viewMode]);

  // Initial compilation on mount
  useEffect(() => {
    compileAndRender(code, false);
  }, []);

  // Save to localStorage when code changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, code);
  }, [code]);

  // Triggered when user clicks "Submit / Render"
  const handleRender = () => {
    compileAndRender(code, true);
    showToast('🚀 Kode berhasil di-render ke Canvas!');
  };

  const handleSelectTemplate = (templateCode) => {
    setCode(templateCode);
    compileAndRender(templateCode, false);
    showToast('Template berhasil dimuat!');
  };

  const handleReset = () => {
    setCode(SIPGN_DASHBOARD_CODE);
    compileAndRender(SIPGN_DASHBOARD_CODE, false);
    showToast('Kode direset ke default SIPGN Dashboard.');
  };

  const handleExportHtml = () => {
    const { transpiledCode, error } = transpileReactCode(code);
    if (error) {
      alert(`Gagal export: ${error}`);
      return;
    }
    const fullHtml = generateSandboxHtml(transpiledCode);
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'canvas-rendered-dashboard.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('File HTML mandiri berhasil diunduh!');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Top Navbar */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        onRender={handleRender}
        onSelectTemplate={handleSelectTemplate}
        onReset={handleReset}
        onExportHtml={handleExportHtml}
        code={code}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area based on viewMode */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* MODE 1: FORM INPUT MODE (Focused input form with big Submit button) */}
        {viewMode === 'form' && (
          <div className="flex-1 flex flex-col max-w-6xl w-full mx-auto p-4 sm:p-6 overflow-hidden">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl">
              <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-400" />
                    Tempelkan Kode React / JSX Anda
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Mendukung Tailwind CSS, Recharts, Lucide Icons, dan React Hooks secara otomatis.
                  </p>
                </div>
                <button
                  onClick={handleRender}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Submit & Render ke Canvas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <CodeEditor code={code} setCode={setCode} onRender={handleRender} />
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: SPLIT PLAYGROUND MODE (Side by side) */}
        {viewMode === 'split' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
            <div className="h-full overflow-hidden">
              <CodeEditor code={code} setCode={setCode} onRender={handleRender} />
            </div>
            <div className="h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-slate-800">
              <PreviewCanvas
                htmlContent={htmlContent}
                compilationError={compilationError}
                viewMode={viewMode}
                onBackToEditor={() => setViewMode('form')}
              />
            </div>
          </div>
        )}

        {/* MODE 3: FULL CANVAS PREVIEW MODE */}
        {viewMode === 'preview' && (
          <div className="flex-1 h-full overflow-hidden">
            <PreviewCanvas
              htmlContent={htmlContent}
              compilationError={compilationError}
              viewMode={viewMode}
              onBackToEditor={() => setViewMode('form')}
            />
          </div>
        )}

      </main>

    </div>
  );
}
