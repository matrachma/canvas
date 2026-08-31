import * as Babel from '@babel/standalone';

/**
 * Normalizes user code to make sure React imports and exports are handled gracefully.
 */
export function normalizeUserCode(rawCode) {
  let code = rawCode.trim();
  if (!code) return '';

  // If import React is not explicitly present, add it
  if (!code.includes("from 'react'") && !code.includes('from "react"')) {
    code = `import React from 'react';\n` + code;
  }

  // If there's no export default, try to detect top-level component name
  if (!code.includes('export default')) {
    const funcMatch = code.match(/function\s+([A-Z][a-zA-Z0-9_]*)/);
    const constMatch = code.match(/const\s+([A-Z][a-zA-Z0-9_]*)\s*=\s*/);
    const compName = (funcMatch && funcMatch[1]) || (constMatch && constMatch[1]) || 'App';
    code = code + `\nexport default ${compName};`;
  }

  return code;
}

/**
 * Transpiles JSX / Modern JS into standard ES modules using @babel/standalone
 */
export function transpileReactCode(rawCode) {
  if (!rawCode || rawCode.trim() === '') {
    return {
      transpiledCode: '',
      error: null,
      isEmpty: true
    };
  }

  try {
    const normalized = normalizeUserCode(rawCode);
    const result = Babel.transform(normalized, {
      presets: [
        ['react', { runtime: 'classic' }]
      ],
      plugins: []
    });

    return {
      transpiledCode: result.code,
      error: null,
      isEmpty: false
    };
  } catch (err) {
    return {
      transpiledCode: null,
      error: err.message,
      isEmpty: false
    };
  }
}

/**
 * Generates a complete standalone HTML document string that can be used in an iframe
 * or downloaded as a standalone HTML file.
 */
export function generateSandboxHtml(transpiledCode) {
  // If code is empty, return clean blank state page
  if (!transpiledCode || transpiledCode.trim() === '') {
    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Canvas Blank</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-400 select-none">
  <div class="max-w-md text-center space-y-4">
    <div class="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500 shadow-2xl">
      <svg class="w-8 h-8 text-blue-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    </div>
    <div>
      <h3 class="text-base font-bold text-slate-200">Canvas Siap Digunakan</h3>
      <p class="text-xs text-slate-500 mt-1 leading-relaxed">
        Editor saat ini kosong. Silakan tulis atau tempel kode React JSX di form input untuk melihat hasil render di sini.
      </p>
    </div>
  </div>
</body>
</html>`;
  }

  // Escape code safely for template insertion
  const codeBase64 = btoa(unescape(encodeURIComponent(transpiledCode)));

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Canvas Preview</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
          }
        }
      }
    }
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

  <!-- Import Maps for ES Modules CDN -->
  <script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18.3.1?dev",
      "react/": "https://esm.sh/react@18.3.1/",
      "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",
      "react-dom": "https://esm.sh/react-dom@18.3.1?dev",
      "react-dom/client": "https://esm.sh/react-dom@18.3.1/client?dev",
      "react-dom/": "https://esm.sh/react-dom@18.3.1/",
      "recharts": "https://esm.sh/recharts@2.12.7?external=react,react-dom",
      "recharts/": "https://esm.sh/recharts@2.12.7/",
      "lucide-react": "https://esm.sh/lucide-react@0.469.0?external=react,react-dom",
      "framer-motion": "https://esm.sh/framer-motion@11.15.0?external=react,react-dom",
      "clsx": "https://esm.sh/clsx@2.1.1",
      "tailwind-merge": "https://esm.sh/tailwind-merge@2.5.5"
    }
  }
  </script>

  <style>
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      color: #0f172a;
      min-height: 100vh;
    }
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(156, 163, 175, 0.4);
      border-radius: 9999px;
    }
    #loading-spinner {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      z-index: 50;
      transition: opacity 0.3s ease;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top-color: #2563eb;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div id="loading-spinner">
    <div class="spinner mb-3"></div>
    <p class="text-xs font-semibold text-slate-500 tracking-wide">Menyiapkan Canvas & Modul...</p>
  </div>

  <div id="root"></div>

  <div id="error-container" style="display:none; padding: 32px; font-family: 'JetBrains Mono', monospace; background: #0f172a; color: #f87171; min-height: 100vh;">
    <div style="max-width: 800px; margin: 0 auto; background: #1e293b; border: 1px solid #ef4444; border-radius: 16px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <span style="font-size: 24px;">⚠️</span>
        <div>
          <h3 style="font-size: 16px; font-weight: bold; color: #fca5a5; margin: 0;">Terjadi Kesalahan Saat Render Komponen</h3>
          <p style="font-size: 12px; color: #94a3b8; margin: 4px 0 0 0;">Periksa sintaks atau variabel pada kode yang Anda paste.</p>
        </div>
      </div>
      <pre id="error-message" style="white-space: pre-wrap; font-size: 12px; line-height: 1.6; color: #fecaca; background: #090d16; padding: 16px; border-radius: 8px; overflow-x: auto; border: 1px solid #334155;"></pre>
    </div>
  </div>

  <script type="module">
    import React, { Component } from 'react';
    import * as ReactDOMClient from 'react-dom/client';

    function hideLoading() {
      const spinner = document.getElementById('loading-spinner');
      if (spinner) {
        spinner.style.opacity = '0';
        setTimeout(() => spinner.remove(), 300);
      }
    }

    function showError(err) {
      hideLoading();
      const errContainer = document.getElementById('error-container');
      const errMsg = document.getElementById('error-message');
      const root = document.getElementById('root');
      if (errContainer && errMsg) {
        errContainer.style.display = 'block';
        errMsg.textContent = err;
        if (root) root.style.display = 'none';
      }
      if (window.parent) {
        window.parent.postMessage({ type: 'CANVAS_RENDER_ERROR', error: String(err) }, '*');
      }
    }

    window.onerror = function(msg, url, line, col, error) {
      showError((error && error.stack) || msg);
      return true;
    };

    window.onunhandledrejection = function(e) {
      const err = e.reason && (e.reason.stack || e.reason.message) || String(e.reason);
      showError(err);
    };

    class ErrorBoundary extends Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }
      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }
      componentDidCatch(error, errorInfo) {
        showError(error.stack || error.message);
      }
      render() {
        if (this.state.hasError) return null;
        return this.props.children;
      }
    }

    try {
      // Decode the transpiled JS module
      const decodedCode = decodeURIComponent(escape(atob("${codeBase64}")));
      const blob = new Blob([decodedCode], { type: 'application/javascript' });
      const moduleUrl = URL.createObjectURL(blob);

      const mod = await import(moduleUrl);
      const ComponentToRender = mod.default || mod.App || Object.values(mod).find(v => typeof v === 'function');

      if (!ComponentToRender) {
        throw new Error('Tidak ditemukan komponen React yang di-export (contoh: export default function App() { ... })');
      }

      const rootElement = document.getElementById('root');
      const root = ReactDOMClient.createRoot(rootElement);
      
      root.render(
        React.createElement(
          ErrorBoundary,
          null,
          React.createElement(ComponentToRender)
        )
      );

      hideLoading();
      if (window.parent) {
        window.parent.postMessage({ type: 'CANVAS_RENDER_SUCCESS' }, '*');
      }
    } catch (err) {
      showError(err.stack || err.message);
    }
  </script>
</body>
</html>`;
}
