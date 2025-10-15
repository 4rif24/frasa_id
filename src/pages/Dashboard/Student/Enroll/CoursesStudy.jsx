import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useUser from '../../../../hooks/useUser';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { FaLevelUpAlt, FaClock, FaChalkboardTeacher, FaCheckCircle } from 'react-icons/fa';
import { MdPlayLesson } from 'react-icons/md';
import Swal from 'sweetalert2';

const CoursesStudy = () => {
  const { currentUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const initializeCourse = async () => {
      // Jika tidak ada classId dari state, redirect ke enrolled classes
      if (!location.state?.classId) {
        navigate('/dashboard/enrolled-classes');
        return;
      }

      try {
        // Verifikasi bahwa user benar-benar terdaftar di kelas ini
        const enrollmentResponse = await axiosSecure.get(`/enrolled-classes/${currentUser.email}`);
        const isEnrolled = enrollmentResponse.data.some(
          enrolledClass => enrolledClass.classes._id === location.state.classId
        );
        
        if (!isEnrolled) {
          Swal.fire({
            title: 'Akses Ditolak',
            text: 'Anda belum terdaftar di kelas ini',
            icon: 'error',
            confirmButtonText: 'Kembali'
          }).then(() => {
            navigate('/dashboard/enrolled-classes');
          });
          return;
        }

        setEnrolledClasses(enrollmentResponse.data);
        
        // Fetch data kelas lengkap dengan modul
        const courseResponse = await axiosSecure.get(`/class-with-modules/${location.state.classId}`);
        setCourse(courseResponse.data);
        
        // Load progress user
        loadUserProgress(courseResponse.data._id);
      } catch (error) {
        console.error('Error initializing course:', error);
        Swal.fire({
          title: 'Error',
          text: 'Terjadi kesalahan saat memuat data kursus',
          icon: 'error',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/dashboard/enrolled-classes');
        });
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.email) {
      initializeCourse();
    } else {
      setLoading(false);
      navigate('/dashboard/enrolled-classes');
    }
  }, [currentUser, location.state, navigate, axiosSecure]);

  const loadUserProgress = async (courseId) => {
    try {
      // Di sini Anda bisa mengambil data progress dari API
      // Contoh sederhana: simpan di localStorage
      const progressData = localStorage.getItem(`progress_${currentUser.email}_${courseId}`);
      if (progressData) {
        const { completed, progress } = JSON.parse(progressData);
        setCompletedLessons(completed || []);
        setProgress(progress || 0);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = (lessonId, courseId) => {
    const newCompleted = [...completedLessons, lessonId];
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
    const newProgress = Math.round((newCompleted.length / totalLessons) * 100);
    
    setCompletedLessons(newCompleted);
    setProgress(newProgress);
    
    // Simpan progress (bisa diganti dengan API call)
    localStorage.setItem(`progress_${currentUser.email}_${courseId}`, 
      JSON.stringify({ completed: newCompleted, progress: newProgress }));
  };

  const extractYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const isLessonCompleted = (moduleIndex, lessonIndex) => {
    const lessonId = `${moduleIndex}-${lessonIndex}`;
    return completedLessons.includes(lessonId);
  };

  const markAsCompleted = () => {
    const lessonId = `${activeModule}-${activeLesson}`;
    if (!isLessonCompleted(activeModule, activeLesson)) {
      saveProgress(lessonId, course._id);
      
      Swal.fire({
        title: 'Pelajaran Selesai!',
        text: 'Pelajaran telah ditandai sebagai selesai',
        icon: 'success',
        confirmButtonText: 'Lanjutkan'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-secondary mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat kelas...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-gray-800">Kelas tidak ditemukan</h2>
          <button 
            onClick={() => navigate('/dashboard/enrolled-classes')}
            className="mt-4 bg-secondary hover:bg-secondary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Kembali ke Kelas Saya
          </button>
        </div>
      </div>
    );
  }

  const currentVideo = course.modules && course.modules[activeModule]?.lessons[activeLesson]?.videoLink;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header dengan Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/dashboard/enrolled-classes')}
              className="flex items-center text-secondary hover:text-secondary-dark font-medium"
            >
              <FaLevelUpAlt className="rotate-90 mr-2" />
              Kembali ke Kelas Saya
            </button>
            <div className="flex items-center">
              <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-3">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">{progress}% selesai</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Konten Utama */}
          <div className="lg:col-span-3">
            {/* Video Player */}
            {currentVideo ? (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="relative pb-[56.25%] h-0">
                  <iframe 
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${extractYouTubeID(currentVideo)}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video pelajaran"
                  ></iframe>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">
                      {course.modules[activeModule]?.lessons[activeLesson]?.title}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Modul {activeModule + 1}: {course.modules[activeModule]?.title}
                    </p>
                  </div>
                  <button
                    onClick={markAsCompleted}
                    disabled={isLessonCompleted(activeModule, activeLesson)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      isLessonCompleted(activeModule, activeLesson) 
                        ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isLessonCompleted(activeModule, activeLesson) ? (
                      <>
                        <FaCheckCircle className="inline mr-2" />
                        Selesai
                      </>
                    ) : (
                      'Tandai Selesai'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
                <div className="text-5xl mb-4">📚</div>
                <h2 className="text-xl font-bold mb-2">Selamat Datang di {course.name}</h2>
                <p className="text-gray-600">Pilih pelajaran dari sidebar untuk mulai belajar</p>
              </div>
            )}

            {/* Deskripsi Pelajaran */}
            {currentVideo && course.modules[activeModule]?.lessons[activeLesson]?.description && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Deskripsi Pelajaran</h3>
                <p className="text-gray-700">
                  {course.modules[activeModule]?.lessons[activeLesson]?.description}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Daftar Modul dan Pelajaran */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">{course.name}</h2>
              
              <div className="flex items-center text-sm text-gray-600 mb-6">
                <span className="flex items-center mr-4">
                  <FaChalkboardTeacher className="mr-1" />
                  {course.instructorName}
                </span>
                <span className="flex items-center">
                  <FaClock className="mr-1" />
                  {course.totalDuration || '10 jam'}
                </span>
              </div>

              {/* Daftar Modul dan Pelajaran */}
              {course.modules && course.modules.length > 0 ? (
                <div className="mt-4">
                  <h4 className="font-semibold mb-3">Kurikulum Kursus</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="border rounded-lg">
                        <div className="p-3 bg-gray-50 font-medium">
                          Modul {moduleIndex + 1}: {module.title}
                        </div>
                        <div className="space-y-1 p-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div 
                              key={lessonIndex}
                              className={`flex items-center p-2 rounded cursor-pointer ${
                                activeModule === moduleIndex && activeLesson === lessonIndex 
                                  ? 'bg-blue-100' 
                                  : 'hover:bg-gray-50'
                              }`}
                              onClick={() => {
                                setActiveModule(moduleIndex);
                                setActiveLesson(lessonIndex);
                              }}
                            >
                              <MdPlayLesson className={`mr-2 ${
                                isLessonCompleted(moduleIndex, lessonIndex) 
                                  ? 'text-green-500' 
                                  : 'text-gray-500'
                              }`} />
                              <span className="text-sm flex-1">{lesson.title}</span>
                              {lesson.duration && (
                                <span className="ml-2 text-xs text-gray-500">{lesson.duration}</span>
                              )}
                              {isLessonCompleted(moduleIndex, lessonIndex) && (
                                <FaCheckCircle className="ml-2 text-green-500 text-sm" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Belum ada modul pembelajaran
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesStudy;