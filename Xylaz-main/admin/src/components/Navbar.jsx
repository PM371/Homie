import React, { useContext } from 'react';
import { assets } from '../assets/assets.js';
import { AdminContext } from '../context/AdminContext.jsx';

const Navbar = () => {
    const { aToken, setAToken } = useContext(AdminContext);

    const logout = () => {
        if (aToken) {
            setAToken('');
            localStorage.removeItem('aToken');
        }
        window.location.href = 'http://localhost:3000/signin';
    };

    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
            <div className='flex items-center gap-2 text-xs'>
                <p onClick={() => window.location.href = 'http://localhost:3000'} className='w-44 cursor-pointer text-4xl font-bold text-[#000b6d]'>Xylaz :)</p>
                <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>admin</p>
            </div>
            <button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
        </div>
    );
};

export default Navbar;
