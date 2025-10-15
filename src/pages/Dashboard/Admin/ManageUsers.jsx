import React, { useEffect, useState, useCallback } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiUser, FiMail, FiKey, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import Swal from 'sweetalert2';
import SectionTitle from '../../../components/SectioniTitle';

const ManageUsers = () => {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [processing, setProcessing] = useState(null);

  // Fetch users data
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    axiosFetch.get('/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        Swal.fire(
          'Error!',
          'Gagal memuat data pengguna.',
          'error'
        );
      });
  }, [axiosFetch]);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Konfirmasi Hapus',
      text: "Apakah Anda yakin ingin menghapus pengguna ini?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        setProcessing(id);
        
        // PERBAIKAN URL ENDPOINT - sesuaikan dengan backend
        axiosSecure.delete(`/delete-user/${id}`)  // Tambahkan /api/
          .then(res => {
            if (res.data.deletedCount > 0) {
              Swal.fire(
                'Terhapus!',
                'Pengguna berhasil dihapus.',
                'success'
              );
              setUsers(users.filter(user => user._id !== id));
            } else {
              // Handle jika user tidak ditemukan
              Swal.fire(
                'Gagal!',
                'Pengguna tidak ditemukan.',
                'error'
              );
            }
          })
          .catch(err => {
            console.log('Error details:', err);
            
            // Error handling yang lebih spesifik
            if (err.response?.status === 401) {
              Swal.fire(
                'Unauthorized',
                'Anda harus login kembali.',
                'error'
              );
            } else if (err.response?.status === 403) {
              Swal.fire(
                'Akses Ditolak',
                'Hanya admin yang dapat menghapus pengguna.',
                'error'
              );
            } else if (err.response?.status === 404) {
              Swal.fire(
                'Tidak Ditemukan',
                'Endpoint atau pengguna tidak ditemukan.',
                'error'
              );
            } else {
              Swal.fire(
                'Gagal!',
                'Terjadi kesalahan saat menghapus pengguna.',
                'error'
              );
            }
          })
          .finally(() => {
            setProcessing(null);
          });
      }
    });
  };

  const handleRoleChange = (userId, newRole) => {
    Swal.fire({
      title: `Ubah Role ke ${newRole}?`,
      text: `Anda akan mengubah role pengguna ini menjadi ${newRole}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Ubah!'
    }).then((result) => {
      if (result.isConfirmed) {
        setProcessing(userId);
        axiosSecure.patch(`/users/${userId}/role`, { role: newRole })
          .then(res => {
            if (res.data.modifiedCount > 0) {
              Swal.fire(
                'Berhasil!',
                `Role berhasil diubah menjadi ${newRole}`,
                'success'
              );
              setUsers(users.map(user => 
                user._id === userId ? { ...user, role: newRole } : user
              ));
            }
          })
          .catch(err => {
            console.log(err);
            Swal.fire(
              'Gagal!',
              'Gagal mengubah role pengguna',
              'error'
            );
          })
          .finally(() => {
            setProcessing(null);
          });
      }
    });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const refreshData = () => {
    fetchUsers();
    Swal.fire(
      'Data Diperbarui!',
      'Data pengguna telah diperbarui.',
      'success'
    );
  };

  return (
    <div className="px-4 py-8">
      <SectionTitle
        heading="Kelola Pengguna"
        subHeading="Manajemen data pengguna sistem"
      />

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-secondary focus:border-secondary"
              placeholder="Cari berdasarkan nama, email, atau role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={refreshData}
            className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <FiRefreshCw className="mr-2" /> Refresh Data
          </button>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profil</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user, idx) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {indexOfFirstUser + idx + 1}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              <img
                                className="h-10 w-10 rounded-full object-cover border-2 border-white shadow"
                                src={user?.photoUrl || '/avatar.png'}
                                alt={user.name}
                                onError={(e) => {
                                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNFNEU2RTkiLz4KPHBhdGggZD0iTTIwIDIxLjVDMjIuNDg1MyAyMS41IDI0LjUgMTkuNDg1MyAyNC41IDE3QzI0LjUgMTQuNTE0NyAyMi40ODUzIDEyLjUgMjAgMTIuNUMxNy41MTQ3IDEyLjUgMTUuNSAxNC41MTQ3IDE1LjUgMTdDMTUuNSAxOS40ODUzIDE3LjUxNDcgMjEuNSAyMCAyMS41WiIgZmlsbD0iIzlBAUGBRCIvPgo8cGF0aCBkPSJNMTUuNSAyNC41QzE0LjUgMjQuNSAxMy41IDI0LjUgMTIuODMzMyAyMy44MzMzQzEyLjE2NjcgMjMuMTY2NyAxMi4xNjY3IDIyLjE2NjcgMTIuMTY2NyAyMC44MzMzQzEyLjE2NjcgMTkuNSAxMy4xNjY3IDE4LjUgMTQuNSAxOC41SDI1LjVDMjYuODMzMyAxOC41IDI3LjgzMzMgMTkuNSAyNy44MzMzIDIwLjgzMzNDMjcuODMzMyAyMi4xNjY3IDI3LjgzMzMgMjMuMTY2NyAyNy4xNjY3IDIzLjgzMzNDMjYuNSAyNC41IDI1LjUgMjQuNSAyNC41IDI0LjVIMTUuNVoiIGZpbGw9IiM5QUFBQUQiLz4KPC9zdmc+";
                                }}
                              />
                              {user?.verified && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                                  <MdVerified className="text-white text-xs" />
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <FiMail className="mr-1" />
                            {user.email}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-2">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                user.role === 'instructor' ? 'bg-blue-100 text-blue-800' : 
                                'bg-green-100 text-green-800'}`}>
                              {user.role}
                            </span>
                            
                            <div className="flex flex-wrap gap-1">
                              <button
                                onClick={() => handleRoleChange(user._id, 'admin')}
                                disabled={user.role === 'admin' || processing === user._id}
                                className={`text-xs px-2 py-1 rounded ${user.role === 'admin' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'} ${processing === user._id ? 'opacity-50' : ''}`}
                              >
                                {processing === user._id ? '...' : 'Admin'}
                              </button>
                              <button
                                onClick={() => handleRoleChange(user._id, 'instructor')}
                                disabled={user.role === 'instructor' || processing === user._id}
                                className={`text-xs px-2 py-1 rounded ${user.role === 'instructor' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'} ${processing === user._id ? 'opacity-50' : ''}`}
                              >
                                {processing === user._id ? '...' : 'Instruktur'}
                              </button>
                              <button
                                onClick={() => handleRoleChange(user._id, 'user')}
                                disabled={user.role === 'user' || processing === user._id}
                                className={`text-xs px-2 py-1 rounded ${user.role === 'user' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-50 text-green-600 hover:bg-green-100'} ${processing === user._id ? 'opacity-50' : ''}`}
                              >
                                {processing === user._id ? '...' : 'User'}
                              </button>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/dashboard/update-user/${user._id}`)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center bg-indigo-50 px-3 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
                              disabled={processing === user._id}
                            >
                              <FiEdit className="mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="text-red-600 hover:text-red-900 flex items-center bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors"
                              disabled={processing === user._id}
                            >
                              <FiTrash2 className="mr-1" /> Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchTerm ? 'Tidak ada pengguna yang sesuai dengan pencarian' : 'Tidak ada pengguna yang ditemukan'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;