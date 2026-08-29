# 🎨 Canvas — Instant React & Tailwind Live Playground

Canvas adalah aplikasi web interaktif untuk menulis, menempelkan (*paste*), dan me-render kode React JSX, Recharts, Lucide Icons, dan Tailwind CSS secara instan di browser.

![Canvas](https://raw.githubusercontent.com/matrachma/canvas/main/public/favicon.svg)

---

## ✨ Fitur Utama

- **📝 Form Input to Canvas View**: Tempelkan kode JSX Anda pada editor dengan *syntax highlighting* (Monaco Editor) lalu klik **Submit & Render** untuk langsung dialihkan ke hasil render HTML.
- **⚡ Split View Mode**: Tampilan berdampingan (*side-by-side*) antara code editor dan live rendered canvas.
- **🖥️ Full Responsive Preview**: Simulasi tampilan pada Desktop (100%), Tablet (768px), dan Mobile (375px).
- **📦 In-Browser Compiler**: Didukung oleh `@babel/standalone` dan Import Maps untuk me-load `react`, `react-dom`, `recharts`, `lucide-react`, dan Tailwind CSS CDN secara real-time tanpa server rendering.
- **📥 Export HTML**: Unduh hasil render sebagai file `.html` mandiri yang siap dibuka kapan saja di browser.
- **🌐 Akses Jaringan LAN**: Siap diakses oleh perangkat lain dalam satu jaringan Wi-Fi/LAN.

---

## 🚀 Memulai (Quick Start)

### 1. Install Dependensi
```bash
npm install
```

### 2. Jalankan Dev Server
```bash
npm run dev
```

Buka browser di:
- **Lokal**: `http://localhost:5173/`
- **Jaringan LAN**: `http://<IP-LAN-Anda>:5173/`

### 3. Build untuk Produksi
```bash
npm run build
```

---

## 🛠️ Stack Teknologi

- **Core**: [React 19](https://react.dev/), [Vite](https://vite.dev/)
- **Code Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Transpiler**: [@babel/standalone](https://babeljs.io/docs/babel-standalone)
- **Charts Engine**: [Recharts](https://recharts.org/)

