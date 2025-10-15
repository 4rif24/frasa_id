import React from 'react';
import { Link } from "react-router-dom";

const Card = ({ item }) => {
    // Berikan nilai default jika item tidak terdefinisi
    const { 
        _id = '', 
        name = 'Nama Kelas', 
        image = 'https://via.placeholder.com/300', 
        availableSeats = 0, 
        price = 0, 
        totalEndrolled = 0 
    } = item || {};

    // Format harga ke Rupiah
    const formatHarga = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className='card bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 m-4'>
            <div className='card-image h-48 overflow-hidden'>
                <img 
                    src={image} 
                    alt={name}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300';
                        e.target.alt = 'Gambar tidak tersedia';
                    }}
                />
            </div>
            
            <div className="card-content p-4">
                <h2 className='text-xl font-semibold mb-3 text-gray-800'>{name}</h2>
                
                <div className='space-y-2 text-gray-600 mb-4'>
                    <div className='flex items-center'>
                        <svg className='w-5 h-5 mr-2 text-gray-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Kursi Tersedia: {availableSeats}</span>
                    </div>
                    
                    <div className='flex items-center'>
                        <svg className='w-5 h-5 mr-2 text-gray-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Harga: {formatHarga(price)}</span>
                    </div>
                    
                    <div className='flex items-center'>
                        <svg className='w-5 h-5 mr-2 text-gray-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Total Peserta: {totalEndrolled}</span>
                    </div>
                </div>
                
                <Link 
                    to={`/class/${_id}`} 
                    className='block'
                >
                    <button className='w-full py-2 bg-secondary hover:bg-primary rounded-lg text-white font-semibold transition-colors duration-300 flex items-center justify-center'>
                        <svg className='w-5 h-5 mr-2' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Daftar Sekarang
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Card;