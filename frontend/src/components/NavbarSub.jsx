import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';

const NavbarSub = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // ตรวจสอบว่ามี token ใน localStorage หรือไม่ ถ้ามีก็ดึงค่าชื่อผู้ใช้
        const storedToken = localStorage.getItem('token');
        const lastUser = localStorage.getItem('lastUser');

        if (storedToken) {
            setToken(storedToken);
            setUser(lastUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('lastUser'); // ลบชื่อผู้ใช้
        localStorage.removeItem('token'); // ลบ token
        setToken(null);
        setUser(null);
        navigate('/signin');
    };

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5'>
            <p onClick={() => navigate('/')} className='w-44 cursor-pointer text-5xl font-semibold text-white flex items-center gap-2'>Homie <HiHome size={40} color="white" /></p>
            <ul className='hidden md:flex items-start gap-10 font-medium'>
                <NavLink to='/'>
                    <li className='py-1 font-bold'>HOME</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
                </NavLink>
                <NavLink to='/'>
                    <li className='py-1 font-bold'>OUR HOUSES</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
                </NavLink>
                <NavLink to='/'>
                    <li className='py-1 font-bold'>ABOUT US</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
                </NavLink>
                <NavLink to='/'>
                    <li className='py-1 font-bold'>CONTACT</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
                </NavLink>
            </ul>
            <div className='flex items-center gap-4'>
                {
                    token
                        ? <div className='flex items-center gap-2 cursor-pointer group relative'>
                            <img className='w-8 rounded-full' src={assets.profile_pic} alt=""/>
                            <span className='font-medium text-gray-700'>{user}</span> {/* แสดงชื่อผู้ใช้ */}
                            <img className='w-2.5' src={assets.dropdown_icon} alt=""/>
                            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                    <p onClick={() => navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                    <p onClick={handleLogout} className='hover:text-black cursor-pointer'>Logout</p>
                                </div>
                            </div>
                        </div>
                        : <button onClick={() => navigate('/signin')} className='bg-[#7A98AB] text-white px-8 py-3 rounded-full font-bold hidden md:block'>Login</button>
                }
                <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt=""/>
                {/*-------Mobile Menu-------*/}
            </div>
        </div>
    );
};

export default NavbarSub;