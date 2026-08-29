import React, { useState, useEffect, useRef } from 'react';
import { 
  Laptop, Tablet, Smartphone, RotateCw, ExternalLink, 
  AlertTriangle, ArrowLeft, Maximize2, Minimize2, CheckCircle2 
} from 'lucide-react';

export default function PreviewCanvas({ 
  htmlContent, 
  compilationError, 
  viewMode, 
  onBackToEditor 
}) {
  const [device, setDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [iframeKey, setIframeKey] = useState(0);
  const [renderStatus, setRenderStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [runtimeError, setRuntimeError] = useState(null);
  const iframeRef = useRef(null);

  // Listen to postMessage from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'CANVAS_RENDER_SUCCESS') {
        setRenderStatus('success');
        setRuntimeError(null);
      } else if (event.data?.type === 'CANVAS_RENDER_ERROR') {
        setRenderStatus('error');
        setRuntimeError(event.data.error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Reset status when htmlContent changes
  useEffect(() => {
    setRenderStatus('loading');
    setRuntimeError(null);
  }, [htmlContent]);

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden relative">
      
      {/* Canvas Top Bar */}
      <div className="h-10 bg-slate-900/80 border-b border-slate-800 px-4 flex items-center justify-between text-xs shrink-0 z-10">
        
        {/* Left: Device Viewport Switcher & Back button */}
        <div className="flex items-center space-x-2">
          {viewMode === 'preview' && (
            <button
              onClick={onBackToEditor}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer mr-2"
              title="Kembali ke Form Editor"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Edit Code</span>
            </button>
          )}

          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-md transition-all ${
                device === 'desktop' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Tampilan Desktop (100%)"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded-md transition-all ${
                device === 'tablet' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Tampilan Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-md transition-all ${
                device === 'mobile' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Tampilan Mobile (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Live Status Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium">
          {compilationError ? (
            <span className="flex items-center text-rose-400 gap-1 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
              <AlertTriangle className="w-3 h-3" /> Syntax Error
            </span>
          ) : renderStatus === 'success' ? (
            <span className="flex items-center text-emerald-400 gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" /> Live Rendered
            </span>
          ) : (
            <span className="flex items-center text-slate-400 gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span> Rendering...
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleRefresh}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Reload Preview"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleOpenNewTab}
            className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg text-[11px] font-medium transition-colors"
            title="Buka Render di Tab Browser Baru"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Open New Tab</span>
          </button>
        </div>

      </div>

      {/* Main Canvas Viewport Container */}
      <div className="flex-1 bg-slate-950/90 flex items-center justify-center p-0 md:p-3 overflow-auto">
        
        {compilationError ? (
          /* Babel Syntax Error Display */
          <div className="max-w-2xl w-full m-6 p-6 bg-slate-900 border border-rose-500/50 rounded-2xl shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="text-sm font-bold text-rose-300">Kesalahan Sintaks Kompilasi JSX</h3>
                <p className="text-xs text-slate-400 mt-1">Periksa kembali penulisan tag atau tanda kurung pada kode Anda.</p>
                <pre className="mt-4 p-4 bg-slate-950 rounded-xl text-xs font-mono text-rose-300 overflow-x-auto border border-slate-800 whitespace-pre-wrap leading-relaxed">
                  {compilationError}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          /* Responsive Iframe Frame */
          <div 
            className={`h-full bg-white transition-all duration-300 flex flex-col ${
              device === 'desktop' 
                ? 'w-full rounded-none md:rounded-xl shadow-2xl border border-slate-800' 
                : device === 'tablet' 
                ? 'w-[768px] rounded-2xl shadow-2xl border-4 border-slate-800 my-auto' 
                : 'w-[375px] rounded-3xl shadow-2xl border-8 border-slate-800 my-auto'
            }`}
            style={{ minHeight: device === 'desktop' ? '100%' : '88%' }}
          >
            <iframe
              key={iframeKey}
              ref={iframeRef}
              srcDoc={htmlContent}
              title="Canvas Live Render"
              className="w-full h-full border-0 flex-1 rounded-[inherit]"
              sandbox="allow-scripts allow-modals allow-same-origin allow-popups"
            />
          </div>
        )}

      </div>

    </div>
  );
}
