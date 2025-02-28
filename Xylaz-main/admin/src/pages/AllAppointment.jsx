import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:8085/appointment');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    return (
        <div className="w-full max-w-6xl m-5">
            <p className="mb-3 text-lg font-medium">All Appointments</p>

            <div className="bg-white border rounded text-sm font-semibold max-h-[80vh] overflow-y-auto">
                <div className="hidden sm:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
                    <p>ID</p>
                    <p>Appointment Date</p>
                    <p>Service Type</p>
                    <p>Status</p>
                    <p>Barber Name</p>
                    <p>Member Name</p>
                </div>
                {appointments.length > 0 ? (
                    appointments.map((item, index) => (
                        <div
                            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
                            key={index}
                        >
                            <p>{item.id || 'N/A'}</p>
                            <p>{item.appointment_date || 'N/A'}</p>
                            <p>{item.service_type || 'N/A'}</p>
                            <p>{item.status || 'N/A'}</p>
                            <p>{item.barberName || 'N/A'}</p>
                            <p>{item.username || 'N/A'}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center py-5">No appointments available.</p>
                )}
            </div>
        </div>
    );
};

export default AllAppointments;
