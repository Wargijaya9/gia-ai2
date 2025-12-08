# Setup Email untuk Gia AI

## 📧 Cara Setup Email Functionality

Gia sekarang bisa kirim laporan via email! Tapi perlu setup dulu:

### 1. **Enable Gmail App Password**

Karena Gmail punya 2-Factor Authentication, kamu gak bisa pakai password biasa. Harus pakai **App Password**:

1. Buka [Google Account Settings](https://myaccount.google.com/)
2. Pilih **Security** di sidebar
3. Di section "Signing in to Google", pastikan **2-Step Verification** sudah ON
4. Setelah 2-Step ON, balik ke **Security**, scroll ke bawah
5. Cari **App passwords** (muncul setelah 2-Step aktif)
6. Click **App passwords**
7. Pilih:
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Tulis nama: **Gia AI Assistant**
8. Click **Generate**
9. Google akan kasih 16-digit password - **COPY INI!**

### 2. **Setup Environment Variables**

Buka file `.env.local` di root project, tambahkan:

\`\`\`env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
\`\`\`

**Note:** 
- `EMAIL_USER` = Email Gmail kamu
- `EMAIL_PASSWORD` = 16-digit App Password yang tadi di-copy (dengan atau tanpa spasi, both work)

### 3. **Restart Development Server**

Setelah update `.env.local`:

\`\`\`bash
# Stop server (Ctrl+C)
# Start ulang
npm run dev
\`\`\`

### 4. **Test Email Functionality**

1. Generate report seperti biasa
2. Click tombol **"📧 Email Report"**
3. Masukkan email tujuan (bisa lebih dari satu, pisah pakai koma)
4. Click **Send**
5. Check inbox penerima!

## 🎯 Features Email

- ✅ Send PDF report sebagai attachment
- ✅ HTML email yang professional dan branded
- ✅ Multiple recipients (pisah pakai koma)
- ✅ Auto-include metadata (tanggal, subject, dll)
- ✅ Branded email signature dari Gia

## 📝 Email Format Example

Email yang dikirim bakal include:
- Header branded dari Gia AI
- Custom subject
- Summary metadata (subject, tanggal)
- PDF attachment
- Professional footer

## 🔒 Security Notes

- **JANGAN commit** `.env.local` ke Git!
- File ini sudah ada di `.gitignore`
- App Password hanya bisa lihat sekali - kalau hilang, generate ulang
- Bisa revoke App Password kapan saja di Google Account Settings

## ⚠️ Troubleshooting

**Error: "Invalid credentials"**
- Check EMAIL_USER dan EMAIL_PASSWORD sudah benar
- Pastikan 2-Step Verification ON
- Generate ulang App Password kalau perlu

**Email tidak terkirim**
- Check internet connection
- Verify email recipient valid
- Check Gmail sending limits (500 emails/day untuk free accounts)

**Server error 500**
- Pastikan nodemailer sudah installed: `npm install nodemailer`
- Check environment variables sudah di-load
- Restart dev server

## 📚 Additional Resources

- [Gmail App Passwords Guide](https://support.google.com/accounts/answer/185833)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
