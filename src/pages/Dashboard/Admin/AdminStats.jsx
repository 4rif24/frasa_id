import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaChalkboardTeacher, FaBookOpen } from "react-icons/fa";
import { MdPendingActions, MdPeople } from "react-icons/md";

const AdminStats = ({ users }) => {
  const [data, setData] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure.get('/admin-stats')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Statistik Admin</h2>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Total Member Card */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <MdPeople className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Member</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {users?.length || 0}
            </p>
          </div>
        </div>

        {/* Approved Classes Card */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="p-3 bg-green-100 rounded-full mr-4">
            <FaBookOpen className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Kelas Disetujui</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {data?.approvedClasses || 0}
            </p>
          </div>
        </div>

        {/* Instructors Card */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="p-3 bg-purple-100 rounded-full mr-4">
            <FaChalkboardTeacher className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Instruktur</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {data?.instructors || 0}
            </p>
          </div>
        </div>

        {/* Pending Classes Card */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="p-3 bg-yellow-100 rounded-full mr-4">
            <MdPendingActions className="h-8 w-8 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Menunggu Persetujuan</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {data?.pendingClasses || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;