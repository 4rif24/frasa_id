import React, { useContext, useState } from 'react';
import { useForm } from "react-hook-form";
import { AiOutlineLock, AiOutlineMail, AiOutlinePhone, AiOutlinePicture, AiOutlineUser } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import GoogleLogin from '../../components/Social/GoogleLogin';
import { AuthContext } from '../../utilities/providers/AuthProvider';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
  const navigate = useNavigate();
  const { signUp, updateUser, setError } = useContext(AuthContext);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_KEY = import.meta.env.VITE_IMG_TOKEN;
  const API_URL = 'https://api.imgbb.com/1/upload';

  // === Upload File Handler ===
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // validasi tipe
      if (!file.type.startsWith("image/")) {
        Swal.fire("Error!", "File harus berupa gambar", "error");
        e.target.value = "";
        return;
      }
      // validasi ukuran
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error!", "Ukuran gambar tidak boleh lebih dari 5MB", "error");
        e.target.value = "";
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // === Submit Form ===
  const onSubmit = async (data) => {
    setError("");
    setIsSubmitting(true);
    try {
      if (!image) {
        Swal.fire("Error!", "Harap unggah foto profil", "error");
        return;
      }

      // Upload ke imgbb
      const uploadFormData = new FormData();
      uploadFormData.append("image", image);

      const imgRes = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        body: uploadFormData,
      });

      if (!imgRes.ok) throw new Error("Gagal mengupload gambar");
      const imgData = await imgRes.json();
      if (!imgData.success) throw new Error(imgData.error?.message || "Upload gagal");

      const photoURL = imgData.data.url || imgData.data.display_url;

      // Daftar user
      const result = await signUp(data.email, data.password);
      const user = result.user;

      if (user) {
        await updateUser(data.name, photoURL);

        const userImp = {
          name: data.name,
          email: data.email,
          photoURL: photoURL,
          role: 'user',
          gender: data.gender,
          phone: data.phoneNumber,
          address: data.address
        };

        await axios.post("https://frasaid-backend.vercel.app/api/new-user", userImp);

        Swal.fire("Berhasil!", "Pendaftaran berhasil!", "success");
        navigate("/");
      }
    } catch (err) {
      setError(err.code || err.message);
      Swal.fire("Error!", err.message || "Terjadi kesalahan", "error");
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const password = watch('password', '');

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50 py-8 px-4'>
      <div className='bg-white p-8 rounded-xl shadow-sm w-full max-w-4xl'>
        <h2 className='text-2xl font-semibold text-center text-gray-800 mb-6'>Buat Akun Baru</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Nama & Email */}
          <div className='flex flex-col md:flex-row gap-6 mb-5'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <AiOutlineUser className='inline-block mr-2 text-gray-500'/> Nama Lengkap
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  {...register("name", { required: "Nama wajib diisi" })} 
                  className='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder="Masukkan nama lengkap"
                />
                <AiOutlineUser className='absolute left-3 top-3 text-gray-400'/>
              </div>
              {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>}
            </div>
            
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <AiOutlineMail className='inline-block mr-2 text-gray-500'/> Email
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  {...register("email", { 
                    required: "Email wajib diisi",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email tidak valid"
                    }
                  })} 
                  className='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder="Masukkan alamat email"
                />
                <AiOutlineMail className='absolute left-3 top-3 text-gray-400'/>
              </div>
              {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
            </div>
          </div>

          {/* Password & Konfirmasi Password */}
          <div className='flex flex-col md:flex-row gap-6 mb-5'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <AiOutlineLock className='inline-block mr-2 text-gray-500'/> Kata Sandi
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  {...register("password", { required: "Kata sandi wajib diisi" })} 
                  className='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder="Buat kata sandi"
                />
                <AiOutlineLock className='absolute left-3 top-3 text-gray-400'/>
              </div>
              {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>}
            </div>
            
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <AiOutlineLock className='inline-block mr-2 text-gray-500'/> Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  {...register("confirmPassword", { 
                    validate: v => v === password || "Kata sandi tidak cocok" 
                  })} 
                  className='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder="Konfirmasi kata sandi"
                />
                <AiOutlineLock className='absolute left-3 top-3 text-gray-400'/>
              </div>
              {errors.confirmPassword && <p className='text-red-500 text-xs mt-1'>{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Telepon & Foto Profil */}
          <div className='flex flex-col md:flex-row gap-6 mb-5'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <AiOutlinePhone className='inline-block mr-2 text-gray-500'/> Nomor Telepon
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  {...register("phoneNumber", { required: "Nomor telepon wajib diisi" })} 
                  className='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder="Masukkan nomor telepon"
                />
                <AiOutlinePhone className='absolute left-3 top-3 text-gray-400'/>
              </div>
              {errors.phoneNumber && <p className='text-red-500 text-xs mt-1'>{errors.phoneNumber.message}</p>}
            </div>
            
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <AiOutlinePicture className='inline-block mr-2 text-gray-500'/> Foto Profil
              </label>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {preview && (
                <div className="mt-2">
                  <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded-md border"/>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Maksimal ukuran file: 5MB</p>
            </div>
          </div>

          {/* Gender & Alamat */}
          <div className='flex flex-col md:flex-row gap-6 mb-5'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Jenis Kelamin</label>
              <select 
                {...register("gender", { required: "Pilih jenis kelamin" })} 
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="female">Perempuan</option>
                <option value="male">Laki-laki</option>
                <option value="other">Lainnya</option>
              </select>
              {errors.gender && <p className='text-red-500 text-xs mt-1'>{errors.gender.message}</p>}
            </div>
            
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Alamat</label>
              <textarea 
                {...register("address", { required: "Alamat wajib diisi" })} 
                rows="3" 
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan alamat lengkap"
              />
              {errors.address && <p className='text-red-500 text-xs mt-1'>{errors.address.message}</p>}
            </div>
          </div>

          {/* Tombol Daftar */}
          <div className="text-center mt-6">
            <button 
              type='submit' 
              className={`w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mendaftarkan..." : "Daftar"}
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Atau</span>
          </div>
        </div>

        <GoogleLogin />

        <p className='text-center text-sm text-gray-600 mt-6'>
          Sudah punya akun? <Link to={"/login"} className='text-blue-600 hover:text-blue-800 font-medium'>Masuk</Link>          
        </p>
      </div>
    </div>
  );
};

export default Register;