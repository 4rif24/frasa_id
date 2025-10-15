import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useUser from '../../../hooks/useUser';
import { Link } from 'react-router-dom';
import ImageWithFallback from '../../../components/ImageWithFallback'; // Import komponen

const PendingCourse = () => {
  const [pendingClasses, setPendingClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useUser();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (currentUser?.email) {
      axiosSecure.get(`/classes/${currentUser.email}`)
        .then(res => {
          // Filter hanya kelas dengan status pending
          const pendingClasses = res.data.filter(cls => cls.status === 'pending');
          setPendingClasses(pendingClasses);
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Kelas <span className="text-orange-500">Menunggu Persetujuan</span></h1>
        <p className="text-sm text-gray-500 mt-2">
          Daftar kelas Anda yang sedang dalam proses review oleh admin
        </p>
      </div>

      {pendingClasses.length === 0 ? (
        <div className="text-center text-xl font-medium mt-10 py-20 bg-gray-50 rounded-lg">
          Tidak ada kelas yang menunggu persetujuan
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingClasses.map((cls) => (
            <div key={cls._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Gunakan ImageWithFallback */}
              <ImageWithFallback 
                src={cls.image} 
                alt={cls.name} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-secondary mb-2">{cls.name}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600">
                    <span className="font-medium">Kuota:</span> {cls.availableSeats} peserta
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Harga:</span> Rp {new Intl.NumberFormat('id-ID').format(cls.price || 0)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Tingkatan:</span> {cls.level}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Diajukan pada: {new Date(cls.submitted).toLocaleDateString('id-ID')}
                  </p>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    Menunggu
                  </span>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/dashboard/update-class/${cls._id}`}
                    className="block w-full text-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors"
                  >
                    Update Kelas
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingCourse;