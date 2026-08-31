import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Code2, Layout, Monitor, Sparkles, Download, 
  Copy, Check, ChevronDown, Bookmark, Trash2, Plus, 
  FolderHeart, Layers
} from 'lucide-react';
import { DEFAULT_STARTER_TEMPLATES } from '../templates/sampleCode';

export default function Header({ 
  viewMode, 
  setViewMode, 
  onRender, 
  onSelectTemplate, 
  onOpenSaveModal,
  onDeleteCustomTemplate,
  customTemplates = [],
  onExportHtml, 
  code 
}) {
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowTemplates(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Templates</span>
            {customTemplates.length > 0 && (
              <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 text-[10px] font-mono rounded-md">
                {customTemplates.length}
              </span>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showTemplates && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 max-h-[80vh] overflow-y-auto">
              
              {/* Save Template Quick Button */}
              <div className="px-2 pb-2 border-b border-slate-800">
                <button
                  onClick={() => {
                    setShowTemplates(false);
                    onOpenSaveModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan Kode Ini Sebagai Template</span>
                </button>
              </div>

              {/* Custom Templates Section */}
              <div className="pt-2">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <FolderHeart className="w-3 h-3 text-rose-400" /> Template Kustom Anda
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    {customTemplates.length} tersimpan
                  </span>
                </div>

                {customTemplates.length > 0 ? (
                  <div className="space-y-1 px-1">
                    {customTemplates.map((tmpl) => (
                      <div
                        key={tmpl.id}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/80 group transition-colors"
                      >
                        <button
                          onClick={() => {
                            onSelectTemplate(tmpl.code);
                            setShowTemplates(false);
                          }}
                          className="flex-1 text-left min-w-0 pr-2 cursor-pointer"
                        >
                          <p className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                            {tmpl.name}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {tmpl.createdAt || 'Tersimpan'}
                          </p>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Hapus template "${tmpl.name}"?`)) {
                              onDeleteCustomTemplate(tmpl.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Hapus template ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-2 text-[11px] text-slate-500 italic">
                    Belum ada template kustom tersimpan.
                  </div>
                )}
              </div>

              {/* Starter Templates Section */}
              <div className="pt-2 border-t border-slate-800 mt-2">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Template Bawaan (Starter)
                </div>
                <div className="space-y-0.5 px-1">
                  {DEFAULT_STARTER_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => {
                        onSelectTemplate(tmpl.code);
                        setShowTemplates(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>{tmpl.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">Preset</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Save Template Button */}
        <button
          onClick={onOpenSaveModal}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition-colors cursor-pointer"
          title="Simpan kode saat ini ke LocalStorage sebagai template"
        >
          <Bookmark className="w-3.5 h-3.5 text-amber-400" />
          <span>Save as Template</span>
        </button>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-colors cursor-pointer"
          title="Salin Kode ke Clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>

        {/* Export HTML Button */}
        <button
          onClick={onExportHtml}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition-colors cursor-pointer"
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
