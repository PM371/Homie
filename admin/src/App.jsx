import React from 'react'
import Login from './pages/Login.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar.jsx'
import { useContext } from 'react'
import { AdminContext } from './context/AdminContext.jsx'
import Bar from './components/Bar.jsx';
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx';
import AddBarber from './pages/AddBarber.jsx';
import BarberList from './pages/BarberList.jsx';
import AllAppointments from './pages/AllAppointment.jsx';
import Receipt from './pages/Receipt.jsx';
import BarberSalary from './pages/BarberSalary.jsx'; // นำเข้า BarberSalary component

const App = () => {

    const { aToken } = useContext(AdminContext)

    return (
        <div className='bg-[#F8F9FD]'>
            <ToastContainer/>
            <Navbar/>
            <div className='flex items-start'>
                <Bar/>
                <Routes>
                    <Route path='/' element={<></>}/>
                    <Route path='/admin-dashboard' element={<Dashboard/>}/>
                    <Route path='/all-appointment' element={<AllAppointments/>}/>
                    <Route path='/add-barber' element={<AddBarber/>}/>
                    <Route path='/barber-list' element={<BarberList/>}/>
                    <Route path='/receipt' element={<Receipt/>}/>
                    <Route path='/barber-salary/:barber_id' element={<BarberSalary/>}/> {/* เพิ่มเส้นทางนี้ */}
                </Routes>
            </div>
        </div>
    )
}

export default App
