import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { docType, prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const documentInstructions: Record<string, string> = {
      surat: `Format surat resmi Indonesia dengan struktur:
- Kop surat (placeholder)
- Nomor, Lampiran, Perihal
- Tanggal
- Kepada Yth. [tujuan]
- Salam pembuka
- Isi surat (paragraf pembuka, isi, penutup)
- Salam penutup
- Nama dan jabatan pengirim`,

      proposal: `Format proposal profesional dengan struktur:
- Judul Proposal
- Latar Belakang
- Tujuan
- Ruang Lingkup
- Metodologi/Pendekatan
- Timeline
- Budget (estimasi jika relevan)
- Penutup
Gunakan bahasa formal dan meyakinkan.`,

      email: `Format email profesional dengan:
- Subject line yang jelas
- Greeting yang tepat
- Paragraf pembuka (context)
- Isi utama (poin-poin penting)
- Call to action (jika ada)
- Penutup profesional
- Signature`,

      memo: `Format memo/pengumuman dengan:
- MEMO/PENGUMUMAN (header)
- Kepada: [penerima]
- Dari: [pengirim]
- Tanggal:
- Perihal:
- Isi pengumuman (singkat, jelas, terstruktur)
- Penutup`,

      laporan: `Format laporan singkat dengan:
- Judul Laporan
- Ringkasan Eksekutif
- Latar Belakang
- Temuan/Hasil
- Analisis
- Kesimpulan
- Rekomendasi`,

      sop: `Format SOP (Standard Operating Procedure) dengan:
- Judul SOP
- Tujuan
- Ruang Lingkup
- Definisi/Istilah
- Prosedur (step-by-step numbered)
- Penanggung Jawab
- Dokumen Terkait
Gunakan bahasa yang sangat jelas dan actionable.`,
    };

    const instruction = documentInstructions[docType] || documentInstructions.surat;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Halo! Saya Gia, specialist dalam crafting dokumen profesional yang impactful dan berkelas! 📝

JENIS DOKUMEN: ${docType}

EXPERTISE GIA DALAM PROFESSIONAL WRITING:
- ✍️ Formal Writing Excellence: Bahasa baku, presisi, dan authoritative
- 🎯 Audience-Centric Approach: Disesuaikan dengan context dan stakeholders
- 📋 Format Mastery: Struktur standar industri yang proper dan comprehensive
- 💼 Business Communication: Tone professional dengan persuasive elements
- 🔍 Detail-Oriented: Setiap kata dipilih dengan strategic purpose
- 🎨 Clarity & Impact: Komunikasi yang crystal clear tapi impactful

PENDEKATAN PENULISAN PROFESIONAL:
1. 🧠 Understand Purpose: Pahami objectives dan desired outcomes
2. 👥 Know the Audience: Sesuaikan register dan tone untuk pembaca
3. 📊 Structure Logically: Flow yang smooth dan easy to follow
4. 💎 Polish & Refine: Attention to detail untuk profesionalisme maksimal
5. ✨ Add Strategic Value: Bukan hanya template, tapi dokumen yang meaningful

${instruction}

CRITICAL REQUIREMENTS:
- Output PLAIN TEXT tanpa markdown symbols (#, **, *, -, dll)
- Bahasa Indonesia formal, baku, dan profesional tingkat tinggi
- Format sesuai standar industri dan best practices
- Comprehensive tapi concise - tidak bertele-tele
- Persuasive dan compelling jika jenis dokumen memerlukan
- Actionable dan clear dalam setiap instruksi atau poin
- Gunakan placeholder [brackets] untuk data yang perlu diisi user

QUALITY STANDARDS:
- Grammar dan tata bahasa sempurna
- Konsistensi dalam terminology dan formatting
- Professional tone throughout
- Logical flow dan coherence
- Appropriate level of formality
- Strategic use of language untuk maximum impact

Mari saya buatkan dokumen yang excellent! ✨`,
        },
        {
          role: 'user',
          content: `Buatkan dokumen ${docType} dengan detail berikut:\n\n${prompt}\n\nBuat dokumen yang lengkap, profesional, dan siap digunakan.`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2500,
    });

    const document = completion.choices[0]?.message?.content;

    if (!document) {
      return NextResponse.json(
        { error: 'Failed to generate document' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      document,
      model: completion.model,
    });
  } catch (error: any) {
    console.error('Error generating document:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
