import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useUser from '../../../../hooks/useUser';
import { Link } from 'react-router-dom';

const EnrolledClasses = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const { currentUser } = useUser();

  useEffect(() => {
    axiosSecure.get(`/enrolled-classes/${currentUser?.email}`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [currentUser, axiosSecure]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className='text-3xl font-bold mb-8 text-gray-800'>Enrolled Classes</h1>
      
      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-xl text-gray-600 mb-2">No classes enrolled yet</h2>
          <p className="text-gray-500">Explore our courses and start learning!</p>
          <Link 
            to="/courses" 
            className="inline-block mt-4 bg-secondary hover:bg-secondary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {data.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-[400px]"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.classes.image} 
                  alt={item.classes.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h2 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">{item.classes.name}</h2>
                  <p className="text-gray-600 mb-3">Instructor: {item.classes.instructorName}</p>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <p className="font-bold text-secondary text-xl">Rp{item.classes.price?.toLocaleString('id-ID')}</p>
                  <Link 
                    to="/dashboard/courses-study" 
                    state={{ classId: item.classes._id }}
                    className="bg-secondary hover:bg-secondary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledClasses;