'use client';

export default function CodePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <div className="text-8xl mb-6">💻</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Code Helper</h1>
          <p className="text-xl text-gray-600 mb-8">Coming Soon!</p>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Fitur yang akan datang:</h3>
            <ul className="text-left space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-2xl">🐛</span>
                <div>
                  <strong>Debug Assistant:</strong> Bantu temukan dan perbaiki bug di code Anda
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">📝</span>
                <div>
                  <strong>Code Review:</strong> Analisis kualitas code dan berikan saran improvement
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <strong>Code Optimizer:</strong> Saran untuk optimize performance dan clean code
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <strong>Explain Code:</strong> Jelaskan cara kerja code secara detail
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
