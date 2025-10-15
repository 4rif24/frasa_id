import React from 'react';
import useUser from '../../../hooks/useUser';
import WelcomeImg from "../../../assets/dashboard/urban-welcome.svg";
import { Link } from 'react-router-dom';

const StudentCP = () => {
  const { currentUser } = useUser();
  
  return (
    <div className="h-screen flex justify-center items-center p-2">
      <div>
        <div>
          <div>
            <img 
              onContextMenu={e => e.preventDefault()} 
              src={WelcomeImg} 
              alt="" 
              className='h-[200px]' 
              placeholder="blur" 
            />
          </div>
          <h1 className='text-4xl capitalize font-bold'>
            Hai, <span className='text-secondary items-stretch'>{currentUser?.name}</span>
            Selamat datang di dashboard Anda
          </h1>
          <p className='text-center text-base py-2'>
            Hai, ini adalah tampilan sederhana dashboard. Developer kami sedang berusaha memperbarui Dashboard
          </p>
          <div className="text-center">
            <h2 className='font-bold'>Anda bisa menuju ke halaman apapun dari sini</h2>
            <div className="flex items-center justify-center my-4 gap-3 flex-wrap">
              <div className="border border-secondary hover:border-primary  rounded-lg hover:bg-primary hover:text-white duration-200 px-2 py-1">
                <Link to="/dashboard/enrolled-class">Kelas Saya</Link>
              </div>
              <div className="border border-secondary hover:border-primary  rounded-lg hover:bg-primary hover:text-white duration-200 px-2 py-1">
                <Link to="/dashboard/my-selected">Yang Dipilih</Link>
              </div>
              <div className="border border-secondary hover:border-primary  rounded-lg hover:bg-primary hover:text-white duration-200 px-2 py-1">
                <Link to="/dashboard/my-payments">Riwayat Pembayaran</Link>
              </div>
              <div className="border border-secondary hover:border-primary  rounded-lg hover:bg-primary hover:text-white duration-200 px-2 py-1">
                <Link to="/dashboard/apply-instructor">Daftar sebagai Instruktur</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCP;