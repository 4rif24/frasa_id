import React, { useEffect, useState } from 'react'
import useAxiosFetch from '../../hooks/useAxiosFetch';
import img from "../../assets/home/girl.jpg"

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosFetch = useAxiosFetch();
  
  useEffect(() => {
    setLoading(true);
    axiosFetch.get('/instructors')
      .then((response) => {
        console.log("Instructors data:", response.data);
        setInstructors(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching instructors:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading instructors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-16 md:py-24'>
      {/* Header Section */}
      <div className='text-center mb-16'>
        <h1 className='text-4xl md:text-5xl font-bold mb-4'>
          Mentor <span className='text-secondary'>Terbaik</span> Kami
        </h1>
        <p className='text-gray-600 max-w-2xl mx-auto'>
          Instructors berpengalaman dan kreatif siap membimbing Anda
        </p>
      </div>

      {/* Instructor Cards Grid */}
      {instructors.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-[80%] gap-8 mx-auto'>
          {instructors.slice(0,4).map((instructor, i) => (
            <div 
              key={i} 
              className='bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2'
            >
              {/* Instructor Image */}
              <div className='p-6 flex justify-center'>
                <img 
                  className='rounded-full border-4 border-gray-200 dark:border-gray-700 h-32 w-32 object-cover shadow-md'
                  src={instructor.photoUrl || img} 
                  alt={`Foto ${instructor.name}`} 
                />
              </div>

              {/* Instructor Info */}
              <div className='px-6 pb-8 text-center'>
                <h3 className='text-xl font-semibold text-gray-800 dark:text-white mb-1'>
                  {instructor.name}
                </h3>
                <p className='text-secondary mb-4'>Instructor Profesional</p>
                
                <div className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
                  <div className='flex items-center justify-center'>
                    <svg className='w-4 h-4 mr-2' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {instructor.address || 'Alamat tidak tersedia'}
                  </div>
                  
                  <div className='flex items-center justify-center'>
                    <svg className='w-4 h-4 mr-2' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {instructor.email || 'Email tidak tersedia'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-500 py-12'>
          Tidak ada instructors tersedia atau data belum terisi di database
        </p>
      )}
    </div>
  )
}

export default Instructors;