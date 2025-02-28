import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BarberSalary = () => {
    const { barber_id } = useParams();
    const [earnings, setEarnings] = useState([]);
    const [name, setname] = useState();
    const token = localStorage.getItem('token'); // Get token from localStorage if available

    // Function to fetch appointment data
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch('http://localhost:8085/appointment', {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` }) // Include token if present
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched Data:', data);

                    // Filter appointments for the specific barber_id
                    const barberAppointments = data.filter(appointment => appointment.barber_id === barber_id);
                    if (barberAppointments.length > 0) {
                        setname(barberAppointments[0].barberName); // เอาค่าของ 'name' จากอ็อบเจ็กต์ตัวแรกในอาเรย์
                    }
                    const earningsByMonth = barberAppointments.reduce((acc, appointment) => {
                        if (appointment.status && appointment.status.trim().toLowerCase() === 'paid') {
                            const date = new Date(appointment.appointmentDate);
                            if (!isNaN(date)) {
                                const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
                                if (!acc[monthYear]) {
                                    acc[monthYear] = { barberEarnings: 0, shopEarnings: 0 };
                                }
                                const totalAmount = appointment.amount || appointment.price; // Use appointment amount or a default value
                                console.error(appointment.barber_id);
                                acc[monthYear].barberEarnings += totalAmount * 0.6; // Calculate 60% earnings
                                acc[monthYear].shopEarnings += totalAmount * 0.4;  // Calculate 40% earnings
                            } else {
                                console.error('Invalid date format:', appointment.appointmentDate);
                            }
                        }
                        return acc;
                    }, {});

                    const earningsArray = Object.entries(earningsByMonth).map(([month, totals]) => ({
                        month,
                        barberEarnings: totals.barberEarnings,
                        shopEarnings: totals.shopEarnings,
                    }));
                    setEarnings(earningsArray);
                } else {
                    console.error('Unexpected response:', response);
                    alert('Error fetching data. Please ensure you are logged in.');
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                alert('Error fetching data. Please check if you are signed in.');
            }
        };

        fetchAppointments();
    }, [barber_id, token]);

    return (
        <div className="p-5 bg-gray-100 min-h-screen flex flex-col items-center w-full">
            <h2 className="text-gray-700 text-2xl font-semibold mb-6">Earnings for Barber</h2>
            <p className="text-gray-700 text-4 font-semibold mb-6 mr-[90%]">{name}</p>
            <div className="overflow-x-auto w-full max-w-screen-xl">
                <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                    <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        <th className="border px-6 py-3">Month-Year</th>
                        <th className="border px-6 py-3">Barber's Earnings (฿)</th>
                        <th className="border px-6 py-3">Shop's Earnings (฿)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {earnings.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="text-center py-8 text-gray-500">No data available</td>
                        </tr>
                    ) : (
                        earnings.map(({ month, barberEarnings, shopEarnings }, index) => (
                            <tr key={index} className="hover:bg-gray-100 transition-colors">
                                <td className="border px-6 py-4 text-center">{month}</td>
                                <td className="border px-6 py-4 text-center">{barberEarnings.toLocaleString()}</td>
                                <td className="border px-6 py-4 text-center">{shopEarnings.toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BarberSalary;
