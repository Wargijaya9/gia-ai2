'use client';

export default function CreativePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <div className="text-8xl mb-6">🎨</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Creative Studio</h1>
          <p className="text-xl text-gray-600 mb-8">Coming Soon!</p>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Fitur yang akan datang:</h3>
            <ul className="text-left space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <strong>Ide Design:</strong> Generate konsep design untuk UI/UX, branding, poster, dll
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✍️</span>
                <div>
                  <strong>Copywriting:</strong> Buat headline, tagline, social media copy yang engaging
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🎬</span>
                <div>
                  <strong>Video Script:</strong> Generate script untuk video promosi, tutorial, dll
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <strong>Color Palette:</strong> Saran kombinasi warna untuk project design
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
