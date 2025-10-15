import React from 'react';
import bgImg from '../../../../src/assets/home/banner-2.jpeg';

const Hero2 = () => {
  return (
    <div 
      className='min-h-screen bg-cover bg-center relative'
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className='min-h-screen flex justify-start items-center text-white bg-black bg-opacity-60 px-8 sm:pl-12 md:pl-16 lg:pl-24'>
        <div className='space-y-6 max-w-2xl'>
          <div className='space-y-4'>
            <p className='text-2xl md:text-3xl font-medium text-secondary animate-fadeIn'>
              Kelas Unggulan
            </p>
            
            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight animate-fadeIn delay-100'>
              Kuasai <span className='text-secondary'>Public Speaking</span> Dengan Metode Terbukti
            </h1>

            <div className='md:w-4/5'>
              <p className='text-lg md:text-xl text-gray-100 leading-relaxed animate-fadeIn delay-200'>
                Taklukkan demam panggung, susun pidato memukau, dan tampil percaya diri di depan audiens mana pun. Bergabunglah dengan 5.000+ alumni yang sudah berubah!
              </p>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-5 pt-2 animate-fadeIn delay-300'>
            <button className='px-8 py-3.5 rounded-lg bg-secondary hover:bg-secondary-dark font-bold uppercase transition-all duration-300 transform hover:scale-105 shadow-lg'>
              Daftar Kelas
            </button>
            <button className='px-8 py-3.5 rounded-lg border-2 border-white hover:bg-white hover:text-black font-bold uppercase transition-all duration-300 hover:scale-105'>
              Lihat Modul
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero2;