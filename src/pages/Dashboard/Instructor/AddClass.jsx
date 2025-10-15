import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useUser from '../../../hooks/useUser';
import Swal from 'sweetalert2';

const AddClass = () => {
    const API_KEY = import.meta.env.VITE_IMG_TOKEN;
    const API_URL = 'https://api.imgbb.com/1/upload';
    const axiosSecure = useAxiosSecure();
    const { currentUser } = useUser();
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modules, setModules] = useState([{ 
        title: '', 
        lessons: [{ 
            title: '', 
            videoLink: '', 
            duration: '' 
        }] 
    }]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi tipe file
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    title: 'Error!',
                    text: 'File harus berupa gambar',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                e.target.value = '';
                return;
            }
            
            // Validasi ukuran file (maksimal 5MB)
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Ukuran gambar tidak boleh lebih dari 5MB',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                e.target.value = '';
                return;
            }
            
            setImage(file);
            
            // Membuat preview gambar
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addModule = () => {
        setModules([...modules, { 
            title: '', 
            lessons: [{ 
                title: '', 
                videoLink: '', 
                duration: '' 
            }] 
        }]);
    };

    const removeModule = (index) => {
        if (modules.length <= 1) return;
        const newModules = [...modules];
        newModules.splice(index, 1);
        setModules(newModules);
    };

    const updateModuleTitle = (index, title) => {
        const newModules = [...modules];
        newModules[index].title = title;
        setModules(newModules);
    };

    const addLesson = (moduleIndex) => {
        const newModules = [...modules];
        newModules[moduleIndex].lessons.push({ 
            title: '', 
            videoLink: '', 
            duration: '' 
        });
        setModules(newModules);
    };

    const removeLesson = (moduleIndex, lessonIndex) => {
        const newModules = [...modules];
        if (newModules[moduleIndex].lessons.length <= 1) return;
        newModules[moduleIndex].lessons.splice(lessonIndex, 1);
        setModules(newModules);
    };

    const updateLesson = (moduleIndex, lessonIndex, field, value) => {
        const newModules = [...modules];
        newModules[moduleIndex].lessons[lessonIndex][field] = value;
        setModules(newModules);
    };

    const extractYouTubeID = (url) => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : false;
    };

    const validateForm = (formData, modules) => {
        // Validasi field dasar
        const name = formData.get('name');
        const availableSeats = parseInt(formData.get('availableSeats'));
        const price = parseFloat(formData.get('price'));
        const description = formData.get('description');
        const category = formData.get('category');
        const level = formData.get('level');

        if (!name || !availableSeats || !price || !description || !category || !level || !image) {
            return 'Semua field wajib harus diisi';
        }

        // Validasi modul dan pelajaran
        let hasEmptyModule = false;
        let hasEmptyLesson = false;
        
        modules.forEach(module => {
            if (!module.title.trim()) hasEmptyModule = true;
            
            module.lessons.forEach(lesson => {
                if (!lesson.title.trim() || !lesson.videoLink.trim()) {
                    hasEmptyLesson = true;
                }
            });
        });

        if (hasEmptyModule) {
            return 'Semua modul harus memiliki judul';
        }

        if (hasEmptyLesson) {
            return 'Semua pelajaran harus memiliki judul dan link video';
        }

        return null;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const formData = new FormData(e.target);
            const name = formData.get('name');
            const availableSeats = parseInt(formData.get('availableSeats'));
            const price = parseFloat(formData.get('price'));
            const description = formData.get('description');
            const category = formData.get('category');
            const prerequisites = formData.get('prerequisites');
            const objectives = formData.get('objectives');
            const targetAudience = formData.get('targetAudience');
            const level = formData.get('level');

            // Validasi form
            const validationError = validateForm(formData, modules);
            if (validationError) {
                throw new Error(validationError);
            }

            let imageUrl = '';
            
            // Upload gambar ke ImgBB
            const uploadFormData = new FormData();
            uploadFormData.append('image', image);
            
            // Menggunakan key sebagai parameter query string
            const imgResponse = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: "POST",
                body: uploadFormData,
            });
            
            if (!imgResponse.ok) {
                throw new Error('Gagal mengupload gambar');
            }
            
            const imgData = await imgResponse.json();
            
            if (!imgData.success) {
                throw new Error('Upload gambar gagal: ' + (imgData.error?.message || 'Unknown error'));
            }
            
            // Pastikan URL gambar diambil dengan benar dari respons ImgBB v1
            imageUrl = imgData.data.url || imgData.data.display_url;
            
            if (!imageUrl) {
                console.error('Struktur respons ImgBB:', imgData);
                throw new Error('Tidak dapat mendapatkan URL gambar dari respons');
            }

            // Hitung total durasi dan pelajaran
            let totalDuration = 0;
            let totalLessons = 0;
            
            modules.forEach(module => {
                totalLessons += module.lessons.length;
                module.lessons.forEach(lesson => {
                    if (lesson.duration) {
                        const [hours, minutes] = lesson.duration.split(':').map(Number);
                        totalDuration += (hours * 60) + (isNaN(minutes) ? 0 : minutes);
                    }
                });
            });
            
            const hours = Math.floor(totalDuration / 60);
            const minutes = totalDuration % 60;
            const durationText = `${hours} jam ${minutes} menit`;

            const classData = {
                name,
                image: imageUrl,
                instructorName: currentUser?.name,
                instructorEmail: currentUser?.email,
                availableSeats,
                price,
                description,
                category,
                prerequisites: prerequisites || 'Tidak ada prasyarat',
                objectives: objectives ? objectives.split('\n').filter(obj => obj.trim() !== '') : [],
                targetAudience: targetAudience || 'Semua kalangan',
                modules,
                totalDuration: durationText,
                totalLessons,
                level,
                status: 'pending',
                submitted: new Date(),
                totalEnrolled: 0
            };

            const response = await axiosSecure.post("/new-class", classData);
            
            if (response.data.success) {
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Kelas berhasil ditambahkan!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                e.target.reset();
                setImage(null);
                setImagePreview(null);
                setModules([{ title: '', lessons: [{ title: '', videoLink: '', duration: '' }] }]);
            } else {
                throw new Error('Response dari server tidak valid');
            }
        } catch (error) {
            console.error("Error menambahkan kelas:", error);
            
            let errorMessage = 'Gagal menambahkan kelas. Silakan coba lagi.';
            
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }

            Swal.fire({
                title: 'Error!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="my-10">
                <h1 className="text-center text-3xl font-bold">Buat Kursus Baru</h1>
                <p className="text-center text-gray-600 mt-2">Rancang kursus berbasis video yang menarik bagi peserta</p>
            </div>
            
            <form onSubmit={handleFormSubmit} className="mx-auto p-6 bg-white rounded-lg shadow-md max-w-6xl">
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Informasi Dasar Kursus</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nama Kelas */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                                Judul Kursus *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Contoh: Pemrograman JavaScript dari Dasar hingga Mahir"
                                name="name"
                                id="name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Kategori Kursus */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="category">
                                Kategori Kursus *
                            </label>
                            <select
                                required
                                name="category"
                                id="category"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Pilih Kategori</option>
                                <option value="pemrograman">Pemrograman</option>
                                <option value="desain">Desain</option>
                                <option value="bisnis">Bisnis</option>
                                <option value="marketing">Marketing</option>
                                <option value="keuangan">Keuangan</option>
                                <option value="musik">Musik</option>
                                <option value="fotografi">Fotografi</option>
                                <option value="kesehatan">Kesehatan & Kebugaran</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                        </div>

                        {/* Thumbnail Kelas */}
                        <div className="mb-6 md:col-span-2">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="image">
                                Thumbnail Kursus *
                            </label>
                            <p className="text-sm text-gray-500 mb-2">Gambar yang menarik akan meningkatkan minat peserta terhadap kursus Anda</p>
                            <input
                                type="file"
                                required
                                name="image"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="block w-full border border-gray-300 shadow-sm rounded-md text-sm focus:z-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 file:border-0 file:bg-blue-500 file:text-white file:mr-4 file:py-2 file:px-4 hover:file:bg-blue-600 transition-colors"
                            />
                            {imagePreview && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-2">Pratinjau Gambar:</p>
                                    <img 
                                        src={imagePreview} 
                                        alt="Pratinjau" 
                                        className="w-40 h-40 object-cover rounded-md border"
                                    />
                                </div>
                            )}
                            <p className="text-sm text-gray-500 mt-2">Maksimal ukuran file: 5MB. Format: JPG, PNG, atau GIF</p>
                        </div>

                        {/* Info Instruktur */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">
                                Nama Instruktur
                            </label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                type="text"
                                value={currentUser?.name || ''}
                                readOnly
                                disabled
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">
                                Email Instruktur
                            </label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                type="text"
                                value={currentUser?.email || ''}
                                readOnly
                                disabled
                            />
                        </div>

                        {/* Kuota Peserta */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="availableSeats">
                                Kuota Peserta *
                            </label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                type="number"
                                required
                                min="1"
                                placeholder="Jumlah maksimal peserta"
                                name="availableSeats"
                                id="availableSeats"
                            />
                        </div>

                        {/* Harga */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="price">
                                Harga (Rp) *
                            </label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                type="number"
                                required
                                min="0"
                                step="1000"
                                placeholder="Harga kursus"
                                name="price"
                                id="price"
                            />
                        </div>

                        {/* Tingkatan Kursus */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="level">
                                Tingkatan *
                            </label>
                            <select
                                required
                                name="level"
                                id="level"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Pilih Tingkatan</option>
                                <option value="pemula">Pemula</option>
                                <option value="menengah">Menengah</option>
                                <option value="mahir">Mahir</option>
                                <option value="semua tingkat">Semua Tingkat</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Detail Kurikulum</h2>
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">
                            Struktur Kursus (Modul dan Pelajaran) *
                        </label>
                        
                        {modules.map((module, moduleIndex) => (
                            <div key={moduleIndex} className="mb-6 p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold">Modul {moduleIndex + 1}</h3>
                                    <button 
                                        type="button"
                                        onClick={() => removeModule(moduleIndex)}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        disabled={modules.length <= 1}
                                    >
                                        Hapus Modul
                                    </button>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Judul Modul *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Pengenalan JavaScript"
                                        value={module.title}
                                        onChange={(e) => updateModuleTitle(moduleIndex, e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-gray-700">Daftar Pelajaran</label>
                                        <button 
                                            type="button"
                                            onClick={() => addLesson(moduleIndex)}
                                            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                        >
                                            + Tambah Pelajaran
                                        </button>
                                    </div>
                                    
                                    {module.lessons.map((lesson, lessonIndex) => (
                                        <div key={lessonIndex} className="mb-4 p-3 bg-gray-50 rounded-md">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium">Pelajaran {lessonIndex + 1}</span>
                                                <button 
                                                    type="button"
                                                    onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                                    className="text-red-500 hover:text-red-700 text-xs"
                                                    disabled={module.lessons.length <= 1}
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                <div>
                                                    <label className="block text-gray-700 text-sm mb-1">Judul Pelajaran *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Contoh: Variabel dan Tipe Data"
                                                        value={lesson.title}
                                                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                                                        className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-sm mb-1">Durasi (HH:MM)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="00:15"
                                                        value={lesson.duration}
                                                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'duration', e.target.value)}
                                                        className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-gray-700 text-sm mb-1">Link Video YouTube *</label>
                                                <input
                                                    type="url"
                                                    required
                                                    placeholder="https://youtube.com/embed/xxx"
                                                    value={lesson.videoLink}
                                                    onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'videoLink', e.target.value)}
                                                    className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                                                />
                                                {lesson.videoLink && extractYouTubeID(lesson.videoLink) && (
                                                    <div className="mt-2">
                                                        <p className="text-xs text-gray-500 mb-1">Pratinjau:</p>
                                                        <div className="relative pb-[56.25%] h-0">
                                                            <iframe 
                                                                className="absolute top-0 left-0 w-full h-full"
                                                                src={`https://www.youtube.com/embed/${extractYouTubeID(lesson.videoLink)}`}
                                                                frameBorder="0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                                title="Video preview"
                                                            ></iframe>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        
                        <button
                            type="button"
                            onClick={addModule}
                            className="flex items-center text-blue-500 hover:text-blue-700 font-medium"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Tambah Modul Baru
                        </button>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Informasi Tambahan</h2>
                    
                    <div className="grid grid-cols-1 gap-6">
                        {/* Deskripsi */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
                                Deskripsi Kursus *
                            </label>
                            <textarea
                                placeholder="Jelaskan secara detail apa yang akan dipelajari dalam kursus ini, manfaat yang akan didapat, dan mengapa peserta harus mengambil kursus Anda"
                                name="description"
                                id="description"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="5"
                                required
                            ></textarea>
                        </div>

                        {/* Yang akan dipelajari */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="objectives">
                                Yang Akan Dipelajari Peserta
                            </label>
                            <textarea
                                placeholder="Masukkan poin-poin pembelajaran (satu poin per baris)
Contoh:
- Dasar-dasar pemrograman JavaScript
- Membuat aplikasi web interaktif
- Menggunakan framework modern seperti React"
                                name="objectives"
                                id="objectives"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="4"
                            ></textarea>
                        </div>

                        {/* Prasyarat */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="prerequisites">
                                Prasyarat atau Pengetahuan Awal yang Diperlukan
                            </label>
                            <textarea
                                placeholder="Jelaskan pengetahuan atau keahlian apa yang perlu dimiliki peserta sebelum mengambil kursus ini"
                                name="prerequisites"
                                id="prerequisites"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                            ></textarea>
                        </div>

                        {/* Target Audiens */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="targetAudience">
                                Target Audiens
                            </label>
                            <textarea
                                placeholder="Jelaskan untuk siapa kursus ini ditujukan
Contoh: Pemula yang ingin belajar pemrograman, developer yang ingin meningkatkan skill, dll."
                                name="targetAudience"
                                id="targetAudience"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Tombol Submit */}
                <div className="text-center">
                    <button
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 w-full max-w-md mx-auto ${
                            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Mengirim...
                            </div>
                        ) : (
                            'Tambahkan Kelas Baru'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddClass;