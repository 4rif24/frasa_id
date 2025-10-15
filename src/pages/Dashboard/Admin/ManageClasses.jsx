import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FiCheckCircle, FiXCircle, FiMessageSquare } from 'react-icons/fi';
import defaultClassImage from '../../../assets/user/default-profile.png';
import SectionTitle from '../../../components/SectioniTitle';
import ImageWithFallback from '../../../components/ImageWithFallback'; // Import komponen

const ManageClasses = () => {
  const navigate = useNavigate();
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await axiosFetch.get('/classes-manage');
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Format data tidak valid');
        }
        
        setClasses(response.data);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Gagal memuat data kelas');
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [axiosFetch]);

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Setujui Kelas?',
        text: 'Anda akan menyetujui kelas ini',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Ya, Setujui!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        const response = await axiosSecure.patch(`/change-status/${id}`, {
          status: 'approved'
        });

        if (response.data.success) {
          setClasses(prev => prev.map(cls => 
            cls._id === id ? { ...cls, status: 'approved' } : cls
          ));
          Swal.fire('Berhasil!', 'Kelas telah disetujui', 'success');
        }
      }
    } catch (err) {
      console.error('Approve error:', err);
      Swal.fire('Error', 'Gagal menyetujui kelas', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      const { value: reason } = await Swal.fire({
        title: 'Tolak Kelas?',
        input: 'textarea',
        inputLabel: 'Alasan Penolakan',
        inputPlaceholder: 'Masukkan alasan penolakan...',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Ya, Tolak!',
        cancelButtonText: 'Batal',
        inputValidator: (value) => !value && 'Harap masukkan alasan!'
      });

      if (reason) {
        // PERBAIKAN: Menggunakan endpoint yang sama dengan approve
        const response = await axiosSecure.patch(`/change-status/${id}`, {
          status: 'rejected',
          reason
        });

        if (response.data.success) {
          setClasses(prev => prev.map(cls => 
            cls._id === id ? { ...cls, status: 'rejected' } : cls
          ));
          Swal.fire('Ditolak!', 'Kelas telah ditolak', 'success');
        }
      }
    } catch (err) {
      console.error('Reject error:', err);
      Swal.fire('Error', 'Gagal menolak kelas', 'error');
    }
  };

  const handleFeedback = (id) => {
    navigate(`/dashboard/feedback/${id}`);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  
  return (
    <div className="px-4 py-8">
      <SectionTitle
        heading="Kelola Kelas"
        subHeading="Manajemen kelas dan persetujuan"
      />

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-secondary focus:border-secondary"
              placeholder="Cari kelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Classes Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gambar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instruktur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => (
                  <tr key={cls._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Gunakan ImageWithFallback untuk gambar kelas */}
                      <ImageWithFallback
                        src={cls.image}
                        alt={cls.name}
                        className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                        fallbackSrc={defaultClassImage}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{cls.name}</div>
                      <div className="text-sm text-gray-500 mt-1">Rp {cls.price?.toLocaleString() || '0'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{cls.instructorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(cls.status)}`}>
                        {cls.status === 'approved' ? 'Disetujui' : 
                         cls.status === 'pending' ? 'Menunggu' : 
                         cls.status === 'rejected' ? 'Ditolak' : cls.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(cls._id)}
                          disabled={cls.status !== 'pending'}
                          className={`flex items-center px-3 py-1 rounded-lg ${
                            cls.status !== 'pending' 
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          <FiCheckCircle className="mr-1" /> Setujui
                        </button>
                        <button
                          onClick={() => handleReject(cls._id)}
                          disabled={cls.status !== 'pending'}
                          className={`flex items-center px-3 py-1 rounded-lg ${
                            cls.status !== 'pending' 
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          <FiXCircle className="mr-1" /> Tolak
                        </button>
                        <button
                          onClick={() => handleFeedback(cls._id)}
                          className="flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          <FiMessageSquare className="mr-1" /> Feedback
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? 'Tidak ada kelas yang cocok dengan pencarian' : 'Tidak ada data kelas'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageClasses;