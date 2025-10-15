import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useLoaderData, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const UpdateUser = () => {
  const { user } = useAuth();
  const userCredentials = useLoaderData();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  
  const API_KEY = import.meta.env.VITE_IMG_TOKEN;
  const API_URL = 'https://api.imgbb.com/1/upload';
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target);
      const updatedData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        skills: formData.get('skills'),
        address: formData.get('address'),
        role: formData.get('role'),
        about: formData.get('about')
      };

      // Selalu sertakan photoUrl yang sudah ada
      if (!image && userCredentials?.photoUrl) {
        updatedData.photoUrl = userCredentials.photoUrl;
      }

      // Jika ada gambar baru, upload ke imgBB
      if (image) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', image);
        
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
        
        // Ambil URL gambar dari respons ImgBB
        let imageUrl = imgData.data.url || imgData.data.display_url;
        
        if (!imageUrl) {
          throw new Error('Tidak dapat mendapatkan URL gambar dari respons');
        }

        // Perbaiki domain URL gambar - tambahkan .com jika diperlukan
        if (imageUrl.includes('i.ibb.co') && !imageUrl.includes('i.ibb.co.com')) {
          imageUrl = imageUrl.replace('i.ibb.co', 'i.ibb.co.com');
        }

        updatedData.photoUrl = imageUrl;
      }

      // Kirim update ke backend
      const res = await axiosSecure.put(`/update-user/${userCredentials?._id}`, updatedData);
      
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Data pengguna berhasil diperbarui',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/dashboard/manage-users');
        });
      }
    } catch (err) {
      console.error('Error updating user:', err);
      Swal.fire({
        title: 'Gagal!',
        text: err.response?.data?.message || 'Terjadi kesalahan saat memperbarui data',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className='text-center text-4xl font-bold mt-5'>Perbarui: <span className='text-secondary'>{userCredentials?.name || user?.displayName}</span></h1>
      <p className='text-center'>Ubah detail tentang <span className='text-red-400 font-bold'>{userCredentials?.name || user?.displayName}</span></p>
      
      {/* Menampilkan foto pengguna saat ini */}
      {userCredentials?.photoUrl && (
        <div className="flex justify-center my-6">
          <div className="text-center">
            <p className="text-sm font-bold text-gray-700 mb-2">Foto Saat Ini:</p>
            <img 
              src={userCredentials.photoUrl} 
              alt={userCredentials.name || 'User'} 
              className="w-32 h-32 rounded-full object-cover mx-auto border-2 border-gray-300"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/128?text=No+Image';
              }}
            />
          </div>
        </div>
      )}
      
      {/* Area formulir */}
      <section className="">
        <div className="mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white p-8 shadow-lg lg:p-12">
            <form className="space-y-6" onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="ml-2 pb-1 block text-sm font-bold text-gray-700" htmlFor="name">Nama</label>
                  <input
                    className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm focus:border-secondary focus:ring-secondary"
                    placeholder="Nama Anda"
                    type="text"
                    required
                    defaultValue={userCredentials?.name || ""}
                    id="name"
                    name='name'
                  />
                </div>
                <div>
                  <label className="ml-2 pb-1 block text-sm font-bold text-gray-700" htmlFor="phone">Telepon</label>
                  <input
                    className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm focus:border-secondary focus:ring-secondary"
                    placeholder="Nomor Telepon"
                    required
                    type="tel"
                    id="phone"
                    defaultValue={userCredentials?.phone || ""}
                    name='phone'
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="ml-2 pb-1 block text-sm font-bold text-gray-700" htmlFor="email">Email</label>
                  <p className='text-xs ml-2 text-red-500 mb-2'>Tidak disarankan untuk memperbarui email. Biarkan default</p>
                  <input
                    className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm focus:border-secondary focus:ring-secondary"
                    placeholder="Alamat Email"
                    type="email"
                    required
                    defaultValue={userCredentials?.email}
                    name="email"
                    id="email"
                  />
                </div>
                <div>
                  <label className="ml-2 pb-1 block text-sm font-bold text-gray-700" htmlFor="skills">Keahlian</label>
                  <p className='text-xs ml-2 text-red-500 mb-2'>Jika pengguna adalah instruktur, isi keahlian; jika tidak, biarkan kosong</p>
                  <input
                    className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm focus:border-secondary focus:ring-secondary"
                    placeholder="Keahlian"
                    defaultValue={userCredentials?.skills || ""}
                    type="text"
                    name="skills"
                    id="skills"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="ml-2 pb-1 block text-sm font-bold text-gray-700" htmlFor="address">Alamat</label>
                  <input
                    className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm focus:border-secondary focus:ring-secondary"
                    placeholder="Alamat"
                    required
                    defaultValue={userCredentials?.address}
                    name="address"
                    type="text"
                    id="address"
                  />
                </div>
                
                {/* Field Upload Foto Baru */}
                <div>
                  <label className="ml-2 pb-1 block text-sm font-bold text-gray-700" htmlFor="image">
                    Foto Baru (opsional)
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="block w-full border border-gray-300 shadow-sm rounded-md text-sm focus:z-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 file:border-0 file:bg-blue-500 file:text-white file:mr-4 file:py-2 file:px-4 hover:file:bg-blue-600 transition-colors"
                  />
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Pratinjau Gambar Baru:</p>
                      <img 
                        src={imagePreview} 
                        alt="Pratinjau" 
                        className="w-32 h-32 object-cover rounded-full border mx-auto"
                      />
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-2">Maksimal ukuran file: 5MB. Biarkan kosong jika tidak ingin mengganti foto.</p>
                </div>
              </div>

              <div className="pt-2">
                <h2 className="text-lg font-bold text-gray-700 mb-4">Pilih Peran</h2>
                <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
                  <div>
                    <input
                      className="peer sr-only"
                      id="option1"
                      type="radio"
                      value="user"
                      defaultChecked={userCredentials?.role === 'user'}
                      tabIndex="-1"
                      name="role"
                    />
                    <label
                      htmlFor="option1"
                      className="block w-full rounded-lg border-2 border-gray-200 p-3 hover:border-secondary peer-checked:border-secondary peer-checked:bg-secondary peer-checked:text-white cursor-pointer transition-colors"
                      tabIndex="0"
                    >
                      <span className="text-sm font-bold">User</span>
                    </label>
                  </div>
                  <div>
                    <input
                      className="peer sr-only"
                      id="option2"
                      type="radio"
                      value="admin"
                      defaultChecked={userCredentials?.role === 'admin'}
                      tabIndex="-1"
                      name="role"
                    />
                    <label
                      htmlFor="option2"
                      className="block w-full rounded-lg border-2 border-gray-200 p-3 hover:border-secondary peer-checked:border-secondary peer-checked:bg-secondary peer-checked:text-white cursor-pointer transition-colors"
                      tabIndex="0"
                    >
                      <span className="text-sm font-bold">Admin</span>
                    </label>
                  </div>
                  <div>
                    <input
                      className="peer sr-only"
                      id="option3"
                      value="instructor"
                      type="radio"
                      defaultChecked={userCredentials?.role === 'instructor'}
                      tabIndex="-1"
                      name="role"
                    />
                    <label
                      htmlFor="option3"
                      className="block w-full rounded-lg border-2 border-gray-200 p-3 hover:border-secondary peer-checked:border-secondary peer-checked:bg-secondary peer-checked:text-white cursor-pointer transition-colors"
                      tabIndex="0"
                    >
                      <span className="text-sm font-bold">Instruktur</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="ml-2 pb-1 block text-sm font-bold text-gray-700" htmlFor="message">Tentang</label>
                <textarea
                  className="w-full resize-none rounded-lg border-2 border-gray-200 p-3 text-sm focus:border-secondary focus:ring-secondary"
                  placeholder="Tentang pengguna"
                  rows="4"
                  defaultValue={userCredentials?.about || ''}
                  name='about'
                  id="message"
                ></textarea>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-block w-full rounded-lg bg-secondary px-6 py-3 font-bold text-white hover:bg-secondary-dark transition-colors sm:w-auto ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </div>
                  ) : (
                    'Perbarui Pengguna'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpdateUser;