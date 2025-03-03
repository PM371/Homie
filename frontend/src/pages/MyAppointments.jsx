import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavbarSub';
import axios from "axios";

const MyAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [paidAppointments, setPaidAppointments] = useState([]); // เก็บ appointmentId ที่จ่ายแล้ว
    const [showPopup, setShowPopup] = useState(false);


    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const lastUser = localStorage.getItem('lastUser');
        if (storedToken) {
            setToken(storedToken);
            setUser(lastUser);
        }
    }, []);

    useEffect(() => {
        const fetchAppointmentInfo = () => {
            fetch('http://localhost:8085/appointment')
                .then(response => response.json())
                .then(data => {
                    const fetchedAppointments = data
                        .filter(appointment => appointment.username === user)
                        .map(appointment => ({
                            date: appointment.appointmentDate,
                            time: appointment.appointmentTime,
                            stylistClass: appointment.barberClass,
                            name: appointment.username,
                            barberName: appointment.barberName,
                            barberProfilePicture: appointment.barberProfilePicture,
                            id: appointment.appointmentId,
                            status: appointment.status
                        }));
                    setAppointments(fetchedAppointments);
                })
                .catch(error => console.error('Error fetching appointment info:', error));
        };

        if (user) {
            fetchAppointmentInfo();
        }
    }, [user]);

    const handlePay = async (appointmentId) => {
        try {
            await axios.patch(
                `http://localhost:8085/appointment/${appointmentId}`,
                { status: 'paid' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setPaidAppointments([...paidAppointments, appointmentId]);
            setShowPopup(true);
        } catch (error) {
            console.error('Payment failed:', error.response?.data || error.message);
            alert(error.response?.data?.message || "An error occurred while processing payment.");
        }
    };
    return (
        <div className='mx-4 sm:mx-[10%] mt-5'>
            <Navbar />
            {appointments.map((appointment, index) => (
                <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b ' key={index}>
                    <div>
                        <img className='w-32 bg-indigo-50'
                             src={`http://localhost:8085/picture/${appointment.barberProfilePicture}`} alt="" />
                    </div>
                    <div className='flex-1 text-sm text-zinc-600'>
                        <p className='text-neutral-800 font-semibold'>{appointment.barberName}</p>
                        <p className='text-xs mt-1'>
                            <span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {appointment.date} | {appointment.time}
                        </p>
                        {paidAppointments.includes(appointment.id) || appointment.status === 'paid' ? (
                            <span className='text-sm text-green-600 font-semibold mt-2 block'>PAID</span> // เพิ่ม mt-2 และ block
                        ) :
                            <span className='text-sm text-red-600 font-semibold mt-2 block'>UNPAID</span>}
                    </div>
                    <div className='flex flex-col gap-2 justify-center items-center h-full '>
                        {paidAppointments.includes(appointment.id) || appointment.status === 'paid' ? (
                            <button
                                onClick={() => navigate(`/receipt/${appointment.id}`)}
                                className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 mt-6'>
                                Receipt
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => handlePay(appointment.id)}
                                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-green-600 hover:text-white transition-all duration-300'>
                                    Pay Online
                                </button>
                                <button
                                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>
                                    Cancel appointment
                                </button>
                            </>
                        )}
                    </div>

                </div>
            ))}

            {showPopup && (
                <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50'>
                    <div className='bg-yellow-300 p-5 rounded shadow-lg text-center'>
                        <img
                            // src="/src/picture/qr_code.png"
                            src='http://localhost:8085/picture/qr_code.png'
                            alt="QR"
                            className='w-30 h-30 mb-4 mx-auto' // ขนาดและระยะห่างของรูป
                        />
                        <h2 className='font-bold text-lg'>Scan to pay</h2>
                        <p>Please complete your payment.</p>
                        <button
                            onClick={() => setShowPopup(false)}
                            className='mt-4 bg-gray-500 text-white py-1 px-4 rounded'
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );



}

export default MyAppointments;