import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Receipt from './pages/Receipt';
import Barbers from './pages/Barbers';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import About from './pages/About';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import Appointment from './pages/Appointment';
import Navbar from './components/Navbar';
// import NavbarSub from './components/NavbarSub';
import Footer from './components/Footer';
import './index.css';
import axios from 'axios';

const App = () => {
    const [data, setData] = useState('');
    const location = useLocation();
    const hiddenPaths = ['/my-appointments', '/signup', '/signin'];
    // Dynamic paths
    const dynamicPaths = [/^\/receipt\/.+$/, /^\/appointment\/.+$/]; // ตรวจสอบ Dynamic Route เช่น /receipt/:appointmentId และ /appointment/:docId

    const showNavbar =
        !hiddenPaths.includes(location.pathname) &&
        !dynamicPaths.some((pattern) => pattern.test(location.pathname));


    const ScrollToTop = () => {
        const location = useLocation();

        useEffect(() => {
            // เลื่อนกลับไปที่ตำแหน่งบนสุดเมื่อเปลี่ยนเส้นทาง
            window.scrollTo(0, 0);
        }, [location]);

        return null; // ไม่ต้องแสดงอะไร
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8085');
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className='pt-[0rem]'>
            {showNavbar && <Navbar />}
            <h1>{data}</h1> {/* แสดงข้อมูลที่ดึงมา */}
            <Routes>
                <Route path='/signin' element={<Auth />} />
                <Route path='/SignUp' element={<Auth />} />
                <Route path='/' element={<Home />} />
                <Route path='/barbers' element={<Barbers />} />
                <Route path='/barbers/:speciality' element={<Barbers />} />
                <Route path='/barbers/:topbarbers' element={<Barbers />} />
                <Route path='/receipt/:appointmentId' element={<Receipt />} />
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/my-profile' element={<MyProfile />} />
                <Route path='/my-appointments' element={<MyAppointments />} />
                <Route path='/appointment/:docId' element={<Appointment />} />
            </Routes>
            <Footer />
        </div>
    );
};

export default App;
