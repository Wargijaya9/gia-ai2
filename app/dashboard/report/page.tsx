'use client';

import { useState, useEffect } from 'react';
import { reportTemplates, type TemplateType } from '@/lib/report-templates';
import { generateAllCharts, type ChartConfig } from '@/lib/chart-generator';
import { ChartComponent, MetricCard, ProgressCard } from '@/components/Charts';

export default function Home() {
  const [updates, setUpdates] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [workCategory, setWorkCategory] = useState('development');
  const [templateType, setTemplateType] = useState<TemplateType>('weekly');
  const [images, setImages] = useState<File[]>([]);
  const [generatedReport, setGeneratedReport] = useState('');
  const [pdfDataUrl, setPdfDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState('');
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState<{
    progress: ChartConfig;
    category: ChartConfig;
    timeline: ChartConfig;
    metrics: any;
  } | null>(null);

  // Auto-generate charts when updates change
  useEffect(() => {
    if (updates.trim()) {
      const charts = generateAllCharts(updates);
      setChartData(charts);
    } else {
      setChartData(null);
    }
  }, [updates]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateReport = async () => {
    if (!updates.trim()) {
      setError('Please enter your work updates');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedReport('');

    try {
      // Convert images to base64
      const imageDataPromises = images.map((file) => {
        return new Promise<{ name: string; data: string }>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              name: file.name,
              data: reader.result as string,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const imageData = await Promise.all(imageDataPromises);

      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          updates, 
          workCategory,
          templateType,
          images: imageData 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report');
      }

      setGeneratedReport(data.report);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!generatedReport) return;

    setIsPdfGenerating(true);
    setError('');

    try {
      // Convert images to base64 again for PDF
      const imageDataPromises = images.map((file) => {
        return new Promise<{ name: string; data: string }>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              name: file.name,
              data: reader.result as string,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const imageData = await Promise.all(imageDataPromises);

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportContent: generatedReport,
          title: title || 'Laporan Progress Pekerjaan',
          author: author || '[Nama Pembuat]',
          docNumber: docNumber || '[Nomor Dokumen]',
          images: imageData,
          workCategory,
          chartData: chartData, // Include charts
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate PDF');
      }

      // Download PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Convert blob to base64 and store for email
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setPdfDataUrl(base64Data); // Store base64 instead of blob URL
      };
      reader.readAsDataURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailRecipients.trim()) {
      setError('Please enter at least one email recipient');
      return;
    }

    if (!pdfDataUrl) {
      setError('Please generate and download PDF first');
      return;
    }

    setIsSendingEmail(true);
    setError('');

    try {
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailRecipients,
          subject: title || reportTemplates[templateType].defaultTitle,
          pdfData: pdfDataUrl, // Already base64
          pdfName: `${title || 'Report'}-${Date.now()}.pdf`,
        }),
      });

      const data = await emailResponse.json();

      if (!emailResponse.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      // Success!
      setShowEmailModal(false);
      setEmailRecipients('');
      alert('Email sent successfully! ✅');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            📊 AI Report Generator
          </h1>
          <p className="text-xl text-gray-600">
            Biar aku bikinin laporan profesional buat kamu! Tinggal kasih tau aja apa yang udah dikerjain ✨
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              Powered by Gia AI
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              Llama 3.3 70B
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Input Your Updates
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Laporan (Opsional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Laporan Progress Mingguan"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Pembuat (Opsional)
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Dokumen (Opsional)
                </label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="Contoh: RPT/CSD/XII/2025/001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Laporan *
                </label>
                <select
                  value={templateType}
                  onChange={(e) => {
                    const newTemplate = e.target.value as TemplateType;
                    setTemplateType(newTemplate);
                    // Auto-populate title based on template
                    if (!title) {
                      setTitle(reportTemplates[newTemplate].defaultTitle);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {Object.entries(reportTemplates).map(([key, template]) => (
                    <option key={key} value={key}>
                      {template.icon} {template.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {reportTemplates[templateType].description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori Pekerjaan *
                </label>
                <select
                  value={workCategory}
                  onChange={(e) => setWorkCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="development">System Development</option>
                  <option value="design">Creative Design</option>
                  <option value="video">Video Production</option>
                  <option value="mixed">Mixed (Design + Development + Video)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Pekerjaan *
                </label>
                <textarea
                  value={updates}
                  onChange={(e) => setUpdates(e.target.value)}
                  placeholder="Masukkan detail pekerjaan yang sudah dikerjakan...&#10;&#10;Contoh:&#10;- Membuat design landing page untuk website company profile&#10;- Implementasi API untuk user authentication&#10;- Editing video promosi produk baru&#10;- Code review dan refactoring module payment"
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dokumentasi / Screenshot (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload screenshot design, mockup, atau dokumentasi pekerjaan
                </p>
                
                {images.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200"
                      >
                        <span className="text-sm text-gray-700 truncate flex-1">
                          {img.name}
                        </span>
                        <button
                          onClick={() => removeImage(idx)}
                          className="ml-2 text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerateReport}
                disabled={isGenerating || !updates.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sedang Membuat Laporan...
                  </span>
                ) : (
                  '✨ Generate Laporan dengan AI'
                )}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Generated Report
              </h2>
              {generatedReport && (
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isPdfGenerating}
                    className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                  >
                    {isPdfGenerating ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      '📄 Download PDF'
                    )}
                  </button>
                  
                  {pdfDataUrl && (
                    <button
                      onClick={() => setShowEmailModal(true)}
                      className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                    >
                      📧 Email Report
                    </button>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                <p className="font-medium">Error:</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {generatedReport ? (
              <div className="prose prose-sm max-w-none">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                    {generatedReport}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium">No report generated yet</p>
                <p className="text-sm">Enter your updates and click generate</p>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Charts Section */}
        {chartData && (
          <div className="max-w-7xl mx-auto mt-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    📊 Work Analytics & Insights
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Visual representation dari work updates kamu
                  </p>
                </div>
                <button
                  onClick={() => setShowCharts(!showCharts)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {showCharts ? '📉 Hide Charts' : '📈 Show Charts'}
                </button>
              </div>

              {showCharts && (
                <div className="space-y-6">
                  {/* Metrics Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard
                      title="Tasks Completed"
                      value={chartData.metrics.tasksCompleted}
                      subtitle="Successfully finished"
                      icon="✅"
                      color="#10B981"
                    />
                    <MetricCard
                      title="In Progress"
                      value={chartData.metrics.tasksInProgress}
                      subtitle="Currently working on"
                      icon="⚡"
                      color="#F59E0B"
                    />
                    <MetricCard
                      title="Pending"
                      value={chartData.metrics.tasksPending}
                      subtitle="Upcoming tasks"
                      icon="⏳"
                      color="#6B7280"
                    />
                  </div>

                  {/* Progress Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProgressCard
                      label="Completion Rate"
                      value={chartData.metrics.tasksCompleted}
                      total={
                        chartData.metrics.tasksCompleted +
                        chartData.metrics.tasksInProgress +
                        chartData.metrics.tasksPending
                      }
                      color="#10B981"
                      icon="🎯"
                    />
                    <ProgressCard
                      label="Active Work"
                      value={chartData.metrics.tasksInProgress}
                      total={
                        chartData.metrics.tasksCompleted +
                        chartData.metrics.tasksInProgress +
                        chartData.metrics.tasksPending
                      }
                      color="#F59E0B"
                      icon="🚀"
                    />
                  </div>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartComponent config={chartData.progress} height={250} />
                    <ChartComponent config={chartData.category} height={250} />
                  </div>

                  {/* Timeline Chart */}
                  <div className="mt-4">
                    <ChartComponent config={chartData.timeline} height={200} />
                  </div>

                  {/* Insights */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      💡 AI Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-white rounded-lg p-4">
                        <p className="font-medium text-gray-700 mb-1">Productivity Score</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {chartData.metrics.tasksCompleted > 0
                            ? Math.round(
                                (chartData.metrics.tasksCompleted /
                                  (chartData.metrics.tasksCompleted +
                                    chartData.metrics.tasksInProgress +
                                    chartData.metrics.tasksPending)) *
                                  100
                              )
                            : 0}
                          %
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Based on completion rate
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="font-medium text-gray-700 mb-1">Work Balance</p>
                        <p className="text-sm text-gray-600">
                          {Object.entries(chartData.metrics.categories)
                            .filter(([_, value]) => value > 0)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 2)
                            .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
                            .join(' & ')}{' '}
                          focused
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Primary work categories
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Built with Next.js, Groq AI, Puppeteer & Chart.js</p>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              📧 Email Report
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipients *
              </label>
              <input
                type="text"
                value={emailRecipients}
                onChange={(e) => setEmailRecipients(e.target.value)}
                placeholder="email@example.com, another@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple emails with commas
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={title || reportTemplates[templateType].defaultTitle}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email subject line
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setError('');
                }}
                disabled={isSendingEmail}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={isSendingEmail || !emailRecipients.trim()}
                className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSendingEmail ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Email'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
