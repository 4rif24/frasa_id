import React, { useEffect, useState } from 'react';
import useUser from '../../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MyClasses = () => {
  const [classes, setClasses] = useState([]);
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (currentUser?.email) {
      axiosSecure.get(`/classes/${currentUser.email}`)
        .then(res => {
          // Memperbaiki URL gambar untuk setiap kelas
          const classesWithFixedImageUrl = res.data.map(cls => {
            if (cls.image && cls.image.includes('i.ibb.co')) {
              return {
                ...cls,
                image: cls.image.replace('i.ibb.co', 'i.ibb.co.com')
              };
            }
            return cls;
          });
          setClasses(classesWithFixedImageUrl);
        })
        .catch(err => console.log(err));
    }
  }, [currentUser, isLoading, axiosSecure]);

  const handleFeedback = (classId) => {
    // Implementasi view feedback
    console.log("View feedback for class:", classId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Kelas <span className="text-secondary">Saya</span></h1>
        <p className="text-sm text-gray-500 mt-2">
          Di sini Anda dapat melihat kelas yang telah ditambahkan dan status masing-masing kelas
        </p>
      </div>

      {classes.length === 0 ? (
        <div className="text-center text-2xl font-bold mt-10 py-20 bg-gray-50 rounded-lg">
          Anda belum menambahkan kelas apapun
        </div>
      ) : (
        <div className="space-y-6">
          {classes.map((cls) => (
            <div 
              key={cls._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-1/3">
                  <div className="w-full aspect-video overflow-hidden">
                    <img 
                      src={cls.image} 
                      alt={cls.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Gambar+Tidak+Tersedia';
                      }}
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:w-2/3">
                  <h2 className="text-2xl font-bold text-secondary mb-4">{cls.name}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column - Class Info */}
                    <div>
                      <h3 className="font-bold text-lg mb-3">Informasi:</h3>
                      <div className="space-y-2">
                        <p>
                          <span className="text-gray-600">Total Siswa:</span>{" "}
                          <span className="font-medium">{cls.totalEnrolled || 0}</span>
                        </p>
                        <p>
                          <span className="text-gray-600">Kuota Tersedia:</span>{" "}
                          <span className="font-medium">{cls.availableSeats}</span>
                        </p>
                        <p>
                          <span className="text-gray-600">Status:</span>{" "}
                          <span className={`font-medium ${
                            cls.status === "pending" ? "text-orange-500" :
                            cls.status === "checking" ? "text-yellow-500" :
                            cls.status === "approved" ? "text-green-500" :
                            "text-red-500"
                          }`}>
                            {cls.status === "pending" ? "Menunggu" : 
                             cls.status === "checking" ? "Diproses" :
                             cls.status === "approved" ? "Disetujui" :
                             "Ditolak"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Right Column - Action Info */}
                    <div>
                      <h3 className="font-bold text-lg mb-3">Detail:</h3>
                      <div className="space-y-2">
                       <p>
                        <span className="text-gray-600">Harga:</span>{" "}
                        <span className="font-medium">
                          Rp {new Intl.NumberFormat('id-ID').format(cls.price || 0)}
                        </span>
                      </p>
                        <p>
                          <span className="text-gray-600">Tanggal Submit:</span>{" "}
                          <span className="font-medium">
                            {cls.submitted ? new Date(cls.submitted).toLocaleDateString('id-ID', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            }) : "Tidak ada data"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleFeedback(cls._id)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                    >
                      View Feedback
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/update-class/${cls._id}`)} 
                      className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClasses;