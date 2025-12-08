import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, pdfData, pdfName } = await request.json();

    if (!to || !subject || !pdfData) {
      return NextResponse.json(
        { error: 'Email recipient, subject, and PDF data are required' },
        { status: 400 }
      );
    }

    // Create transporter using Gmail SMTP
    // NOTE: User perlu setup App Password di Google Account
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Email pengirim
        pass: process.env.EMAIL_PASSWORD, // App password dari Google
      },
    });

    // Convert base64 PDF data to buffer
    const pdfBuffer = Buffer.from(pdfData.split(',')[1], 'base64');

    // Email options
    const mailOptions = {
      from: `"Gia - AI Assistant" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #1e40af;">📊 Laporan dari Gia AI</h2>
          <p>Halo!</p>
          <p>Aku mengirimkan laporan yang kamu request. Silakan cek attachment untuk detail lengkapnya! 📎</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin: 5px 0 0 0;"><strong>Tanggal:</strong> ${new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</p>
          </div>
          
          <p>Kalau ada pertanyaan atau butuh laporan tambahan, feel free to reach out ya! ✨</p>
          
          <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            Powered by Gia AI Assistant<br>
            Generated on ${new Date().toLocaleString('id-ID')}
          </p>
        </div>
      `,
      attachments: [
        {
          filename: pdfName || `report-${Date.now()}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: 'Email berhasil dikirim!',
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
