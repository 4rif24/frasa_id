import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-secondary p-8 font-sans text-white border-t border-gray-200 font-[KoHo]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-center md:justify-start">
          <img 
            src="/frasa-logo.png" 
            alt="Frasa Academy Logo" 
            className='w-[200px] h-[50px] object-contain'
          />          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Tentang Frasa */}
          <div className="md:col-span-1">
            <h2 className="text-lg font-semibold mb-4">Tentang Frasa</h2>
            <p className="text-gray-300">
              Frasa Academy membantu mengembangkan kemampuan public speaking dan debat untuk kesuksesan akademik dan karir profesional.
            </p>
          </div>

          {/* Program Kursus */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Program Kursus</h2>
            <ul className="space-y-2">
              <li className="flex items-center hover:text-blue-200 transition-colors">
                <span className="mr-2">🎤</span> Public Speaking
              </li>
              <li className="flex items-center hover:text-blue-200 transition-colors">
                <span className="mr-2">🗣️</span> Debat
              </li>
              <li className="flex items-center hover:text-blue-200 transition-colors">
                <span className="mr-2">📝</span> Penulisan Kreatif
              </li>
              <li className="flex items-center hover:text-blue-200 transition-colors">
                <span className="mr-2">💼</span> Presentasi Bisnis
              </li>
            </ul>
          </div>

          {/* Kontak & Media Sosial */}
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Kontak Kami</h2>
              <ul className="space-y-2">
                <li className="flex items-center hover:text-blue-200 transition-colors">
                  <span className="mr-2">📞</span> 0812-3456-7890
                </li>
                <li className="flex items-center hover:text-blue-200 transition-colors">
                  <span className="mr-2">✉️</span> kontak@frasaid.com
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Media Sosial</h2>
              <ul className="space-y-2">
                <li className="flex items-center hover:text-blue-200 transition-colors">
                  <span className="mr-2">📱</span> Frasa.id
                </li>
                <li className="flex items-center hover:text-blue-200 transition-colors">
                  <span className="mr-2">📷</span> @frasa.id
                </li>
                <li className="flex items-center hover:text-blue-200 transition-colors">
                  <span className="mr-2">💻</span> Frasa.id
                </li>
              </ul>
            </div>
          </div>

          {/* Pembayaran */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Pembayaran</h2>
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="font-medium mb-2">Bank Mandiri</p>
              <p className="text-sm">a.n. Frasa Academy</p>
              <p className="text-sm mt-2 font-mono">1234-5678-9012-3456</p>
              
              <div className="mt-4 pt-3 border-t border-white/20">
                <p className="text-sm">Metode Lainnya:</p>
                <div className="flex mt-2 space-x-2">
                  <div className="bg-white/20 p-1 rounded text-xs">BCA</div>
                  <div className="bg-white/20 p-1 rounded text-xs">BRI</div>
                  <div className="bg-white/20 p-1 rounded text-xs">DANA</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-white/20 text-center text-gray-300">
          <p>Copyright © 2024 Frasa Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;