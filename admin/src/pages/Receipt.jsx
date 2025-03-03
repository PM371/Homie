import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';

const Receipt = () => {
    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        fetch('/api/payments')  // Adjust the URL as needed based on your backend setup
            .then(response => response.json())
            .then(data => setReceipts(data))
            .catch(error => console.error('Error fetching payments:', error));
    }, []);

    return (
        <div className='w-full max-w-6xl m-5'>
            <p className='mb-3 text-lg font-medium'>All Receipts</p>
            <div className='bg-white border rounded text-sm font-semibold max-h-[80vh]'>
                <div className='hidden sm:grid grid-cols-[3fr_3fr_3fr_3fr_2fr] grid-flow-col py-3 px-6 border-b'>
                    <p>ReceiptID</p>
                    <p>AppointmentID</p>
                    <p>PaymentMethod</p>
                    <p>TotalAmount</p>
                    <p>IssueDate</p>
                </div>

                {receipts.map((receipt) => (
                    <div key={receipt.id} className='grid grid-cols-[3fr_3fr_3fr_3fr_2fr] grid-flow-col py-3 px-6 border-b'>
                        <p>{receipt.id}</p>
                        <p>{receipt.appointment ? receipt.appointment.id : 'N/A'}</p>
                        <p>{receipt.paymentMethod}</p>
                        <p>{receipt.amount}</p>
                        <p>{new Date(receipt.paymentDate).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Receipt;
