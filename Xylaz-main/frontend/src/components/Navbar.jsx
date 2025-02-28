import React, { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeLink, setActiveLink] = useState(''); // เพิ่ม state สำหรับเก็บเมนูที่เลือก
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const homeRef = useRef(null);
  const barbersRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const lastUser = localStorage.getItem('lastUser');

    if (storedToken) {
      setToken(storedToken);
      setUser(lastUser);
    }
  }, []);

  useEffect(() => {
    handleLinkClick('home')
  },[]);

  const handleLogout = () => {
    localStorage.removeItem('lastUser');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/signin');
  };

  const handleLinkClick = (link) => {
    setActiveLink(link); // เก็บค่าเมนูที่เลือก
  };

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
      <div>
        <div className='flex items-center justify-between text-sm py-2 mb-5 fixed top-0 left-30 right-40 z-50 mt-11'>
          <div className="flex items-center justify-center text-sm py-1 mb-5 fixed top-0 left-[390px] right-[390px] z-50 bg-white bg-opacity-90 mt-12 mr-4 rounded-full">
            <ul className="hidden md:flex items-center gap-10 font-medium">
              <NavLink
                  onClick={() => {
                    scrollToSection(homeRef);
                    handleLinkClick('home');
                  }}
                  className={`flex flex-col items-center group ${activeLink === 'home' ? 'bg-primary text-white' : 'text-black'} rounded-full`}
              >
                <li className="inline-flex py-4 px-8 transition duration-300 rounded-full">
                  HOME
                </li>
              </NavLink>

              <NavLink
                  onClick={() => {
                    scrollToSection(barbersRef);
                    handleLinkClick('barbers');
                  }}
                  className={`flex flex-col items-center group ${activeLink === 'barbers' ? 'bg-primary text-white' : 'text-black'} rounded-full`}
              >
                <li className="inline-flex py-4 px-8 transition duration-300 rounded-full">
                  ALL BARBERS
                </li>
              </NavLink>

              <NavLink
                  onClick={() => {
                    scrollToSection(aboutRef);
                    handleLinkClick('about');
                  }}
                  className={`flex flex-col items-center group ${activeLink === 'about' ? 'bg-primary text-white' : 'text-black'} rounded-full`}
              >
                <li className="inline-flex py-4 px-8 transition duration-300 rounded-full">
                  ABOUT
                </li>
              </NavLink>

              <NavLink
                  onClick={() => {
                    scrollToSection(contactRef);
                    handleLinkClick('contact');
                  }}
                  className={`flex flex-col items-center group ${activeLink === 'contact' ? 'bg-primary text-white' : 'text-black'} rounded-full`}
              >
                <li className="inline-flex py-4 px-8 transition duration-300 rounded-full">
                  CONTACT
                </li>
              </NavLink>
            </ul>
          </div>

          <div className='flex items-center  px-12 py-2 rounded-full  md:block mr-[-25px] '>
            {
              token
                  ? <div className='flex items-center bg-[#0B192C] gap-2 py-2 px-7 border-2 cursor-pointer group relative rounded-full mr-[-30px]'>
                    <img className='w-8 rounded-full' src={assets.profile_pic} alt=""/>
                    <span className='font-medium text-white '>{user}</span>
                    <img className='w-2.5' src={assets.dropdown_icon} alt=""/>
                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                      <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                        <p onClick={() => navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                        <p onClick={handleLogout} className='hover:text-black cursor-pointer'>Logout</p>
                      </div>
                    </div>
                  </div>
                  : <button onClick={() => navigate('/signin')} className='border-2 bg-primary text-white font-semibold px-12 py-4 rounded-full font-light hidden md:block mr-[-30px]'>Login</button>
            }
            <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt=""/>
          </div>
        </div>

        {/* Sections */}
        <div className="absolute" style={{ top: '0%' }} ref={homeRef} id="home-section"></div>
        <div className="absolute" style={{ top: '80%' }} ref={barbersRef} id="barbers-section"></div>
        <div className="absolute" style={{ top: '180%' }} ref={aboutRef} id="about-section"></div>
        <div className="absolute" style={{ top: '280%' }} ref={contactRef} id="contact-section"></div>
      </div>
  );
};

export default Navbar;
