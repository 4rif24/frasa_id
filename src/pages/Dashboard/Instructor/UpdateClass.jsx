import React, { useState, useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useUser from '../../../hooks/useUser';
import Swal from 'sweetalert2';

const UpdateClass = () => {
    const course = useLoaderData();
    const { currentUser } = useUser();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    
    const [modules, setModules] = useState(course.modules || [{ title: '', lessons: [{ title: '', videoLink: '', duration: '' }] }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (course.modules) {
            setModules(course.modules);
        }
    }, [course]);

    const addModule = () => {
        setModules([...modules, { title: '', lessons: [{ title: '', videoLink: '', duration: '' }] }]);
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
        newModules[moduleIndex].lessons.push({ title: '', videoLink: '', duration: '' });
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
            const objectives = formData.get('objectives')?.split('\n').filter(obj => obj.trim() !== '') || [];
            const targetAudience = formData.get('targetAudience');
            const level = formData.get('level');

            // Hitung total durasi dan pelajaran
            let totalDuration = 0;
            let totalLessons = 0;
            
            modules.forEach(module => {
                totalLessons += module.lessons.length;
                module.lessons.forEach(lesson => {
                    if (lesson.duration) {
                        const [hours, minutes] = lesson.duration.split(':').map(Number);
                        totalDuration += (hours * 60) + minutes;
                    }
                });
            });
            
            const hours = Math.floor(totalDuration / 60);
            const minutes = totalDuration % 60;
            const totalDurationText = `${hours} jam ${minutes} menit`;

            const classData = {
                name,
                instructorName: currentUser?.name,
                instructorEmail: currentUser?.email,
                availableSeats,
                price,
                description,
                category,
                prerequisites,
                objectives,
                targetAudience,
                modules,
                totalDuration: totalDurationText,
                totalLessons,
                level
            };

            const response = await axiosSecure.put(`/update-class/${course._id}`, classData);
            
            if (response.data.success) {
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Kelas berhasil diperbarui!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/dashboard/my-classes');
                });
            } else {
                throw new Error('Gagal memperbarui kelas');
            }
        } catch (error) {
            console.error("Error updating class:", error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.error || 'Gagal memperbarui kelas. Silakan coba lagi.',
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
                <h1 className="text-center text-3xl font-bold">Perbarui Kelas</h1>
            </div>
            
            <form onSubmit={handleFormSubmit} className="mx-auto p-6 bg-white rounded-lg shadow-md max-w-6xl">
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
                            defaultValue={course.name}
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
                            defaultValue={course.category}
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
                            defaultValue={course.availableSeats}
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
                            defaultValue={course.price}
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
                            defaultValue={course.level}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Pilih Tingkatan</option>
                            <option value="pemula">Pemula</option>
                            <option value="menengah">Menengah</option>
                            <option value="mahir">Mahir</option>
                            <option value="semua tingkat">Semua Tingkat</option>
                        </select>
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
                </div>

                {/* Deskripsi */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
                        Deskripsi Kursus *
                    </label>
                    <textarea
                        placeholder="Jelaskan secara detail apa yang akan dipelajari dalam kursus ini, manfaat yang akan didapat, dan mengapa peserta harus mengambil kursus Anda"
                        name="description"
                        id="description"
                        defaultValue={course.description}
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
                        defaultValue={course.objectives ? course.objectives.join('\n') : ''}
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
                        defaultValue={course.prerequisites}
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
                        defaultValue={course.targetAudience}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                    ></textarea>
                </div>

                {/* Bagian modul dan pelajaran */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Kurikulum Kursus</h2>
                    
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
                                Memperbarui...
                            </div>
                        ) : (
                            'Perbarui Kelas'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateClass;