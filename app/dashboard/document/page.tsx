'use client';

import { useState } from 'react';

export default function DocumentWriterPage() {
  const [docType, setDocType] = useState('surat');
  const [prompt, setPrompt] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const documentTypes = [
    { value: 'surat', label: 'Surat Resmi', icon: '📧' },
    { value: 'proposal', label: 'Proposal', icon: '📋' },
    { value: 'email', label: 'Email Profesional', icon: '✉️' },
    { value: 'memo', label: 'Memo/Pengumuman', icon: '📝' },
    { value: 'laporan', label: 'Laporan Singkat', icon: '📊' },
    { value: 'sop', label: 'SOP/Prosedur', icon: '📑' },
  ];

  const templates = {
    surat: 'Contoh: Buat surat resmi permohonan izin cuti selama 3 hari',
    proposal: 'Contoh: Buat proposal pengembangan sistem inventory untuk perusahaan retail',
    email: 'Contoh: Buat email follow-up meeting dengan klien tentang project timeline',
    memo: 'Contoh: Buat memo pengumuman work from home policy baru',
    laporan: 'Contoh: Buat laporan singkat hasil survey kepuasan pelanggan',
    sop: 'Contoh: Buat SOP untuk proses onboarding karyawan baru',
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedDoc('');

    try {
      const response = await fetch('/api/document-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docType, prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedDoc(data.document);
      } else {
        throw new Error(data.error || 'Failed to generate document');
      }
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDoc);
    alert('Dokumen berhasil dicopy!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📝 Document Writer</h1>
          <p className="text-xl text-gray-600">Aku bantuin bikinin dokumen profesional yang kamu butuhin! ✨</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Input</h2>

            {/* Document Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Jenis Dokumen
              </label>
              <div className="grid grid-cols-2 gap-3">
                {documentTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setDocType(type.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      docType === type.value
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instruksi Detail
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={templates[docType as keyof typeof templates]}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Jelaskan detail dokumen yang ingin dibuat (tujuan, penerima, poin-poin penting, dll)
              </p>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Membuat Dokumen...
                </span>
              ) : (
                '✨ Generate Dokumen'
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Hasil</h2>
              {generatedDoc && (
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                >
                  📋 Copy
                </button>
              )}
            </div>

            {generatedDoc ? (
              <div className="prose prose-sm max-w-none">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                    {generatedDoc}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium">Belum ada dokumen</p>
                <p className="text-sm">Pilih jenis dokumen dan masukkan instruksi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
