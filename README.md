# 🤖 AI Report Generator

Web application untuk generate laporan professional secara otomatis menggunakan AI (Groq API). Tinggal input update pekerjaan, AI akan membuat laporan detail, lalu download sebagai PDF.

## ✨ Features

- 🚀 **AI-Powered Report Generation** - Menggunakan Groq API dengan Llama 3.3 70B model
- 📄 **PDF Export** - Generate PDF professional dengan Puppeteer
- 🎨 **Modern UI** - Built with Next.js 15 + TailwindCSS
- ⚡ **Super Fast** - Groq API memberikan inference speed 70-80 tokens/second
- 💾 **Auto-formatted** - AI secara otomatis memformat laporan dengan struktur professional

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **Backend**: Next.js API Routes
- **AI**: Groq API (Llama 3.3 70B)
- **PDF Generation**: Puppeteer
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Groq API Key (gratis di [console.groq.com](https://console.groq.com/keys))

## 🚀 Installation & Setup

### 1. Clone atau Navigate ke Project

```bash
cd ai-report-generator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy file `.env.example` ke `.env.local`:

```bash
copy .env.example .env.local
```

Edit `.env.local` dan tambahkan Groq API key Anda:

```env
GROQ_API_KEY=gsk_your_actual_api_key_here
```

**Cara mendapatkan Groq API Key:**
1. Kunjungi [console.groq.com](https://console.groq.com/keys)
2. Sign up / Login
3. Create new API Key
4. Copy dan paste ke `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Buka browser dan akses: [http://localhost:3000](http://localhost:3000)

## 📖 Cara Penggunaan

1. **Input Update Pekerjaan**
   - Masukkan title laporan (optional)
   - Masukkan nama author (optional)
   - Tulis update pekerjaan di textarea

2. **Generate Report**
   - Klik tombol "Generate Report with AI"
   - AI akan memproses dan membuat laporan professional
   - Hasil akan muncul di panel kanan

3. **Download PDF**
   - Klik tombol "Download PDF"
   - PDF akan otomatis terdownload

## 📁 Project Structure

```
ai-report-generator/
├── app/
│   ├── api/
│   │   ├── generate-report/    # Groq AI endpoint
│   │   │   └── route.ts
│   │   └── generate-pdf/       # PDF generation endpoint
│   │       └── route.ts
│   ├── page.tsx                # Main UI
│   └── layout.tsx              # Root layout
├── .env.local                  # Environment variables (create this)
├── .env.example               # Environment template
├── package.json
└── README.md
```

## 🔧 Configuration

### Groq Model Options

Edit `app/api/generate-report/route.ts` untuk ganti model:

```typescript
model: 'llama-3.3-70b-versatile',  // Default (recommended)
// Opsi lain:
// 'llama-3.1-70b-versatile'
// 'mixtral-8x7b-32768'
// 'gemma2-9b-it'
```

### PDF Styling

Edit template HTML di `app/api/generate-pdf/route.ts` untuk customize styling PDF.

## 🌟 Example Input

```
- Completed user authentication API with JWT
- Fixed critical bug in payment gateway integration
- Implemented new dashboard UI with real-time analytics
- Conducted code review and refactoring for performance
- Updated documentation for deployment process
```

## 🎯 API Endpoints

### POST `/api/generate-report`
Generate laporan menggunakan Groq AI

**Request:**
```json
{
  "updates": "string - work updates"
}
```

**Response:**
```json
{
  "success": true,
  "report": "string - generated report",
  "model": "string - model used",
  "usage": {}
}
```

### POST `/api/generate-pdf`
Generate PDF dari report content

**Request:**
```json
{
  "reportContent": "string - report text",
  "title": "string - report title",
  "author": "string - author name"
}
```

**Response:** PDF file (binary)

## 🚀 Production Deployment

### Deploy to Vercel (Recommended)

1. Push code ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Add environment variable `GROQ_API_KEY`
4. Deploy!

### Build Locally

```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### Puppeteer Installation Issues

Jika ada error saat install Puppeteer di Windows:

```bash
npm install puppeteer --ignore-scripts
```

### Groq API Error 401

Pastikan `GROQ_API_KEY` sudah benar di `.env.local` dan restart dev server.

### PDF Generation Slow

Puppeteer membutuhkan waktu 2-5 detik untuk generate PDF. Ini normal.

## 📝 License

MIT License - bebas digunakan untuk project pribadi maupun komersial.

## 🤝 Contributing

Contributions are welcome! Silakan buat PR atau issue untuk improvements.

## 💡 Tips

- Gunakan detail updates untuk hasil report yang lebih comprehensive
- Groq API punya rate limit (free tier: 30 requests/minute)
- Untuk production, consider implementing caching dan rate limiting

## 📞 Support

Jika ada pertanyaan atau issues, silakan buat GitHub issue atau contact developer.

---

**Built with ❤️ using Next.js, Groq AI, and Puppeteer**


**Built with ❤️ using Next.js, Groq AI, and Puppeteer**

# Gia-AI
