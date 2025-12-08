# 🤖 Gia AI - Intelligent Report Generator & Virtual Assistant

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-orange?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)

**Meet Gia - Your 25-year-old friendly AI assistant who loves helping you create professional reports! ✨**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contact](#-contact)

</div>

---

## 🌟 About Gia

Halo! Aku Gia, AI assistant kamu yang friendly dan selalu siap membantu! 👋

Aku specialized dalam:
- 📊 **Report Generation**: Buat laporan profesional dari work updates kamu
- 💬 **Intelligent Chat**: Chat dengan memory - aku ingat conversation kita!
- 🎨 **Multi-Template Support**: 6 jenis template untuk berbagai kebutuhan
- 📧 **Email Integration**: Kirim report langsung via email
- 📄 **PDF Export**: Download laporan dalam format PDF profesional

**Personality:**
- Wanita 25 tahun yang friendly dan approachable
- Casual Indonesian language ("aku/kamu" instead of formal "saya/anda")
- Expert in analysis, strategic thinking, dan professional communication
- Always helpful, positive, dan solution-oriented!

---

## ✨ Features

### 🎯 Core Features

#### 1. **AI Report Generator**
Transform simple work updates into comprehensive professional reports:
- 🤖 **AI-Powered Analysis**: Llama 3.3 70B Versatile via Groq
- 📝 **Narrative Format**: Human-like storytelling, bukan tabel kaku
- **Bold Formatting**: Automatic bold untuk headings & key points
- 🖼️ **Image Support**: Upload screenshots, mockups, dokumentasi
- 🎨 **Beautiful PDF**: Arial font, custom margins, professional layout

#### 2. **Intelligent Chat with Memory**
Chat naturally dengan Gia yang ingat conversation history:
- 💾 **Persistent History**: LocalStorage untuk save semua conversations
- 🗂️ **Session Management**: Create, load, delete chat sessions
- 🧠 **Context-Aware**: Gia remember previous discussions
- ⚡ **Real-time Responses**: Fast responses via Groq API

#### 3. **Multiple Report Templates**
6 professional templates untuk different use cases:

| Template | Icon | Best For | Focus |
|----------|------|----------|-------|
| **Weekly Report** | 📅 | Team updates | Deliverables, blockers, planning |
| **Monthly Report** | 📆 | Strategic review | Analytics, long-term impact |
| **Project Report** | 🎯 | Sprint reviews | Technical implementation |
| **Client Report** | 🤝 | External stakeholders | Business value, ROI |
| **Technical Report** | 💻 | Engineering docs | Architecture, code quality |
| **Design Report** | 🎨 | Creative work | Visual deliverables, feedback |

#### 4. **Email Integration** ⭐ NEW
Send reports directly via email:
- 📧 **Gmail SMTP Integration**: Using nodemailer
- 👥 **Multiple Recipients**: Comma-separated email list
- 📎 **PDF Attachment**: Auto-attach generated PDF
- 🎨 **Branded Template**: Professional HTML email from Gia
- ✅ **Easy Setup**: Gmail App Password integration

#### 5. **Scheduled Reports** 🚧 Coming Soon
Automate recurring reports:
- ⏰ Daily, Weekly, Monthly schedules
- 📊 Template-based automation
- 📧 Auto-send via email
- 📈 Execution history & logs

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Groq API Key** - Get free at [console.groq.com](https://console.groq.com)
- **Gmail Account** (for email features) - Optional

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-report-generator
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**

Create `.env.local` in root directory:

```env
# Required: Groq API Key
GROQ_API_KEY=your_groq_api_key_here

# Optional: Email Integration (for sending reports)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

> 💡 **Getting Groq API Key:**
> 1. Visit [console.groq.com](https://console.groq.com)
> 2. Sign up / Login
> 3. Go to API Keys section
> 4. Create new API key
> 5. Copy and paste to `.env.local`

> 📧 **Email Setup (Optional):**
> See [docs/EMAIL_SETUP.md](./docs/EMAIL_SETUP.md) for detailed Gmail App Password setup

4. **Run Development Server**
```bash
npm run dev
# or
yarn dev
```

5. **Open Browser**
```
http://localhost:3000
```

That's it! Gia is ready to help! 🎉

---

## 📖 Documentation

### Quick Links

- 📧 **[Email Setup Guide](./docs/EMAIL_SETUP.md)** - Configure Gmail for sending reports
- 🚀 **[Advanced Features Guide](./docs/ADVANCED_FEATURES.md)** - Templates, email, scheduling

### Project Structure

```
ai-report-generator/
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # Chat API endpoint
│   │   ├── generate-report/route.ts   # Report generation
│   │   ├── generate-pdf/route.ts      # PDF creation
│   │   └── send-email/route.ts        # Email sending ⭐ NEW
│   ├── dashboard/
│   │   ├── chat/page.tsx              # Chat interface
│   │   ├── report/page.tsx            # Report generator
│   │   └── layout.tsx                 # Dashboard layout
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Landing page
├── lib/
│   ├── report-templates.ts            # 6 report templates ⭐ NEW
│   ├── scheduler.ts                   # Scheduled reports ⭐ NEW
│   └── groq.ts                        # Groq client config
├── config/
│   └── gia-config.ts                  # Gia's personality
├── docs/
│   ├── EMAIL_SETUP.md                 # Email configuration
│   └── ADVANCED_FEATURES.md           # Feature documentation
├── public/                            # Static assets
├── .env.local                         # Environment variables (create this)
└── package.json                       # Dependencies
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.7 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State**: React Hooks (useState, useEffect, useRef)
- **Storage**: localStorage (chat history, sessions)

### Backend
- **API Routes**: Next.js API Routes
- **AI**: Groq SDK (Llama 3.3 70B Versatile)
- **PDF**: Puppeteer
- **Email**: Nodemailer with Gmail SMTP

### Key Libraries
```json
{
  "next": "^16.0.7",
  "react": "^19.0.0",
  "groq-sdk": "^0.9.0",
  "puppeteer": "^23.11.1",
  "nodemailer": "^6.9.16",
  "tailwindcss": "^3.4.17",
  "typescript": "^5"
}
```

---

## 📋 Usage Guide

### Generating Reports

1. **Select Template**
   - Choose dari 6 available templates
   - Title auto-populated based on template

2. **Fill Information**
   - Work category (Development/Design/Video/Mixed)
   - Work updates (detailed text)
   - Optional: Author name, doc number
   - Optional: Upload images/screenshots

3. **Generate**
   - Click "✨ Generate Laporan dengan AI"
   - Wait for Gia to analyze (typically 5-10 seconds)
   - Review generated report in right panel

4. **Export**
   - **Download PDF**: Click "📄 Download PDF"
   - **Email**: Click "📧 Email Report", enter recipients, send

### Chatting with Gia

1. **Start New Session**
   - Auto-creates on first visit
   - Or click "+ New Chat" for fresh session

2. **Chat Naturally**
   - Type message in input box
   - Gia responds with context awareness
   - References past conversations if relevant

3. **Manage Sessions**
   - View all sessions in sidebar
   - Click to load previous conversation
   - Delete unwanted sessions
   - History persisted in localStorage

### Using Templates

Each template optimizes report structure for specific use case:

**📅 Weekly Report**: Quick updates, what's done, what's next
- Perfect for: Stand-ups, team syncs, manager updates

**📆 Monthly Report**: Strategic overview, metrics, analysis
- Perfect for: Performance reviews, stakeholder updates

**🎯 Project Report**: Technical details, deliverables
- Perfect for: Sprint reviews, milestone documentation

**🤝 Client Report**: Business-focused, professional tone
- Perfect for: External communications, presentations

**💻 Technical Report**: Deep technical dive, architecture
- Perfect for: Engineering docs, code reviews

**🎨 Design Report**: Visual focus, user feedback
- Perfect for: Design sprints, creative reviews

---

## ⚙️ Configuration

### Gia's Personality

Edit `config/gia-config.ts` to customize:

```typescript
export const giaConfig = {
  name: 'Gia',
  age: 25,
  personality: 'friendly, helpful, approachable',
  language: 'casual Indonesian (aku/kamu)',
  expertise: [
    'Report analysis',
    'Strategic thinking',
    'Professional communication'
  ]
};
```

### Report Templates

Add/modify templates in `lib/report-templates.ts`:

```typescript
export const reportTemplates = {
  custom: {
    name: 'Custom Template',
    title: 'Custom Report Title',
    icon: '📋',
    description: 'Your description',
    focus: ['Point 1', 'Point 2']
  }
};
```

### Email Settings

Configure in `.env.local`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=Gia AI Assistant
```

---

## 🔐 Security & Privacy

### Data Storage
- **Chat History**: Stored locally in browser (localStorage)
- **Reports**: Generated on-demand, not persisted
- **Images**: Processed in-memory, not saved to disk
- **Email**: Credentials in `.env.local` (gitignored)

### API Keys
- Groq API key required for AI functionality
- Gmail App Password (not your actual password) for email
- All keys stored in `.env.local` (never committed to Git)

### Best Practices
✅ Use Gmail App Passwords, not account password  
✅ Keep `.env.local` in `.gitignore`  
✅ Rotate API keys periodically  
✅ Don't share API keys publicly  
✅ Review email recipients before sending  

---

## 🐛 Troubleshooting

### Common Issues

#### "Failed to generate report"
- ✅ Check GROQ_API_KEY in `.env.local`
- ✅ Verify internet connection
- ✅ Check Groq API quota/limits
- ✅ Restart dev server after adding env vars

#### "Email failed to send"
- ✅ Verify EMAIL_USER and EMAIL_PASSWORD in `.env.local`
- ✅ Check Gmail App Password (not account password)
- ✅ Enable 2FA on Gmail account
- ✅ See [EMAIL_SETUP.md](./docs/EMAIL_SETUP.md)

#### "Chat history not saving"
- ✅ Check browser localStorage enabled
- ✅ Clear browser cache and try again
- ✅ Check browser console for errors

#### "PDF download not working"
- ✅ Allow pop-ups for localhost
- ✅ Check Puppeteer installation: `npm install puppeteer`
- ✅ Try different browser

### Getting Help

1. Check [docs/ADVANCED_FEATURES.md](./docs/ADVANCED_FEATURES.md)
2. Check [docs/EMAIL_SETUP.md](./docs/EMAIL_SETUP.md)
3. Review browser console for errors
4. Create GitHub issue with details
5. Contact: srtcreativedesign@gmail.com

---

## 🗺️ Roadmap

### ✅ Completed
- [x] AI Report Generation
- [x] Gia Chat Interface
- [x] Chat History & Memory
- [x] PDF Export with Arial font
- [x] Custom PDF margins
- [x] Bold formatting support
- [x] Image upload & embedding
- [x] 6 Report Templates
- [x] Email Integration
- [x] Template-specific prompting

### 🚧 In Progress
- [ ] Scheduled Reports UI
- [ ] Report History/Archive
- [ ] Template customization
- [ ] Email analytics (open rates)

### 📅 Planned
- [ ] Multi-language support (EN/ID)
- [ ] Report comparison feature
- [ ] Custom branding/themes
- [ ] Slack/Teams integration
- [ ] Jira/Trello sync
- [ ] GitHub activity auto-include
- [ ] Multi-author collaboration
- [ ] Comment system on reports
- [ ] Advanced AI insights (trends, predictions)
- [ ] Mobile app

---

## 🤝 Contributing

Contributions welcome! Here's how:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use TailwindCSS for styling
- Maintain Gia's friendly personality
- Add comments for complex logic
- Test email features before committing
- Update documentation as needed

---

## 📜 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👏 Acknowledgments

- **Groq** - Lightning-fast AI inference
- **Meta** - Llama 3.3 70B model
- **Next.js Team** - Amazing React framework
- **Puppeteer** - Powerful PDF generation
- **Nodemailer** - Reliable email sending
- **TailwindCSS** - Beautiful utility-first CSS

---

## 📞 Contact

**Gia AI Project**
- Email: srtcreativedesign@gmail.com
- Division: Creative Design & System Development

---

<div align="center">

**Made with ❤️ by Gia AI**

*Empowering productivity through intelligent automation*

[⬆ Back to Top](#-gia-ai---intelligent-report-generator--virtual-assistant)

</div>
