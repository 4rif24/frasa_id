import React, { useEffect, useState } from 'react'
import useAxiosSecure from '../../../../../hooks/useAxiosSecure';
import useUser from '../../../../../hooks/useUser';
import { Pagination } from '@mui/material';

const MyPaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { currentUser } = useUser();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginatedPayments, setPaginatedPayments] = useState([]);
  const totalItem = payments.length;
  const [page, setPage] = useState(1);
  let totalPage = Math.ceil(totalItem / 5);
  let itemsPerPage = 5;

  const handleChange = (event, value) => {
    setPage(value);
  }

  useEffect(() => {
    const lastIndex = page * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = payments.slice(firstIndex, lastIndex);
    setPaginatedPayments(currentItems);
  }, [page, payments]);

  useEffect(() => {
    axiosSecure.get(`/payment-history/${currentUser?.email}`)
      .then(res => {
        setPayments(res.data);
        setLoading(false);
      })
      .catch(err => console.log(err));
  }, [currentUser?.email, axiosSecure]);

  const totalPaidAmount = payments.reduce((acc, curr) => acc + curr.amount, 0);

  if (loading) {
    return <p>Memuat data...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mt-6 mb-16">
        <p className="text-gray-400">
          Halo,{" "}
          <span className="text-secondary font-bold">{currentUser.name}</span>{" "}
          Selamat datang!
        </p>
        <h1 className="text-4xl font-bold">
          <span className="text-secondary">Riwayat</span> Pembayaran Saya
        </h1>
        <p className="text-gray-500 text-sm my-3">
          Anda dapat melihat riwayat pembayaran Anda di sini
        </p>
      </div>
      
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <p className="font-bold">Total Pembayaran: {payments.length}</p>
        <p className="font-bold">Total Dibayarkan: Rp{totalPaidAmount.toLocaleString()}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Jumlah
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Kelas
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Tanggal
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.map((payment, idx) => (
              <tr key={payment._id || idx}>
                <td className="px-6 py-4 whitespace-nowrap">{(page - 1) * itemsPerPage + idx + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">Rp{payment.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  {payment.classesId && Array.isArray(payment.classesId) 
                    ? payment.classesId.join(', ') 
                    : 'Tidak ada data kelas'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(payment.date).toLocaleDateString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPage > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination 
            count={totalPage} 
            page={page} 
            onChange={handleChange} 
            color="primary" 
          />
        </div>
      )}
    </div>
  );
}

export default MyPaymentHistory;