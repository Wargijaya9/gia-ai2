import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { chartToSVG } from '@/lib/chart-generator';

export async function POST(request: NextRequest) {
  let browser;
  
  try {
    const { reportContent, title, author, docNumber, images, workCategory, chartData } = await request.json();

    if (!reportContent) {
      return NextResponse.json(
        { error: 'Report content is required' },
        { status: 400 }
      );
    }

    console.log('PDF Generation - chartData:', chartData ? 'Present' : 'Not present');

    const currentDate = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Helper to safely generate SVG
    const safeChartToSVG = (chartConfig: any) => {
      try {
        if (!chartConfig) return '<p>Chart data not available</p>';
        return chartToSVG(chartConfig);
      } catch (err) {
        console.error('Error generating chart SVG:', err);
        return '<p>Error rendering chart</p>';
      }
    };

    // HTML template for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      padding: 40px;
      background: white;
    }
    
    .letterhead {
      border-bottom: 3px solid #1e40af;
      padding-bottom: 15px;
      margin-bottom: 5px;
    }
    
    .company-name {
      font-size: 24px;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .division-name {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
      margin-bottom: 3px;
    }
    
    .company-info {
      font-size: 11px;
      color: #9ca3af;
      line-height: 1.4;
    }
    
    .header {
      margin-top: 30px;
      margin-bottom: 30px;
    }
    
    .report-title {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 15px;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .meta-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      font-size: 13px;
      color: #374151;
      border: 1px solid #e5e7eb;
      padding: 15px;
      background-color: #f9fafb;
      border-radius: 4px;
    }
    
    .meta-item {
      display: flex;
    }
    
    .meta-label {
      font-weight: 600;
      min-width: 100px;
      color: #1f2937;
    }
    
    .meta-value {
      color: #4b5563;
    }
    
    .content {
      margin-top: 30px;
      white-space: pre-wrap;
      font-size: 14px;
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
    }
    
    .content table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 13px;
    }
    
    .content table th,
    .content table td {
      border: 1px solid #d1d5db;
      padding: 10px;
      text-align: left;
    }
    
    .content table th {
      background-color: #f3f4f6;
      font-weight: 600;
      color: #1f2937;
    }
    
    .content table tr:nth-child(even) {
      background-color: #f9fafb;
    }
    
    .documentation {
      margin-top: 40px;
      page-break-before: auto;
    }
    
    .documentation h2 {
      color: #1e40af;
      font-size: 18px;
      margin-bottom: 20px;
      font-weight: 600;
    }
    
    .image-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-top: 20px;
    }
    
    .image-container {
      border: 1px solid #e5e7eb;
      padding: 10px;
      border-radius: 4px;
      background-color: #f9fafb;
    }
    
    .image-container img {
      width: 100%;
      height: auto;
      border-radius: 4px;
      margin-bottom: 8px;
    }
    
    .image-caption {
      font-size: 11px;
      color: #6b7280;
      text-align: center;
      font-style: italic;
    }
    
    .charts-section {
      margin-top: 40px;
      page-break-before: auto;
    }
    
    .charts-section h2 {
      color: #1e40af;
      font-size: 18px;
      margin-bottom: 20px;
      font-weight: 600;
    }
    
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-top: 20px;
    }
    
    .chart-container {
      border: 1px solid #e5e7eb;
      padding: 10px;
      border-radius: 8px;
      background-color: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      min-height: 320px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .chart-container.full-width {
      grid-column: span 2;
    }
    
    .chart-title {
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 10px;
      text-align: center;
    }
    
    .chart-container svg {
      width: 100%;
      height: auto;
      max-width: 100%;
      display: block;
      margin: 0 auto;
    }
      max-width: 100%;
      display: block;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .metric-card {
      border: 1px solid #e5e7eb;
      padding: 15px;
      border-radius: 8px;
      background-color: #f9fafb;
      text-align: center;
    }
    
    .metric-value {
      font-size: 28px;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 5px;
    }
    
    .metric-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .content h2 {
      color: #1e40af;
      font-size: 20px;
      margin-top: 25px;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    .content h3 {
      color: #374151;
      font-size: 16px;
      margin-top: 20px;
      margin-bottom: 10px;
      font-weight: 600;
    }
    
    .content p {
      margin-bottom: 12px;
      text-align: justify;
    }
    
    .content strong {
      font-weight: 700;
      color: #1f2937;
    }
    
    .content ul, .content ol {
      margin-left: 25px;
      margin-bottom: 12px;
    }
    
    .content li {
      margin-bottom: 6px;
    }
    
    .content li strong {
      font-weight: 700;
      color: #1e40af;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
    }
    
    @media print {
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <!-- Letterhead / Kop Surat -->
  <div class="letterhead">
    <div class="company-name">SRT CORP</div>
    <div class="division-name">Divisi Creative & System Development</div>
    <div class="company-info">
      Alamat: Jakarta, Indonesia | Telepon: 085175090448 | Email: Srtcreativedesign@gmail.com
    </div>
  </div>
  
  <!-- Report Header -->
  <div class="header">
    <div class="report-title">${title || 'Laporan Progress Pekerjaan'}</div>
    <div class="meta-info">
      <div class="meta-item">
        <span class="meta-label">Nomor</span>
        <span class="meta-value">: ${docNumber || '[Nomor Dokumen]'}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Tanggal</span>
        <span class="meta-value">: ${currentDate}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Dibuat oleh</span>
        <span class="meta-value">: ${author || '[Nama Pembuat]'}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Divisi</span>
        <span class="meta-value">: Creative & System Development</span>
      </div>
    </div>
  </div>
  
  <div class="content">
    ${formatMarkdownToHTML(reportContent)}
  </div>
  
  ${chartData && chartData.metrics ? `
  <div class="charts-section">
    <h2>📊 ANALISIS & VISUALISASI DATA</h2>
    
    <!-- Metrics Overview -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-value">${chartData.metrics.tasksCompleted + chartData.metrics.tasksInProgress + chartData.metrics.tasksPending}</div>
        <div class="metric-label">Total Tasks</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${chartData.metrics.tasksCompleted}</div>
        <div class="metric-label">Completed</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${Math.round((chartData.metrics.tasksCompleted / (chartData.metrics.tasksCompleted + chartData.metrics.tasksInProgress + chartData.metrics.tasksPending)) * 100) || 0}%</div>
        <div class="metric-label">Completion Rate</div>
      </div>
    </div>
    
    <!-- Charts -->
    <div class="charts-grid">
      <div class="chart-container">
        ${safeChartToSVG(chartData.progress)}
      </div>
      <div class="chart-container">
        ${safeChartToSVG(chartData.category)}
      </div>
      <div class="chart-container full-width">
        ${safeChartToSVG(chartData.timeline)}
      </div>
    </div>
  </div>
  ` : ''}
  
  ${images && images.length > 0 ? `
  <div class="documentation">
    <h2>DOKUMENTASI</h2>
    <div class="image-grid">
      ${images.map((img: any, idx: number) => `
        <div class="image-container">
          <img src="${img.data}" alt="${img.name}" />
          <div class="image-caption">Gambar ${idx + 1}: ${img.name}</div>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}
  
  <div class="footer">
    ${currentDate}
  </div>
</body>
</html>
    `;

    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '3cm',
        bottom: '3cm',
        left: '3.5cm',
      },
    });

    await browser.close();

    // Return PDF as response
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="report-${Date.now()}.pdf"`,
      },
    });
  } catch (error: any) {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    console.error('Error generating PDF:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to generate PDF', details: error.stack },
      { status: 500 }
    );
  }
}

// Helper function to convert markdown-like formatting to HTML
function formatMarkdownToHTML(text: string): string {
  let html = text;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*<\/li>)/g, '<ul>$1</ul>');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  // Clean up
  html = html.replace(/<p><h/g, '<h');
  html = html.replace(/<\/h([1-3])><\/p>/g, '</h$1>');
  html = html.replace(/<p><ul>/g, '<ul>');
  html = html.replace(/<\/ul><\/p>/g, '</ul>');

  return html;
}
