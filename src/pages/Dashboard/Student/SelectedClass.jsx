import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useUser from '../../../hooks/useUser';
import moment from 'moment';
import { FiDollarSign, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { MdOutlineRemoveShoppingCart } from 'react-icons/md';
import Swal from 'sweetalert2';
import SectionTitle from '../../../components/SectioniTitle';

// Fungsi untuk format Rupiah
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const SelectedClass = () => {
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure
      .get(`/cart/${currentUser?.email}`)
      .then((res) => {
        setClasses(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [currentUser?.email, axiosSecure]);

  // Hitung harga
  const totalPrice = classes.reduce((acc, item) => acc + parseFloat(item.price || 0), 0);
  const totalTax = totalPrice * 0.01;
  const grandTotal = totalPrice + totalTax;

  // Handle pembayaran semua kelas
  const handlePayAll = () => {
    navigate('/dashboard/user/payment', { 
      state: { 
        price: grandTotal,
        items: classes.map(item => item._id),
        type: 'multiple' // Menandakan pembayaran untuk multiple items
      } 
    });
  };

  // Handle pembayaran per kelas
  const handlePay = (id) => {
    const item = classes.find((item) => item._id === id);
    navigate('/dashboard/user/payment', { 
      state: { 
        price: item.price, 
        itemId: id,
        type: 'single' // Menandakan pembayaran untuk single item
      } 
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Kelas?",
      text: "Anda akan menghapus kelas ini dari keranjang",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/delete-cart-item/${id}`)
          .then(() => {
            Swal.fire(
              'Terhapus!',
              'Kelas telah dihapus dari keranjang.',
              'success'
            );
            setClasses(classes.filter((item) => item._id !== id));
          })
          .catch(error => {
            console.error(error);
            Swal.fire(
              'Gagal!',
              'Terjadi kesalahan saat menghapus kelas.',
              'error'
            );
          });
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-secondary mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <SectionTitle
        heading="Kelas Pilihan Saya"
        subHeading="Kelola kelas dalam keranjang Anda"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Daftar Kelas */}
        <div className="lg:w-3/4">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiShoppingCart className="mr-2" /> Keranjang Belanja
              <span className="ml-2 bg-secondary text-white text-sm px-2 py-1 rounded-full">
                {classes.length} item
              </span>
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classes.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <MdOutlineRemoveShoppingCart className="text-4xl mb-2" />
                          <p className="text-lg">Keranjang belanja kosong</p>
                          <button 
                            onClick={() => navigate('/classes')}
                            className="mt-4 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary transition-colors"
                          >
                            Jelajahi Kelas
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    classes.map((item, idx) => (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="h-12 w-12 rounded-lg object-cover mr-4 border border-gray-200"
                              onError={(e) => {
                                e.target.src = 'https://i.ibb.co/M1q7YgB/avatar.png';
                              }}
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-xs text-gray-500">{item.instructorName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {formatRupiah(item.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {moment(item.submitted).format("DD MMM YYYY")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="flex items-center px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Hapus dari keranjang"
                            >
                              <FiTrash2 className="mr-1" /> Hapus
                            </button>
                            <button
                              onClick={() => handlePay(item._id)}
                              className="flex items-center px-3 py-1 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                              title="Bayar kelas ini"
                            >
                              <FiDollarSign className="mr-1" /> Bayar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Ringkasan Pembayaran */}
        {classes.length > 0 && (
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Ringkasan Pembayaran
              </h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({classes.length} item)</span>
                  <span className="font-medium text-gray-900">{formatRupiah(totalPrice)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pajak (1%)</span>
                  <span className="font-medium text-gray-900">{formatRupiah(totalTax)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Biaya Layanan</span>
                  <span className="font-medium text-gray-900">{formatRupiah(0)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-3 mb-4">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span className="text-gray-800">Total</span>
                  <span className="text-green-600">{formatRupiah(grandTotal)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">* Sudah termasuk pajak</p>
              </div>
              
              <button
                onClick={handlePayAll}
                className="w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center bg-secondary text-white hover:bg-primary transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                disabled={classes.length === 0}
              >
                <FiDollarSign className="mr-2" />Bayar Semua - {formatRupiah(grandTotal)}
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                Klik "Bayar" pada item untuk membayar per kelas
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedClass;