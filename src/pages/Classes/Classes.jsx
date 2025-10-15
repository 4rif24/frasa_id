import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import { Transition } from '@headlessui/react';
import { Link, useNavigate } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const { currentUser } = useUser();
  const role = currentUser?.role;
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch classes
  useEffect(() => {
    axiosFetch
      .get('/classes') // Pastikan endpoint ini sesuai backend kamu
      .then(res => {
        console.log("Fetched classes:", res.data);
        setClasses(res.data);
      })
      .catch(err => console.error("Error fetching classes:", err));
  }, []);

  const handleHover = (index) => {
    setHoveredCard(index);
  };

  const handleSelect = (id) => {
    if (!currentUser) {
      alert("Please Login First");
      return navigate('/login');
    }

    axiosSecure
      .get(`/enrolled-classes/${currentUser.email}`)
      .then(res => setEnrolledClasses(res.data))
      .catch(err => console.error(err));

    axiosSecure
      .get(`/cart-item/${id}?email=${currentUser.email}`)
      .then(res => {
        if (res.data.classId === id) {
          return alert("Already Selected");
        } else if (enrolledClasses.find(item => item.classes._id === id)) {
          return alert("Already Enrolled");
        } else {
          const data = {
            classId: id,
            userMail: currentUser.email,
            date: new Date()
          };
          axiosSecure.post('/add-to-cart', data)
            .then(res => {
              alert('Added to the cart');
              console.log(res.data);
            })
            .catch(err => console.error(err));
        }
      })
      .catch(err => console.error(err));
  };

  if (!classes.length) {
    return (
      <div className="mt-20 text-center text-gray-500">
        Loading classes...
      </div>
    );
  }

  return (
  <div>
    <div className="mt-20 pt-3 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Kelas <span className="text-secondary">Pilihan</span> Kami
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Pilih kelas terbaik, raih skill terbaik
      </p>
    </div>

    <div className="my-16 w-[90%] mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {classes.map((cls, index) => (
        <div
          key={cls._id}
          className={`relative hover:-translate-y-2 duration-150 hover:ring-[2px] hover:ring-secondary w-64 mx-auto ${cls.availableSeats < 1 ? 'bg-red-300' : 'bg-white'} dark:bg-slate-600 rounded-lg shadow-lg overflow-hidden cursor-pointer`}
          onMouseEnter={() => handleHover(index)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="relative h-48">
            <div className={`absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ${hoveredCard === index ? "opacity-60" : ""}`} />
            <img src={cls.image} alt={`Gambar ${cls.name}`} className="object-cover w-full h-full" />
            <Transition
              show={hoveredCard === index}
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => handleSelect(cls._id)}
                  title={
                    role === 'admin' || role === 'instructor'
                      ? 'Instruktur/Admin tidak dapat memilih'
                      : cls.availableSeats < 1
                        ? 'Kursi tidak tersedia'
                        : 'Anda dapat memilih kelas ini'
                  }
                  disabled={role === 'admin' || role === 'instructor' || cls.availableSeats < 1}
                  className="px-4 py-2 text-white disabled:bg-red-300 bg-secondary duration-300 rounded hover:bg-primary"
                >
                  Tambahkan
                </button>
              </div>
            </Transition>
          </div>
          <div className="px-6 py-2">
            <h3 className="font-semibold mb-1">{cls.name}</h3>
            <p className="text-gray-500 text-xs">Instruktur: {cls.instructorName}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-gray-600 text-xs">Kursi Tersedia: {cls.availableSeats}</span>
              <span className="text-green-500 font-semibold">Rp {cls.price?.toLocaleString('id-ID')}</span>
            </div>
            <Link to={`/class/${cls._id}`}>
              <button className="px-4 py-2 mt-4 mb-2 w-full mx-auto text-white disabled:bg-red-300 bg-secondary duration-300 rounded hover:bg-primary">
                Lihat Detail
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
};

export default Classes;
