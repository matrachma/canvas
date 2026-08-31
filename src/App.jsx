import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import PreviewCanvas from './components/PreviewCanvas';
import SaveTemplateModal from './components/SaveTemplateModal';
import { transpileReactCode, generateSandboxHtml } from './utils/transpiler';
import { Play, CheckCircle2, FileCode, ArrowRight, Bookmark } from 'lucide-react';

const CODE_STORAGE_KEY = 'canvas_last_code_v1';
const TEMPLATES_STORAGE_KEY = 'canvas_custom_templates_v1';

export default function App() {
  // 1. Initial code state: blank if no previous code or first visit
  const [code, setCode] = useState(() => {
    const saved = localStorage.getItem(CODE_STORAGE_KEY);
    return saved !== null ? saved : '';
  });

  // 2. Custom templates stored in localStorage
  const [customTemplates, setCustomTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [viewMode, setViewMode] = useState('split'); // 'form' | 'split' | 'preview'
  const [htmlContent, setHtmlContent] = useState('');
  const [compilationError, setCompilationError] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Compile and generate HTML
  const compileAndRender = useCallback((codeToCompile, switchMode = false) => {
    if (!codeToCompile || codeToCompile.trim() === '') {
      setCompilationError(null);
      setHtmlContent(generateSandboxHtml(''));
      if (switchMode && viewMode === 'form') {
        setViewMode('preview');
      }
      return;
    }

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

  // Save last code to localStorage when code changes
  useEffect(() => {
    if (code !== null && code !== undefined) {
      if (code.trim().length > 0) {
        localStorage.setItem(CODE_STORAGE_KEY, code);
      } else {
        localStorage.removeItem(CODE_STORAGE_KEY);
      }
    }
  }, [code]);

  // Save custom templates to localStorage whenever customTemplates state updates
  useEffect(() => {
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(customTemplates));
    } catch (e) {
      console.error('Failed to save templates to localStorage', e);
    }
  }, [customTemplates]);

  // Triggered when user clicks "Submit / Render"
  const handleRender = () => {
    if (!code || code.trim() === '') {
      showToast('⚠️ Editor kosong. Tempelkan kode React JSX terlebih dahulu.');
      compileAndRender('', true);
      return;
    }
    compileAndRender(code, true);
    showToast('🚀 Kode berhasil di-render ke Canvas!');
  };

  // Load a template into the editor
  const handleSelectTemplate = (templateCode) => {
    setCode(templateCode);
    compileAndRender(templateCode, false);
    showToast('✨ Template berhasil dimuat ke editor!');
  };

  // Save current code as custom template
  const handleSaveTemplate = (templateName) => {
    const newTemplate = {
      id: 'template_' + Date.now(),
      name: templateName,
      code: code,
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setCustomTemplates((prev) => [newTemplate, ...prev]);
    showToast(`💾 Template "${templateName}" berhasil disimpan!`);
  };

  // Delete a custom template
  const handleDeleteCustomTemplate = (templateId) => {
    setCustomTemplates((prev) => prev.filter((tmpl) => tmpl.id !== templateId));
    showToast('🗑️ Template kustom berhasil dihapus.');
  };

  // Export standalone HTML file
  const handleExportHtml = () => {
    if (!code || code.trim() === '') {
      alert('Tidak ada kode untuk diexport. Editor saat ini masih kosong.');
      return;
    }
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
    link.download = 'canvas-rendered-component.html';
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
        onOpenSaveModal={() => setIsSaveModalOpen(true)}
        onDeleteCustomTemplate={handleDeleteCustomTemplate}
        customTemplates={customTemplates}
        onExportHtml={handleExportHtml}
        code={code}
      />

      {/* Save Template Modal Dialog */}
      <SaveTemplateModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveTemplate}
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

                <div className="flex items-center gap-2">
                  {code && code.trim().length > 0 && (
                    <button
                      onClick={() => setIsSaveModalOpen(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
                      title="Simpan sebagai Template"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Save as Template</span>
                    </button>
                  )}

                  <button
                    onClick={handleRender}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Submit & Render ke Canvas</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <CodeEditor 
                  code={code} 
                  setCode={setCode} 
                  onRender={handleRender}
                  onOpenSaveModal={() => setIsSaveModalOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: SPLIT PLAYGROUND MODE (Side by side) */}
        {viewMode === 'split' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
            <div className="h-full overflow-hidden">
              <CodeEditor 
                code={code} 
                setCode={setCode} 
                onRender={handleRender}
                onOpenSaveModal={() => setIsSaveModalOpen(true)}
              />
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
