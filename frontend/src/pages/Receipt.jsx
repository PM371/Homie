import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/NavbarSub';
import axios from "axios";

const Receipt = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [receipt, setReceipt] = useState(null); // ใช้ null ตอนแรก
    const { appointmentId } = useParams();  // ดึง appointmentId จาก URL

    useEffect(() => {
        // ตรวจสอบว่า appointmentId มีค่าหรือไม่
        console.log("Appointment ID: ", appointmentId);

        // ดึงข้อมูลการนัดหมายทั้งหมด
        fetch('http://localhost:8085/appointment')
            .then(response => response.json())
            .then(data => {
                setAppointments(data);
            })
            .catch(error => console.error('Error fetching appointments:', error));
    }, [appointmentId]);  // ใช้ appointmentId เป็น dependency

    useEffect(() => {
        // ค้นหาการนัดหมายที่ตรงกับ appointmentId
        if (appointmentId) {
            const selectedAppointment = appointments.find(appointment => appointment.id === appointmentId);
            if (selectedAppointment) {
                setReceipt(selectedAppointment);
            }
        }
    }, [appointments, appointmentId]);

    const handleDone = () => {
        navigate('/my-appointments');
    };

    if (!receipt) {
        return <p>Loading receipt...</p>;  // แสดงข้อความขณะรอข้อมูล
    }
    return (
        <div className='mx-4 sm:mx-[10%] mt-5'>
            <Navbar />
        <div className="flex flex-col items-center h-screen mt-15">

            <div className="w-[400px] h-[500px] bg-white rounded-lg shadow-[0px_4px_20px_rgba(0,0,0,0.15)] flex flex-col items-center p-6 mt-4">
                <div className="w-12 h-12 bg-[#E5F4ED] rounded-full flex items-center justify-center mb-4 mt-5">
                    <img src="/src/picture/tick-circle.png" alt="tick" className="w-7 h-7" />
                </div>
                <h2 className="text-black text-[18px] font-semibold tracking-[1px] mt-2">Payment Success!</h2>
                <p className="text-gray-600 text-[13px] tracking-[0.5px] mt-2 text-center">Your payment has been successfully done.</p>

                <div className="w-full border-t-[1px] border-gray-300 mt-5"></div>

                <div className="w-full mt-5 flex flex-col ">
                    <p className="text-gray-600 text-[13px] tracking-[0.5px] text-center">Total Payment</p>
                    <h2 className="text-black text-[18px] font-semibold tracking-[1px] mt-1 text-center">{receipt.price} Baht</h2>
                </div>

                <div className="w-full mt-10 space-y-4">
                    <div className="flex justify-between">
                        <p className="text-gray-600 text-[13px] tracking-[0.5px]">Ref Number</p>
                        <p className="text-black text-[13px]">{receipt.id}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-gray-600 text-[13px] tracking-[0.5px]">Barber Name</p>
                        <p className="text-black text-[13px]">{receipt.barberName}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-gray-600 text-[13px] tracking-[0.5px]">Appointment Time</p>
                        <p className="text-black text-[13px]">{receipt.appointmentTime} | {receipt.appointmentDate}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-gray-600 text-[13px] tracking-[0.5px]">Payment Method</p>
                        <p className="text-black text-[13px]">Bank Transfer</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-gray-600 text-[13px] tracking-[0.5px]">Sender Name</p>
                        <p className="text-black text-[13px]">{receipt.username}</p>
                    </div>
                </div>
            </div>
            <button
                onClick={handleDone}
                className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 mt-6"
            >
                Done
            </button>
        </div>
        </div>

    );
};

export default Receipt;
