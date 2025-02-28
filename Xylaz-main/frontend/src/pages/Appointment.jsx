import React, { useContext, useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/NavbarSub';
import { assets } from '../assets/assets';
import axios from 'axios';
import * as response from "autoprefixer";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [barbers, setBarbers] = useState({});
  const [appointment, setAppointment] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [bookedAppointments, setBookedAppointments]=useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [price, setPrice] = useState("Please select an offer");
  const [selectedOffer, setSelectedOffer] = useState(null);


  useEffect(() => {
    window.scrollTo(0, 0);
    fetch('http://localhost:8085/')
        .then(response => response.json())
        .then(data => {
          setBarbers(data);
        })
        .catch(error => console.error('Error fetching barbers:', error));
  }, []);
  useEffect(() => {
    fetch('http://localhost:8085/appointment')
        .then(response => response.json())
        .then(data => {
          const appointments = data.map(appointment => ({
            date: appointment.appointmentDate, // วันที่
            time: appointment.appointmentTime, // เวลา
            barber:appointment.barberId
          }));
          setBookedAppointments(appointments);
        })
        .catch(error => console.error('Error fetching appointment:', error));
  }, []);


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const lastUser = localStorage.getItem('lastUser');

    if (storedToken) {
      setToken(storedToken);
      setUser(lastUser);
    }
  }, []);
  useEffect(() => {
    fetchDocInfo();
  }, [barbers, docId]);
  useEffect(() => {
    fetchAppointmentInfo();
  }, [bookedAppointments]);
  useEffect(() => {
    updateSlotStatus(appointment);
  }, [appointment]);
  useEffect(() => {
    if (barbers) getAvailableSlots();
  }, [barbers]);

  const fetchDocInfo = async () => {
    const barberInfo = barbers.find(barber => barber.barber_id === docId);

    setBarbers(barberInfo);
  };
  const fetchAppointmentInfo = async () => {
    const appointmentInfo = bookedAppointments
        .filter(bookedAppointment => bookedAppointment.barber === docId)
        .map(({ date, time }) => ({ date, time }));
    setAppointment(appointmentInfo);

  };

  const handleSelectService = (service, servicePrice) => {
    setSelectedService(service);
    setPrice(servicePrice);
    setSelectedOffer(service);
  };



  const bookAppointment = async () => {
    if (!slotTime) {
      alert("Please choose an appointment time!");
      return;
    }if (!selectedOffer) {
      alert("Please choose an offer!");
      return;
    }

    const selectedDate = new Date(docSlots[slotIndex][0].dateTime);
    const [hour, minute] = slotTime.split(':');

    selectedDate.setHours(parseInt(hour), parseInt(minute));

    const appointmentDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')} ${String(selectedDate.getHours()).padStart(2, '0')}:${String(selectedDate.getMinutes()).padStart(2, '0')}`;

    const requestBody = {
      username: user,
      barberId: docId.toString(),
      appointmentDate: appointmentDate,
      serviceType: selectedOffer,
      price: +price
    };

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(`http://localhost:8085/appointment/${docId}`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200 || response.status === 201) {
        alert("Appointment booked successfully!"+appointmentDate);
        const newAppointment = { date: selectedDate.toISOString().split('T')[0], time: `${String(selectedDate.getHours()).padStart(2, '0')}:${String(selectedDate.getMinutes()).padStart(2, '0')}`, barber: docId };
        updateSlotStatus([newAppointment]);
      } else {
        alert("Unable to book an appointment");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Rebookings are available at this date and time for the selected technician.");
      } else {
        alert("An error occurred during appointment booking.");
      }
    }
  };

  const getAvailableSlots = async () => {
    const slots = [];
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const isBooked = bookedAppointments.some(
            appointment =>
                appointment.date === currentDate.toISOString().split('T')[0] &&
                appointment.time === formattedTime
        );

        timeSlots.push({
          dateTime: new Date(currentDate),
          time: formattedTime,
          isBooked: isBooked
        });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      slots.push(timeSlots);
    }

    setDocSlots(slots);
  };

  const updateSlotStatus = (appointments) => {
    setDocSlots(prevSlots => {
      const updatedSlots = [...prevSlots];

      appointments.forEach(appointment => {
        const dayIndex = updatedSlots.findIndex(daySlots =>
            daySlots.some(slot =>
                slot.dateTime.toISOString().split('T')[0] === appointment.date
            )
        );

        if (dayIndex !== -1) {
          updatedSlots[dayIndex] = updatedSlots[dayIndex].map(slot => {
            if (slot.time === appointment.time) {
              return { ...slot, isBooked: true };
            }
            return slot;
          });
        }
      });

      return updatedSlots;
    });
  };


  return barbers && (
      <div className='md:mx-10 '>
        <Navbar />
        <div className='flex flex-col sm:flex-row gap-4'>
          <div>
            <img className='w-60 h-60 object-cover bg-blue-50 rounded-lg'
                 src={`http://localhost:8085/picture/${barbers.profilePicture}`} alt="" />
          </div>
          <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-0px] sm:mx-0'>
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
              {barbers.name}
              <img className='w-5' src={assets.verified_icon} alt="" />
            </p>
            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>{barbers.gender}</p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>{barbers.experience+" years"}</button>
            </div>
            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{barbers.about}</p>
            </div>
            <p className='text-gray-500 font-medium mt-4'>
              Price: <span className='text-gray-600'>{price} baht</span>{/*docInfo.fees*/}
            </p>
          </div>
        </div>
        {/*-------offfer Slots-------*/}
        <div className=' mt-[4%]  sm:pl-4 font-medium text-gray-700'>
          <p>Special offers</p>
          <div
              className={`bg-white border border-gray-300 p-4 rounded-lg shadow-md w-60 text-center cursor-pointer hover:bg-gray-100 mt-4 ${selectedOffer === "Regular Haircut" ? 'bg-gray-200' : ''}`}
              onClick={() => handleSelectService('Regular Haircut', '300')}
          >
            <p className="text-xl font-semibold text-gray-700">Regular Haircut</p>
          </div>
          <div
              className={`bg-white border border-gray-300 p-4 rounded-lg shadow-md w-60 text-center cursor-pointer hover:bg-gray-100 mt-3 ${selectedOffer === "Haircut + Beard" ? 'bg-gray-200' : ''}`}
              onClick={() => handleSelectService('Haircut + Beard', '350')}
          >
            <p className="text-xl font-semibold text-gray-700">Haircut + Beard</p>
          </div>
          <div
              className={`bg-white border border-gray-300 p-4 rounded-lg shadow-md w-60 text-center cursor-pointer hover:bg-gray-100 mt-3 ${selectedOffer === "Haircut + Shampoo" ? 'bg-gray-200' : ''}`}
              onClick={() => handleSelectService('Haircut + Shampoo', '400')}
          >
            <p className="text-xl font-semibold text-gray-700">Haircut + Shampoo</p>
          </div>
          <div
              className={`bg-white border border-gray-300 p-4 rounded-lg shadow-md w-60 text-center cursor-pointer hover:bg-gray-100 mt-3 ${selectedOffer === "All" ? 'bg-gray-200' : ''}`}
              onClick={() => handleSelectService('All', '450')}
          >
            <p className="text-xl font-semibold text-gray-700">All</p>
          </div>
        </div>

        {/*-------Booking Slots-------*/}
        <div className="ml-[25%] mt-[-24%] mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {docSlots.length > 0 && docSlots.map((item, index) => (
                <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                  <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                  <p>{item[0] && item[0].dateTime.getDate()}</p>
                </div>
            ))}
          </div>

          <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
            {docSlots.length > 0 && docSlots[slotIndex]?.map((item, index) => (
                <p
                    onClick={() => !item.isBooked && setSlotTime(item.time)}
                    className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer 
        ${item.isBooked ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
                        item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}
                    key={index}
                >
                  {item.time.toLowerCase()}
                </p>
            ))}
          </div>
          <button className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6' onClick={bookAppointment}>
            Book an Appointment
          </button>

        </div>
        {/*-------Listing Barbers-------*/}
      </div>
  );
};

export default Appointment;
