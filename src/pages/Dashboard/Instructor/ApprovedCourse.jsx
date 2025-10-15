import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useUser from '../../../hooks/useUser';
import { Link } from 'react-router-dom';
import ImageWithFallback from '../../../components/ImageWithFallback'; // Import komponen

const ApprovedCourse = () => {
  const [approvedClasses, setApprovedClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useUser();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (currentUser?.email) {
      axiosSecure.get(`/classes/${currentUser.email}`)
        .then(res => {
          // Filter hanya kelas dengan status approved
          const approvedClasses = res.data.filter(cls => cls.status === 'approved');
          setApprovedClasses(approvedClasses);
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
        <h1 className="text-4xl font-bold">Kelas <span className="text-green-600">Disetujui</span></h1>
        <p className="text-sm text-gray-500 mt-2">
          Daftar kelas Anda yang telah disetujui oleh admin dan tersedia untuk siswa
        </p>
      </div>

      {approvedClasses.length === 0 ? (
        <div className="text-center text-xl font-medium mt-10 py-20 bg-gray-50 rounded-lg">
          Belum ada kelas yang disetujui
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedClasses.map((cls) => (
            <div key={cls._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Gunakan ImageWithFallback untuk gambar kelas */}
              <ImageWithFallback 
                src={cls.image} 
                alt={cls.name} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-secondary mb-2">{cls.name}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600">
                    <span className="font-medium">Siswa Terdaftar:</span> {cls.totalEnrolled || 0}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Kuota Tersedia:</span> {cls.availableSeats}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Harga:</span> Rp {new Intl.NumberFormat('id-ID').format(cls.price || 0)}
                  </p>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-500">
                    Disetujui pada: {new Date(cls.updatedAt || cls.submitted).toLocaleDateString('id-ID')}
                  </p>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Disetujui
                  </span>
                </div>
                <Link
                  to={`/class/${cls._id}`}
                  className="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Lihat Kelas
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedCourse;