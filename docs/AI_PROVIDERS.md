# AI Provider Setup - Gia

Gia sekarang mendukung multiple AI providers! Kamu bisa menggunakan:
- **Groq AI** (Llama 3.3 70B) - Default
- **Google AI** (Gemini 1.5 Pro)

## Environment Variables

Tambahkan API keys berikut ke file `.env.local`:

```env
# Groq AI (Required - Default Provider)
GROQ_API_KEY=your_groq_api_key_here

# Google Gemini AI (Optional)
GEMINI_API_KEY=your_gemini_api_key_here
```

## Cara Mendapatkan API Keys

### 1. Groq API Key (Default)
1. Kunjungi https://console.groq.com
2. Sign up atau login
3. Buat API key baru
4. Copy dan paste ke `.env.local`

### 2. Google Gemini API Key (Optional)
1. Kunjungi https://makersuite.google.com/app/apikey
2. Login dengan Google account
3. Create API key
4. Copy dan paste ke `.env.local`

## Cara Menggunakan Multiple Models

### Di Chat API
```typescript
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [...],
    userMessage: 'Hello Gia!',
    provider: 'gemini', // atau 'groq' (default)
    model: 'gemini-1.5-pro-latest' // optional, akan gunakan default model
  })
})
```

### Di Generate Report API
```typescript
fetch('/api/generate-report', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    updates: 'Work updates...',
    workCategory: 'development',
    templateType: 'standard',
    provider: 'gemini', // atau 'groq' (default)
    model: 'gemini-1.5-pro-latest' // optional
  })
})
```

### Di Document Writer API
```typescript
fetch('/api/document-writer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    docType: 'surat',
    prompt: 'Buat surat...',
    provider: 'gemini', // atau 'groq' (default)
    model: 'gemini-1.5-pro-latest' // optional
  })
})
```

## Available Models

### Groq AI
- `llama-3.3-70b-versatile` (default)
- Model cepat dan powerful dari Meta
- Gratis dengan rate limit yang generous

### Google Gemini
- `gemini-1.5-pro-latest` (default)
- `gemini-1.5-flash-latest` (faster, lighter)
- Advanced multimodal model dari Google
- Gratis tier dengan quota harian

## Notes

- Jika tidak specify `provider`, akan gunakan Groq (default)
- Jika tidak specify `model`, akan gunakan default model dari provider tersebut
- Pastikan API key sudah dikonfigurasi sebelum menggunakan provider
- Response akan include info `model` dan `provider` yang digunakan

## Checking Provider Availability

Di code, kamu bisa check apakah provider available:

```typescript
import { isProviderAvailable } from '@/lib/ai-provider';

if (isProviderAvailable('gemini')) {
  // Gemini is configured and available
}

if (isProviderAvailable('groq')) {
  // Groq is configured and available
}
```
