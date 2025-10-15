import React, { useState, useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaLevelUpAlt, FaUsers, FaClock, FaMoneyBillWave, FaChalkboardTeacher } from 'react-icons/fa';
import { IoIosPeople } from 'react-icons/io';
import { MdPlayLesson, MdOutlineVideoLibrary } from 'react-icons/md';
import Swal from 'sweetalert2';

const SingleClass = () => {
  const course = useLoaderData();
  const { currentUser } = useUser();
  const role = currentUser?.role;
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.email) {
      axiosSecure.get(`/enrolled-classes/${currentUser.email}`)
        .then(res => setEnrolledClasses(res.data))
        .catch(err => console.error('Error fetching enrolled classes:', err));
    }
  }, [currentUser?.email, axiosSecure]);

  // Cek apakah pengguna sudah terdaftar di kelas ini
  const isAlreadyEnrolled = enrolledClasses.some(
    enrolledClass => enrolledClass.classes._id === course._id
  );

  const getLevelColor = (level) => {
    switch (level) {
      case 'pemula': return 'bg-green-100 text-green-800 border border-green-200';
      case 'menengah': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'mahir': return 'bg-red-100 text-red-800 border border-red-200';
      case 'semua tingkat': return 'bg-blue-100 text-blue-800 border border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 'pemula': return 'Pemula';
      case 'menengah': return 'Menengah';
      case 'mahir': return 'Mahir';
      case 'semua tingkat': return 'Semua Tingkat';
      default: return level;
    }
  };

  // Fungsi untuk menambahkan kelas ke keranjang
  const handleAddToCart = async (classId) => {
    // Validasi jika pengguna belum login
    if (!currentUser) {
      Swal.fire({
        title: 'Login Diperlukan',
        text: 'Anda harus login terlebih dahulu untuk menambahkan kelas ke keranjang',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login Sekarang',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    // Validasi role
    if (role === 'admin' || role === 'instructor') {
      Swal.fire({
        title: 'Tidak Diizinkan',
        text: 'Admin dan instruktur tidak dapat menambahkan kelas ke keranjang',
        icon: 'error',
        confirmButtonText: 'Mengerti'
      });
      return;
    }

    // Validasi jika pengguna sudah terdaftar
    if (isAlreadyEnrolled) {
      Swal.fire({
        title: 'Sudah Terdaftar',
        text: 'Anda sudah terdaftar dalam kelas ini',
        icon: 'info',
        confirmButtonText: 'Lihat Kelas Saya'
      }).then(() => {
        navigate('/dashboard/enrolled-classes');
      });
      return;
    }

    setIsEnrolling(true);
    
    try {
      // Cek apakah kelas sudah ada di keranjang
      const cartCheck = await axiosSecure.get(`/cart-item/${classId}?email=${currentUser.email}`);
      
      if (cartCheck.data) {
        Swal.fire({
          title: 'Sudah di Keranjang',
          text: 'Kelas ini sudah ada di keranjang Anda',
          icon: 'info',
          confirmButtonText: 'Lihat Keranjang'
        }).then(() => {
          navigate('/dashboard/my-selected');
        });
        return;
      }

      // Tambahkan ke keranjang
      const response = await axiosSecure.post('/add-to-cart', {
        classId: classId,
        userMail: currentUser.email,
        submitted: new Date()
      });

      if (response.data.insertedId) {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Kelas telah ditambahkan ke keranjang',
          icon: 'success',
          confirmButtonText: 'Lihat Keranjang',
          cancelButtonText: 'Lanjutkan Belanja',
          showCancelButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/dashboard/my-selected');
          }
        });
      } else {
        throw new Error('Gagal menambahkan ke keranjang');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      let errorMessage = 'Terjadi kesalahan saat menambahkan ke keranjang';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Swal.fire({
        title: 'Gagal',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Mengerti'
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  // Fungsi untuk mengakses kelas yang sudah didaftar
  const handleAccessCourse = () => {
    if (isAlreadyEnrolled) {
      navigate('/dashboard/courses-study', { state: { course } });
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-secondary mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data kelas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 pt-6">{course.name}</h1>
          <div className="flex flex-wrap justify-center gap-4 text-white">
            <span className="flex items-center">
              <FaChalkboardTeacher className="mr-2" />
              {course.instructorName}
            </span>
            <span className="flex items-center">
              <FaClock className="mr-2" />
              {course.totalDuration || course.duration}
            </span>
            <span className="flex items-center">
              <MdOutlineVideoLibrary className="mr-2" />
              {course.totalLessons || 0} Pelajaran
            </span>
            <span className={`flex items-center px-3 py-1 rounded-full ${getLevelColor(course.level)}`}>
              <FaLevelUpAlt className="mr-2" />
              {getLevelText(course.level)}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Konten Utama */}
          <div className="lg:col-span-3">
            {/* Preview Video (hanya trailer/promosi) */}
            {course.previewVideo && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="relative pb-[56.25%] h-0">
                  <iframe 
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${extractYouTubeID(course.previewVideo)}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Preview kelas"
                  ></iframe>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-gray-600">Preview kelas - Daftar sekarang untuk mengakses semua materi</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-64 object-cover rounded-lg mb-6"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400?text=Gambar+Kelas';
                }}
              />
              
              <h2 className="text-2xl font-bold mb-4">Deskripsi Kursus</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {course.description || 'Tidak ada deskripsi yang tersedia untuk kursus ini.'}
              </p>

              {course.objectives && course.objectives.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-secondary">🎯 Apa yang akan Anda pelajari?</h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {course.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {course.prerequisites && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">📋 Persyaratan</h3>
                  <p className="text-gray-700">{course.prerequisites}</p>
                </div>
              )}

              {course.targetAudience && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">👥 Untuk Siapa Kursus Ini?</h3>
                  <p className="text-gray-700">{course.targetAudience}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <img
                src={course.image}
                alt={course.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-green-700">
                  Rp{course.price?.toLocaleString('id-ID')}
                </span>
              </div>

              {isAlreadyEnrolled ? (
                <button
                  onClick={handleAccessCourse}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mb-4 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Akses Kelas
                </button>
              ) : (
                <button
                  onClick={() => handleAddToCart(course._id)}
                  disabled={role === 'admin' || role === 'instructor' || 
                           course.availableSeats < 1 || isEnrolling}
                  className="w-full bg-secondary hover:bg-primary disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mb-4 flex items-center justify-center"
                >
                  {isEnrolling ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Memproses...
                    </>
                  ) : role === 'admin' || role === 'instructor' ? (
                    'Tidak Tersedia'
                  ) : course.availableSeats < 1 ? (
                    'Kelas Penuh'
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Tambah ke Keranjang
                    </>
                  )}
                </button>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="flex items-center text-gray-600">
                    <FaChalkboardTeacher className="mr-2" />
                    Instruktur
                  </span>
                  <span className="font-semibold">{course.instructorName}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="flex items-center text-gray-600">
                    <FaClock className="mr-2" />
                    Durasi
                  </span>
                  <span className="font-semibold">{course.totalDuration || course.duration}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="flex items-center text-gray-600">
                    <MdPlayLesson className="mr-2" />
                    Jumlah Pelajaran
                  </span>
                  <span className="font-semibold">{course.totalLessons || 0}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="flex items-center text-gray-600">
                    <FaLevelUpAlt className="mr-2" />
                    Tingkat
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(course.level)}`}>
                    {getLevelText(course.level)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="flex items-center text-gray-600">
                    <IoIosPeople className="mr-2" />
                    Terdaftar
                  </span>
                  <span className="font-semibold">{course.totalEnrolled} peserta</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="flex items-center text-gray-600">
                    <FaUsers className="mr-2" />
                    Kuota Tersedia
                  </span>
                  <span className={`font-semibold ${course.availableSeats < 5 ? 'text-red-600' : 'text-green-600'}`}>
                    {course.availableSeats} kursi
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="flex items-center text-gray-600">
                    <FaMoneyBillWave className="mr-2" />
                    Harga
                  </span>
                  <span className="font-semibold">Rp{course.price?.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Daftar Modul (hanya judul, tidak bisa diakses) */}
              {course.modules && course.modules.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-semibold mb-3">📚 Kurikulum Kursus</h4>
                  <p className="text-sm text-gray-600 mb-3">Daftar modul yang akan dipelajari:</p>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="border rounded-lg">
                        <div className="p-3 bg-gray-50 font-medium">
                          Modul {moduleIndex + 1}: {module.title}
                          <span className="text-xs text-gray-500 ml-2">
                            ({module.lessons?.length || 0} pelajaran)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * Daftar lengkap pelajaran dapat diakses setelah mendaftar
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function untuk extract YouTube ID
const extractYouTubeID = (url) => {
  if (!url) return null;
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export default SingleClass;