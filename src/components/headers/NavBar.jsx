import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Switch } from '@mui/material';
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";
import { AuthContext } from '../../utilities/providers/AuthProvider';
import Swal from 'sweetalert2';
import ImageWithFallback from '../../components/ImageWithFallback';

const navLinks = [
  { name: 'Beranda', route: '/' },
  { name: 'Mentor', route: '/instructors' },
  { name: 'Kelas', route: '/classes' },
];

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff0000",
    },
    secondary: {      
      main: "#00ff00",
    }
  }
});

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHome, setIsHome] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || false
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const { logout, user } = useContext(AuthContext);
   
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => { 
    setIsHome(location.pathname === '/');  
    setIsLogin(location.pathname === '/login'); 
    setIsFixed(location.pathname === '/register' || location.pathname === '/login');  
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavbarStyle = () => {
    if (isFixed) return 'bg-white dark:bg-black shadow-md';
    
    if (isHome) {
      return isScrolled 
        ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-md'
        : 'bg-transparent';
    }
    
    return 'bg-white dark:bg-black shadow-md';
  };

  const getTextColor = () => {
    if (isHome && !isScrolled) return 'text-white';
    return 'text-black dark:text-white';
  };

  const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan keluar dari akun ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Keluar!",
      cancelButtonText: "Batal"
    }).then((result) => {
      if (result.isConfirmed) {
        logout()
          .then(() => {
            Swal.fire({
              title: "Berhasil Keluar!",
              text: "Anda telah berhasil logout.",
              icon: "success",
            });
          })
          .catch((err) => {
            Swal.fire("Error!", err.message, "error");
          });
      }
    });
  };

  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${getNavbarStyle()} ${isFixed ? 'static' : 'fixed'} ${getTextColor()} top-0 transition-all duration-300 ease-in-out w-full z-50`}
    >
      <div className='lg:w-[95%] mx-auto sm:px-6 lg:px-6'>
        <div className="px-4 py-4 flex items-center justify-between">
          {/* Logo Section */}
          <div 
            onClick={() => navigate('/')} 
            className="flex-shrink-0 cursor-pointer pl-7 md:p-0 items-center hover:opacity-80 transition-opacity"
          >
            <div className="flex flex-col items-start">
              <h1 className='text-2xl inline-flex gap-2 items-center font-bold'>
                {/* Gunakan ImageWithFallback untuk logo */}
                <ImageWithFallback 
                  src="/frasa-logo.png" 
                  alt="Frasa Academy Logo" 
                  className='w-[200px] h-[50px] object-contain'
                  fallbackSrc="https://via.placeholder.com/200x50?text=Frasa+Logo"
                />
              </h1>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden flex items-center'>
            <button 
              type='button' 
              onClick={toggleMobileMenu} 
              className={`focus:outline-none ${getTextColor()}`}
              aria-label="Toggle menu"
            >
              <FaBars className='h-6 w-6 hover:text-primary' />
            </button>
          </div> 

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="flex">
              <ul className="ml-10 flex items-center space-x-6 pr-4">
                {navLinks.map((link) => (
                  <li key={link.route}>
                    <NavLink
                      to={link.route}
                      style={{ whiteSpace: "nowrap" }}
                      className={({ isActive }) =>
                        `font-semibold text-lg ${
                          isActive
                            ? 'text-primary'
                            : 'hover:text-primary'
                        } duration-300`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}

                {!user ? (
                  isLogin ? (
                    <li>
                      <NavLink 
                        to="/register"  
                        className={({ isActive }) =>
                          `font-semibold text-lg ${
                            isActive
                            ? 'text-secondary'
                            : 'hover:text-primary'
                          } duration-300`
                        }
                      >
                        Daftar
                      </NavLink>
                    </li>
                  ) : (
                    <li>
                      <NavLink 
                        to="/login"  
                        className={({ isActive }) =>
                          `font-semibold text-lg ${
                            isActive
                            ? 'text-secondary'
                            : 'hover:text-primary'
                          } duration-300`
                        }
                      >
                        Masuk
                      </NavLink>
                    </li>
                  )
                ) : (
                  <>
                    <li>
                      <NavLink 
                        to='/dashboard' 
                        className={({isActive}) => 
                          `font-semibold text-lg ${
                            isActive ? "text-secondary" : "hover:text-primary"
                          } duration-300 font-semibold`
                        }
                      >
                        Dashboard
                      </NavLink>
                    </li> 
                    
                    {/* User Profile Section */}
                    <li className="flex items-center gap-4">
                      {/* Gunakan ImageWithFallback untuk foto profil pengguna */}
                      <div className="flex items-center gap-3">
                        <ImageWithFallback 
                          src={user?.photoURL || user?.photoUrl} 
                          alt="Profil pengguna" 
                          className='h-10 w-10 rounded-full object-cover border-2 border-primary'
                          fallbackSrc="/default-avatar.png"
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                          referrerPolicy="no-referrer"
                        />
                       
                      </div>
                      
                      <button 
                        onClick={handleLogout} 
                        className='font-semibold text-sm px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
                      >
                        Keluar
                      </button>
                    </li>
                  </>
                )}

                {/* Theme Toggle */}
                <li>
                  <ThemeProvider theme={theme}>
                    <div className='flex flex-col justify-center items-center'>
                      <Switch 
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                        inputProps={{ 'aria-label': 'Toggle dark mode' }}
                      />
                      <span className='text-xs'>Mode Gelap</span>
                    </div>
                  </ThemeProvider>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-4 shadow-lg`}>
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.route}>
                <NavLink
                  to={link.route}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg ${
                      isActive
                        ? 'bg-primary text-white'
                        : isDarkMode 
                          ? 'text-white hover:bg-gray-800' 
                          : 'text-black hover:bg-gray-100'
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
            
            {!user ? (
              isLogin ? (
                <li>
                  <NavLink 
                    to="/register"  
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg ${
                        isActive
                        ? 'bg-secondary text-white'
                        : isDarkMode 
                          ? 'text-white hover:bg-gray-800' 
                          : 'text-black hover:bg-gray-100'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Daftar
                  </NavLink>
                </li>
              ) : (
                <li>
                  <NavLink 
                    to="/login"  
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg ${
                        isActive
                        ? 'bg-secondary text-white'
                        : isDarkMode 
                          ? 'text-white hover:bg-gray-800' 
                          : 'text-black hover:bg-gray-100'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Masuk
                  </NavLink>
                </li>
              )
            ) : (
              <>
                <li>
                  <NavLink 
                    to='/dashboard' 
                    className={({isActive}) => 
                      `block px-4 py-2 rounded-lg ${
                        isActive
                        ? 'bg-secondary text-white'
                        : isDarkMode 
                          ? 'text-white hover:bg-gray-800' 
                          : 'text-black hover:bg-gray-100'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                </li>
                
                {/* User Info in Mobile Menu */}
                <li className="flex items-center gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
                  <ImageWithFallback 
                    src={user.photoURL || user.photoUrl || "/default-avatar.png"} 
                    alt="Profil pengguna" 
                    className='h-12 w-12 rounded-full object-cover border-2 border-primary'
                    fallbackSrc="https://via.placeholder.com/48x48?text=User"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {user.displayName || user.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </li>
                
                <li>
                  <button 
                    onClick={(e) => {
                      handleLogout(e);
                      setIsMobileMenuOpen(false);
                    }} 
                    className='w-full text-left px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
                  >
                    Keluar
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </motion.nav>
  );
};

export default NavBar;