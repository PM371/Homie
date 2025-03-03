import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Barbers = () => {
  const [barbers, setBarbers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // เรียกใช้ API เพื่อดึงข้อมูลบาร์เบอร์
    fetch('http://localhost:8085/')
        .then(response => response.json())
        .then(data => {
          setBarbers(data);
        })
        .catch(error => console.error('Error fetching barbers:', error));
  }, []);
  return (
      <div className="p-5">
        <p className="text-gray-600">Browse through the expert barbers.</p>

        <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-5 gap-y-6">
            {
              barbers.map((barber, index) => (
                  <div
                      onClick={() => navigate(`/appointment/${barber.barber_id}`)}
                      className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
                      key={index}
                  >
                    <img className="w-full h-60 object-cover bg-blue-50"
                         src={`http://localhost:8085/picture/${barber.profilePicture}`} alt={barber.profilePicture} />
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-sm text-center text-green-500">
                        <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                        <p>Available</p>
                      </div>
                      <p className="text-gray-900 text-lg font-medium">{barber.name}</p>
                      <p className="text-gray-600 text-sm">{barber.gender}</p>
                    </div>
                  </div>
              ))
            }
          </div>
        </div>
      </div>
  );
};

export default Barbers;