import React, { useState } from 'react';
import { 
  Play, Code2, Layout, Monitor, Sparkles, Download, 
  RotateCcw, Copy, Check, ChevronDown, ExternalLink, ShieldCheck 
} from 'lucide-react';
import { TEMPLATES } from '../templates/sampleCode';

export default function Header({ 
  viewMode, 
  setViewMode, 
  onRender, 
  onSelectTemplate, 
  onReset, 
  onExportHtml, 
  code 
}) {
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0 select-none">
      
      {/* Brand Logo & Tag */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white">
              Canvas
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              React Live
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Paste JSX Code &bull; Instant HTML Render
          </p>
        </div>
      </div>

      {/* View Mode Switcher */}
      <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800/80">
        <button
          onClick={() => setViewMode('form')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === 'form'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Mode Form Input Teks"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Form Input</span>
        </button>

        <button
          onClick={() => setViewMode('split')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === 'split'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Mode Split (Editor & Preview)"
        >
          <Layout className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Split View</span>
        </button>

        <button
          onClick={() => setViewMode('preview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === 'preview'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Mode Full Canvas Preview"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Canvas Result</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        
        {/* Template Selector Dropdown */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition-colors"
          >
            <span>Templates</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showTemplates && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Pilih Contoh Kode
              </div>
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    onSelectTemplate(tmpl.code);
                    setShowTemplates(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-colors"
          title="Salin Kode ke Clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>

        {/* Export HTML Button */}
        <button
          onClick={onExportHtml}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition-colors"
          title="Download kode sebagai file .html mandiri"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>Export HTML</span>
        </button>

        {/* Primary Render / Submit Button */}
        <button
          onClick={onRender}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Render Canvas</span>
          <span className="hidden xl:inline text-[10px] font-normal bg-white/20 px-1.5 py-0.5 rounded">
            ⌘ + ↵
          </span>
        </button>
      </div>

    </header>
  );
}
