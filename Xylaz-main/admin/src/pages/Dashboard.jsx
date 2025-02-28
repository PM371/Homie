import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [monthlyEarnings, setMonthlyEarnings] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8085/appointment')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched Data:', data);

                const earningsByMonth = data.reduce((acc, appointment) => {
                    if (appointment.status && appointment.status.trim().toLowerCase() === 'paid') {
                        const date = new Date(appointment.appointmentDate);
                        if (!isNaN(date)) {
                            const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
                            if (!acc[monthYear]) {
                                acc[monthYear] = 0;
                            }
                            acc[monthYear] += 200;
                        } else {
                            console.error('Invalid date format:', appointment.appointmentDate);
                        }
                    }
                    return acc;
                }, {});

                const earningsArray = Object.entries(earningsByMonth).map(([month, total]) => ({ month, total }));
                setMonthlyEarnings(earningsArray);
            })
            .catch(error => console.error('Error fetching appointments:', error));
    }, []);

    return (
        <div className="p-5 bg-gray-100 min-h-screen flex flex-col items-center w-full">
            <h2 className="text-gray-700 text-2xl font-semibold mb-6">Monthly Total Earnings</h2>
            <div className="overflow-x-auto w-full max-w-screen-xl">
                <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                    <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        <th className="border px-6 py-3">Month-Year</th>
                        <th className="border px-6 py-3">Total Earnings (฿)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {monthlyEarnings.length === 0 ? (
                        <tr>
                            <td colSpan="2" className="text-center py-8 text-gray-500">No data available</td>
                        </tr>
                    ) : (
                        monthlyEarnings.map(({ month, total }, index) => (
                            <tr key={index} className="hover:bg-gray-100 transition-colors">
                                <td className="border px-6 py-4 text-center">{month}</td>
                                <td className="border px-6 py-4 text-center">{total.toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
