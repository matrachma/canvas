import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { FileCode, Trash2, RotateCcw, Sparkles } from 'lucide-react';
import { SIPGN_DASHBOARD_CODE } from '../templates/sampleCode';

export default function CodeEditor({ code, setCode, onRender }) {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Add command for Cmd+Enter / Ctrl+Enter to trigger Render
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRender();
    });
  };

  const handleClear = () => {
    if (window.confirm('Hapus semua kode di editor?')) {
      setCode('');
    }
  };

  const handleLoadSample = () => {
    setCode(SIPGN_DASHBOARD_CODE);
  };

  const lineCount = code.split('\n').length;
  const charCount = code.length;

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800/80">
      
      {/* Editor Sub-header */}
      <div className="h-10 bg-slate-900/60 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <div className="flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-blue-400" />
          <span className="font-mono font-medium text-slate-300">App.jsx</span>
          <span className="text-[10px] text-slate-500 font-mono">
            ({lineCount} baris, {charCount.toLocaleString()} karakter)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleLoadSample}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Muat Ulang Template SIPGN"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Template</span>
          </button>

          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            title="Kosongkan Editor"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            automaticLayout: true,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            bracketPairColorization: { enabled: true },
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      {/* Editor Footer Help Bar */}
      <div className="h-7 bg-slate-900/90 border-t border-slate-800/80 px-4 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Sintaks JSX / React / Tailwind siap dijalankan</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-slate-400">
          <span>Tekan</span>
          <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300 font-mono border border-slate-700">⌘+Enter</kbd>
          <span>untuk Submit & Render</span>
        </div>
      </div>

    </div>
  );
}
