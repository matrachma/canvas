import React, { useState, useEffect, useRef } from 'react';
import { Bookmark, X, Check, FileCode, AlertCircle } from 'lucide-react';

export default function SaveTemplateModal({ isOpen, onClose, onSave, code }) {
  const [templateName, setTemplateName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTemplateName('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const lineCount = code.split('\n').length;
  const charCount = code.length;
  const isCodeEmpty = !code || code.trim() === '';

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = templateName.trim();
    if (!trimmed) {
      setError('Silakan masukkan nama template.');
      return;
    }
    if (isCodeEmpty) {
      setError('Kode di editor masih kosong.');
      return;
    }

    onSave(trimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Simpan sebagai Template</h3>
              <p className="text-xs text-slate-400">Template akan tersimpan di browser (LocalStorage)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Nama Template
            </label>
            <input
              ref={inputRef}
              type="text"
              placeholder="Contoh: Dashboard SIPGN, Hero Section, dll."
              value={templateName}
              onChange={(e) => {
                setTemplateName(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {error && (
              <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Code Stats Info Box */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>Ukuran Kode</span>
            </div>
            <span className="font-mono text-slate-300 font-semibold">
              {lineCount} baris &bull; {charCount.toLocaleString()} karakter
            </span>
          </div>

          {isCodeEmpty && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>Editor saat ini masih kosong. Tulis atau paste kode terlebih dahulu sebelum menyimpan sebagai template.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isCodeEmpty || !templateName.trim()}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan Template</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
