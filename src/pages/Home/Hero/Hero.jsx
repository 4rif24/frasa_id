import React from 'react';
import bgImg from '../../../../src/assets/home/banner-1.jpg';

const Hero = () => {
  return (
    <div className='min-h-screen bg-cover bg-center' style={{backgroundImage: `url(${bgImg})`}}>
      <div className="min-h-screen flex justify-start pl-8 md:pl-16 lg:pl-24 items-center text-white bg-black bg-opacity-60">
        <div className='space-y-6 max-w-4xl'>
          <div className='space-y-6'>
            <p className='text-xl md:text-3xl font-medium text-secondary'>Public Speaking</p>
            <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold leading-tight'>
              Tingkatkan Kepercayaan Diri & Kemampuan Bicara Anda di Frasa Academy
            </h1>
            <p className='text-lg md:text-xl text-gray-100 max-w-3xl'>
              Sering gugup saat bicara di depan umum? Ingin lebih percaya diri dan jago komunikasi? Frasa Academy siap bantu kamu!
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button className='px-8 py-3 rounded-lg bg-secondary hover:bg-secondary-dark font-bold uppercase transition-all'>
              Gabung Sekarang
            </button>
            <button className='px-8 py-3 rounded-lg border border-white hover:bg-white hover:text-black font-bold uppercase transition-all'>
              Lihat Kelas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero;