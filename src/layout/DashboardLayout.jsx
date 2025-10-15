import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';
import { BiHomeAlt, BiLogInCircle, BiSelectMultiple } from "react-icons/bi";
import { FaHome, FaUsers } from "react-icons/fa";
import { IoHandLeftOutline, IoSchoolSharp } from "react-icons/io5";
import { IoMdDoneAll } from "react-icons/io";
import { BsFillPostcardFill } from 'react-icons/bs';
import { SiGoogleclassroom, SiInstructure } from 'react-icons/si';
import { TbBrandAppleArcade } from 'react-icons/tb';
import { NavLink, useNavigate, Link, Outlet } from 'react-router-dom';
import { MdExplore, MdOfflineBolt, MdPayments, MdPending, MdPendingActions } from 'react-icons/md';
import { GiFigurehead } from 'react-icons/gi';
import Swal from 'sweetalert2';
import Scroll from '../hooks/useScroll';
import { HashLoader } from 'react-spinners';

const adminNavItems = [
  { to: "/dashboard/admin-home", icon: <BiHomeAlt className="text-2xl" />, label: "Beranda Admin" },
  { to: "/dashboard/manage-users", icon: <FaUsers className="text-2xl" />, label: "Kelola Pengguna" },
  { to: "/dashboard/manage-class", icon: <BsFillPostcardFill className="text-2xl" />, label: "Kelola Kelas" },
  { to: "/dashboard/manage-applications", icon: <TbBrandAppleArcade className="text-2xl" />, label: "Aplikasi" }
];

const instructorNavItem = [
  { to: "/dashboard/instructor-cp", icon: <FaHome className="text-2xl"/>, label: "Beranda"},
  { to: "/dashboard/add-class", icon: <MdExplore className="text-2xl"/>, label: "Tambah Kelas"},
  { to: "/dashboard/my-classes", icon: <IoSchoolSharp className="text-2xl"/>, label: "Kelas Saya"},
  { to: "/dashboard/my-pending", icon: <MdPendingActions className="text-2xl"/>, label: "Kelas Tertunda"},
  { to: "/dashboard/my-approved", icon: <IoMdDoneAll className="text-2xl"/>, label: "Kelas Disetujui"},
]

const students = [
  {to: "/dashboard/student-cp", icon: <BiHomeAlt className="text-2xl" />, label: "Beranda"},
  {to: "/dashboard/enrolled-class", icon: <SiGoogleclassroom className="text-2xl" />,label: "Kelas Saya"},
  {to: "/dashboard/my-selected", icon: <BiSelectMultiple className="text-2xl" />, label: "Kelas Dipilih"},
  {to: "/dashboard/my-payments", icon: <MdPayments className="text-2xl" />, label: "Riwayat Pembayaran"},
  {to: "/dashboard/apply-instructor", icon: <SiInstructure className="text-2xl" />, label: "Daftar Instruktur"}
];

const lastMenuItems = [
  {
    to: "/",
    icon: <BiHomeAlt className="text-2xl" />,
    label: "Beranda Utama",
  },
  { 
    to: "/trending", 
    icon: <MdOfflineBolt className="text-2xl" />, 
    label: "Trending" 
  },
  { 
    to: "/browse", 
    icon: <GiFigurehead className="text-2xl" />, 
    label: "Mengikuti" 
  },
];

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const { loader, logout } = useAuth();
  const { currentUser } = useUser();
  const role = currentUser?.role;
  const navigate = useNavigate();

  const handleLogOut = (event) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan keluar dari sistem!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Keluar!"
    }).then((result) => {
      if (result.isConfirmed) {
        logout().then(
          Swal.fire({
            title: "Berhasil Keluar",
            text: "Anda telah keluar dari sistem.",
            icon: "success"
          })
        ).catch((err) => console.log(error));    
      }
      navigate("/")
    });
  }

  if (loader) {
    return <div className='flex justify-center items-center h-screen'>
      <HashLoader color="#36d7b7" size={50}/>
    </div>;
  }

  return (
    <div className='flex'>
      <div className={`${open ? "w-72 overflow-y-auto" : "w-[90px] overflow-auto"} bg-white h-screen p-5 md:block hidden pt-8 relative duration-300`}>
        <div className='flex gap-x-4 items-center'>
          <img 
            onClick={() => setOpen(!open)} 
            src="/frasa-logo.png" 
            alt="" 
            className={`cursor-pointer h-[40px] duration-500 ${open && "rotate-[360deg]"}`}
          />
          <Link to="/">
            <h1 
              onClick={() => setOpen(!open)} 
              className={`text-dark-primary cursor-pointer font-bold origin-left text-xl duration-200 ${!open && "scale-0"}`}
            >
              
            </h1>
          </Link>
        </div>

        {/* Navlinks */}
        {/* admin role */}
        {role === "admin" && (
          <ul className="pt-6">
            <p className={`ml-3 text-gray-500 ${!open && "hidden"}`}>
              <small>MENU</small>
            </p>
            {role === "admin" &&
              adminNavItems.map((menuItem, index) => (
                <li key={index} className="mb-2">
                  <NavLink
                    to={menuItem.to}
                    className={({ isActive }) =>
                      `flex ${
                        isActive ? "bg-primary text-white" : "text-[#413F44]"
                      } duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4`
                    }
                  >
                    {menuItem.icon}
                    <span className={`${!open && "hidden"} origin-left duration-200`}>
                      {menuItem.label}
                    </span>
                  </NavLink>
                </li>
              ))}
          </ul>
        )}

        {/* instructor role */}
        {role === "instructor" && (
          <ul className="pt-6">
            <p className={`ml-3 text-gray-500 ${!open && "hidden"}`}>
              <small>MENU</small>
            </p>
            {
              instructorNavItem.map((menuItem, index) => (
                <li key={index} className="mb-2">
                  <NavLink
                    to={menuItem.to}
                    className={({ isActive }) =>
                      `flex ${
                        isActive ? "bg-primary text-white" : "text-[#413F44]"
                      } duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4`
                    }
                  >
                    {menuItem.icon}
                    <span className={`${!open && "hidden"} origin-left duration-200`}>
                      {menuItem.label}
                    </span>
                  </NavLink>
                </li>
              ))}
          </ul>
        )}

        {/* student role */}
        {role === "user" && (
          <ul className="pt-6">
            <p className={`ml-3 text-gray-500 ${!open && "hidden"}`}>
              <small>MENU</small>
            </p>
            {
              students.map((menuItem, index) => (
                <li key={index} className="mb-2">
                  <NavLink
                    to={menuItem.to}
                    className={({ isActive }) =>
                      `flex ${
                        isActive ? "bg-primary text-white" : "text-[#413F44]"
                      } duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4`
                    }
                  >
                    {menuItem.icon}
                    <span className={`${!open && "hidden"} origin-left duration-200`}>
                      {menuItem.label}
                    </span>
                  </NavLink>
                </li>
              ))}
          </ul>
        )}

        <ul className='pt-6'>
          <p className={`ml-3 text-gray-500 uppercase mb-3 ${!open && "hidden"}`}>
            <small>Link</small>
          </p>
          {
            lastMenuItems.map((menuItem, index) => (
              <li key={index} className="mb-2">
                <NavLink
                  to={menuItem.to}
                  className={({ isActive }) =>
                    `flex ${
                      isActive ? "bg-primary text-white" : "text-[#413F44]"
                    } duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4`
                  }
                >
                  {menuItem.icon}
                  <span className={`${!open && "hidden"} origin-left duration-200`}>
                    {menuItem.label}
                  </span>
                </NavLink>
              </li>
            ))
          }
          <li>
            <button                        
              onClick={() => handleLogOut()}
              className="flex duration-150 rounded-md p-2 cursor-pointer hover:bg-secondary hover:text-white font-bold text-sm items-center gap-x-4"
            >
              <BiLogInCircle className='text-2xl'/>
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Keluar
              </span>
            </button>
          </li>
        </ul>
      </div>
      
      <div className='h-screen overflow-y-auto px-8 flex-1'>
        <Scroll/>
        <Outlet/>
      </div>
    </div>
  );
};

export default DashboardLayout;