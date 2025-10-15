import React from 'react';
import { useState, useEffect } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import img from "../../../assets/home/girl.jpg";

const PopularTeacher = () => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosFetch = useAxiosFetch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosFetch.get('/instructors'); // Ganti endpoint
                setInstructors(response.data);
            } catch (err) {
                setError('Gagal memuat data instructors');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [axiosFetch]);

    return (
        <section className='container mx-auto my-20 px-4'>
            <div className='text-center mb-12'>
                <h1 className='text-4xl md:text-5xl font-bold text-gray-800 dark:text-white'>
                    Mentor <span className='text-secondary'>Terbaik</span> Kami
                </h1>
                <div className="max-w-2xl mx-auto mt-4">
                    <p className='text-gray-600 dark:text-gray-300'>
                        Belajar langsung dari para ahli! Dapatkan bimbingan profesional dari mentor berpengalaman kami.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className='flex justify-center'>
                    {/* <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div> */}
                </div>
            ) : error ? (
                <div className='text-center py-10'>
                    <p className='text-red-500'>{error}</p>
                </div>
            ) : instructors.length > 0 ? (
                <div className=' grid mb-28 md:grid-cols-2 lg:grid-cols-4 w-[80%] gap-4 mx-auto mt-20'>
                    {instructors.slice(0, 4).map((instructor, index) => (
                        <div 
                            key={index} 
                            className='bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 hover:-translate-y-2'
                        >
                            <div className='p-6 flex flex-col items-center'>
                                <img 
                                    className='rounded-full border-4 border-white dark:border-gray-700 shadow-md h-32 w-32 object-cover mb-4'
                                    src={instructor?.photoUrl || img} 
                                    alt={instructor?.name || 'Instructor'}
                                    onError={(e) => {
                                        e.target.src = img;
                                        e.target.alt = 'Foto default instructor';
                                    }}
                                />
                                <div className="text-center">
                                    <h3 className='text-xl font-semibold text-gray-800 dark:text-white'>
                                        {instructor?.name || 'Nama Instructor'}
                                    </h3>
                                    <p className='text-secondary font-medium mb-2'>Instructor Profesional</p>
                                    <div className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
                                        <div className='flex items-center justify-center'>
                                            <svg className='w-4 h-4 mr-2' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {instructor?.address || 'Alamat tidak tersedia'}
                                        </div>
                                        
                                        <div className='flex items-center justify-center'>
                                            <svg className='w-4 h-4 mr-2' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {instructor?.email || 'Email tidak tersedia'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            ) : (
                <div className='text-center py-10'>
                    <p className='text-gray-500 dark:text-gray-400'>Belum ada data instructors tersedia</p>
                </div>
            )}
        </section>
    );
};

export default PopularTeacher;