import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/NavbarSub';
import { assets } from '../assets/assets';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [price, setPrice] = useState("Please select an offer");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const navigate = useNavigate();

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
  const [showPrices, setShowPrices] = useState(false);
  const [isAvailabilityChecked, setIsAvailabilityChecked] = useState(false);
  const [isBooking, setIsBooking] = useState(false);


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
          barber: appointment.barberId
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

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diffTime = Math.abs(checkOutDate - checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
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
    if (!checkInDate || !checkOutDate) {
      alert("กรุณาเลือกวันที่ Check-in และ Check-out ให้ครบถ้วน");
      return;
    }

    // คำนวณจำนวนคืน
    const calculateNights = () => {
      const diffTime = Math.abs(checkOutDate - checkInDate);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const nights = calculateNights();
    const basePrice = barbers.experience * nights;
    const serviceFee = basePrice * 0.1;
    const totalPrice = basePrice + serviceFee;

    const requestBody = {
      username: user,
      barberId: docId.toString(),
      appointmentDate: checkInDate.toISOString().split('T')[0]+" • "+checkOutDate.toISOString().split('T')[0],
      serviceType: nights,
      price: totalPrice
    };

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
          `http://localhost:8085/appointment/${barbers.barber_id}`,
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
      );

      if (response.status === 200 || response.status === 201) {
        alert(`การจองสำเร็จ!\nCheck-in: ${checkInDate.toLocaleDateString()}\nCheck-out: ${checkOutDate.toLocaleDateString()}\nรวมทั้งหมด: ฿${totalPrice.toFixed(2)}`);
        // อัพเดตสถานะการจอง (ถ้ามี)
        // updateBookingStatus(...);
      } else {
        alert("ไม่สามารถทำการจองได้");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("มีการจองในช่วงวันที่นี้แล้ว");
      } else {
        console.error("Booking error:", error);
        alert("เกิดข้อผิดพลาดในการจอง");
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
      endTime.setHours(19, 0, 0, 0);

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

        currentDate.setMinutes(currentDate.getMinutes() + 60);
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
      <hr />
      <div className='max-w-xs sm:max-w-md md:max-w-[85%] p-8 py-7 mx-auto mt-[-0px]'>
        <p className='flex items-center gap-2 text-2xl font-medium text-black'>
        {barbers.about}
      </p>
      </div>
      <div className='flex flex-col sm:flex-row gap-4 justify-center items-center  px-2 pr-[7%]'>
        <div className="flex flex-col sm:flex-row gap-4 items-center max-w-5xl w-full px-4"> {/* เพิ่ม flex, flex-row และ gap */}
          <img
              className='h-[400px] w-[55%] object-cover bg-blue-50 rounded-lg pr-[-5%]'
              src={`http://localhost:8085/picture/${barbers.profilePicture}`}
              alt="Profile"
          />
          <img
              className='h-[400px] md:max-w-[650px]'
              src={assets.more_pic}
              alt="About"
          />
        </div>
      </div>
      <div className='max-w-xs sm:max-w-md md:max-w-[85%] rounded-lg p-8 py-7 mx-auto mt-[-0px]'>
        <p className='flex items-center gap-2 text-2xl font-medium text-black'>
          {barbers.name}, {barbers.specialty}
          <img className='w-5' src={assets.verified_icon} alt="" />
        </p>
        <p className='text-black font-small mt-2 text-lg'>
          {barbers.gender}
        </p>
      </div>
      <hr className="p-8 py-7 mx-[10%] w-[70]  " /> {/* เพิ่มระยะห่าง 1rem (16px) ด้านล่าง */}
      <h className='pl-[11%] text-xl font-medium ' >
        What this place offers
      </h>
      {/*border border-red-300*/}
      <div className='sm:w-[1200px] sm:h-[300px] flex flex-1 sm:flex-row '>
      <div className='sm:w-[300px] sm:h-[50px] rounded-lg  pr-[60%] pl-[10%] mt-[2%]'>
      <div className="sm:w-[1200px] sm:h-[50px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pt-[0px]">
        {/* Kitchen */}
        <div className=" flex items-center gap-3 p-3  rounded-lg ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6">
            <path d="M26 1a5 5 0 0 1 5 5c0 6.39-1.6 13.19-4 14.7V31h-2V20.7c-2.36-1.48-3.94-8.07-4-14.36v-.56A5 5 0 0 1 26 1zm-9 0v18.12c2.32.55 4 3 4 5.88 0 3.27-2.18 6-5 6s-5-2.73-5-6c0-2.87 1.68-5.33 4-5.88V1zM2 1h1c4.47 0 6.93 6.37 7 18.5V21H4v10H2zm14 20c-1.6 0-3 1.75-3 4s1.4 4 3 4 3-1.75 3-4-1.4-4-3-4zM4 3.24V19h4l-.02-.96-.03-.95C7.67-9.16 6.24 4.62 4.22 3.36L4.1 3.3zm19 2.58v.49c.05 4.32 1.03 9.13 2 11.39V3.17a3 3 0 0 0-2 2.65zm4-2.65V17.7c.99-2.31 2-7.3 2-11.7a3 3 0 0 0-2-2.83z"></path>
          </svg>
          <span>Kitchen</span>
        </div>

        {/* Wifi */}
        <div className="flex items-center gap-3 p-3 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6">
            <path d="M16 20.33a3.67 3.67 0 1 1 0 7.34 3.67 3.67 0 0 1 0-7.34zm0 2a1.67 1.67 0 1 0 0 3.34 1.67 1.67 0 0 0 0-3.34zM16 15a9 9 0 0 1 8.04 4.96l-1.51 1.51a7 7 0 0 0-13.06 0l-1.51-1.51A9 9 0 0 1 16 15zm0-5.33c4.98 0 9.37 2.54 11.94 6.4l-1.45 1.44a12.33 12.33 0 0 0-20.98 0l-1.45-1.45A14.32 14.32 0 0 1 16 9.66zm0-5.34c6.45 0 12.18 3.1 15.76 7.9l-1.43 1.44a17.64 17.64 0 0 0-28.66 0L.24 12.24c3.58-4.8 9.3-7.9 15.76-7.9z"></path>
          </svg>
          <span>Wifi</span>
        </div>

      </div>
        <div className="sm:w-[1200px] sm:h-[50px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pt-[0px]">
          {/* Dedicated workspace */}
          <div className="flex items-center gap-3 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6">
              <path d="M26 2a1 1 0 0 1 .92.61l.04.12 2 7a1 1 0 0 1-.85 1.26L28 11h-3v5h6v2h-2v13h-2v-2.54a3.98 3.98 0 0 1-1.73.53L25 29H7a3.98 3.98 0 0 1-2-.54V31H3V18H1v-2h5v-4a1 1 0 0 1 .88-1h.36L6.09 8.4l1.82-.8L9.43 11H12a1 1 0 0 1 1 .88V16h10v-5h-3a1 1 0 0 1-.99-1.16l.03-.11 2-7a1 1 0 0 1 .84-.72L22 2h4zm1 16H5v7a2 2 0 0 0 1.7 1.98l.15.01L7 27h18a2 2 0 0 0 2-1.85V18zm-16-5H8v3h3v-3zm14.24-9h-2.49l-1.43 5h5.35l-1.43-5z"></path>
            </svg>
            <span>Dedicated workspace</span>
          </div>

          {/* Free parking */}
          <div className="flex items-center gap-3 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6">
              <path d="M26 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 18a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm20.7-5 .41 1.12A4.97 4.97 0 0 1 30 18v9a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2H8v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9c0-1.57.75-2.96 1.89-3.88L4.3 13H2v-2h3v.15L6.82 6.3A2 2 0 0 1 8.69 5h14.62c.83 0 1.58.52 1.87 1.3L27 11.15V11h3v2h-2.3zM6 25H4v2h2v-2zm22 0h-2v2h2v-2zm0-2v-5a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v5h24zm-3-10h.56L23.3 7H8.69l-2.25 6H25zm-15 7h12v-2H10v2z"></path>
            </svg>
            <span>Free parking on premises</span>
          </div>
        </div>

        <div className='sm:w-[1200px] sm:h-[50px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pt-[0px]'>
          {/* Washer */}
          <div className="flex items-center gap-3 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6">
              <path d="M26.29 2a3 3 0 0 1 2.96 2.58c.5 3.56.75 7.37.75 11.42s-.25 7.86-.75 11.42a3 3 0 0 1-2.79 2.57l-.17.01H5.7a3 3 0 0 1-2.96-2.58C2.25 23.86 2 20.05 2 16s.25-7.86.75-11.42a3 3 0 0 1 2.79-2.57L5.7 2zm0 2H5.72a1 1 0 0 0-1 .86A80.6 80.6 0 0 0 4 16c0 3.96.24 7.67.73 11.14a1 1 0 0 0 .87.85l.11.01h20.57a1 1 0 0 0 1-.86c.48-3.47.72-7.18.72-11.14 0-3.96-.24-7.67-.73-11.14A1 1 0 0 0 26.3 4zM16 7a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm-5.84 7.5c-.34 0-.68.02-1.02.07a7 7 0 0 0 13.1 4.58 9.09 9.09 0 0 1-6.9-2.37l-.23-.23a6.97 6.97 0 0 0-4.95-2.05zM16 9a7 7 0 0 0-6.07 3.5h.23c2.26 0 4.44.84 6.12 2.4l.24.24a6.98 6.98 0 0 0 6.4 1.9A7 7 0 0 0 16 9zM7 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
            </svg>
            <span>Washer</span>
          </div>

          {/* Dryer */}
          <div className="flex items-center gap-3 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6">
              <path d="M26.29 2a3 3 0 0 1 2.96 2.58c.5 3.56.75 7.37.75 11.42s-.25 7.86-.75 11.42a3 3 0 0 1-2.79 2.57l-.17.01H5.7a3 3 0 0 1-2.96-2.58C2.25 23.86 2 20.05 2 16s.25-7.86.75-11.42a3 3 0 0 1 2.79-2.57L5.7 2zm0 2H5.72a1 1 0 0 0-1 .86A80.6 80.6 0 0 0 4 16c0 3.96.24 7.67.73 11.14a1 1 0 0 0 .87.85l.11.01h20.57a1 1 0 0 0 1-.86c.48-3.47.72-7.18.72-11.14 0-3.96-.24-7.67-.73-11.14a1 1 0 0 0-.87-.85zM16 7a9 9 0 1 1 0 18 9 9 0 0 1 0-18zm0 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm-4.8 5.58c1.36.2 2.64.8 3.68 1.75l.46.45a8.97 8.97 0 0 0 4.62 2.28 5.02 5.02 0 0 1-2.01 1.55 10.98 10.98 0 0 1-4.26-2.65 4.96 4.96 0 0 0-2.66-1.38 4.68 4.68 0 0 1 .17-2zm3.09-3.28c1.34.55 2.58 1.36 3.64 2.42a4.97 4.97 0 0 0 3 1.44 4.99 4.99 0 0 1-.07 2 6.97 6.97 0 0 1-4.11-1.8l-.47-.45a8.96 8.96 0 0 0-4.07-2.17 5 5 0 0 1 2.08-1.44zM7 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
            </svg>
            <span>Dryer</span>
          </div>
        </div>

          <div className='sm:w-[1200px] sm:h-[50px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pt-[0px]'>
          {/* Air conditioning */}
          <div className="flex items-center gap-3 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6">
              <path d="M17 1v4.03l4.03-2.32 1 1.73L17 7.34v6.93l6-3.47V5h2v4.65l3.49-2.02 1 1.74L26 11.38l4.03 2.33-1 1.73-5.03-2.9L18 16l6 3.46 5.03-2.9 1 1.73L26 20.62l3.49 2.01-1 1.74L25 22.35V27h-2v-5.8l-6-3.47v6.93l5.03 2.9-1 1.73L17 26.97V31h-2v-4.03l-4.03 2.32-1-1.73 5.03-2.9v-6.93L9 21.2V27H7v-4.65l-3.49 2.02-1-1.74L6 20.62l-4.03-2.33 1-1.73L8 19.46 14 16l-6-3.46-5.03 2.9-1-1.73L6 11.38 2.51 9.37l1-1.74L7 9.65V5h2v5.8l6 3.47V7.34l-5.03-2.9 1-1.73L15 5.03V1z"></path>
            </svg>
            <span>Air conditioning</span>
          </div>

          {/* Bathtub */}
          <div className="flex items-center gap-3 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6">
              <path d="M7.5 2a4.5 4.5 0 0 1 4.47 4H14v2H8V6h1.95A2.5 2.5 0 0 0 5 6.34V16h26v2h-2v5a5 5 0 0 1-3 4.58V30h-2v-2H8v2H6v-2.42a5 5 0 0 1-3-4.34V18H1v-2h2V6.5A4.5 4.5 0 0 1 7.5 2zM27 18H5v5a3 3 0 0 0 2.65 2.98l.17.01L8 26h16a3 3 0 0 0 3-2.82V23z"></path>
            </svg>
            <span>Bathtub</span>
          </div>
          </div>

        <div className='sm:w-[1200px] sm:h-[50px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pt-[0px]'>
          {/* Security camera */}
          <div className="flex items-center gap-3 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6">
              <path d="M23 3a2 2 0 0 1 2 1.85v1.67l5-2v11.96l-5-2V16a2 2 0 0 1-1.85 2H16.9a5 5 0 0 1-3.98 3.92A5 5 0 0 1 8.22 26H4v4H2V20h2v4h4a3 3 0 0 0 2.87-2.13A5 5 0 0 1 7.1 18H4a2 2 0 0 1-2-1.85V5a2 2 0 0 1 1.85-2H4zM12 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm11-9H4v11h3.1a5 5 0 0 1 9.8 0H23zm5 2.48-3 1.2v3.64l3 1.2zM7 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
            </svg>
            <span>Exterior security camera</span>
          </div>

          {/* Unavailable amenity */}
          <div className="flex items-center gap-3 p-3 rounded-lg opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6">
              <path d="M2.05 6.3 4 8.23V25a3 3 0 0 0 2.82 3h16.94l1.95 1.95c-.16.02-.33.04-.5.04L25 30H7a5 5 0 0 1-5-4.78V7c0-.24.02-.48.05-.7zm1.66-4 26 26-1.42 1.4-26-26 1.42-1.4zM25 2a5 5 0 0 1 5 4.78V25a5 5 0 0 1-.05.7L28 23.77V7a3 3 0 0 0-2.82-3H8.24L6.3 2.05c.16-.02.33-.04.5-.04L7 2h18zM11.1 17a5 5 0 0 0 3.9 3.9v2.03A7 7 0 0 1 9.07 17h2.03zm5.9 4.24 1.35 1.36a6.95 6.95 0 0 1-1.35.33v-1.69zM21.24 17h1.69c-.07.47-.18.92-.34 1.35L21.24 17zM17 9.07A7 7 0 0 1 22.93 15H20.9a5 5 0 0 0-3.9-3.9V9.07zm-7.6 4.58L10.76 15H9.07c.07-.47.18-.92.33-1.35zM15 9.07v1.69L13.65 9.4A6.95 6.95 0 0 1 15 9.07zM23 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
            </svg>
            <span className="line-through">Carbon monoxide alarm</span>
          </div>
        </div>
        </div>
        {/*Add dates for prices*/}
        <div className="w-full rounded-lg border border-black p-4 px-7 py-3 min-h-fit">
          <h5 className='pl-[1%] text-xl font-medium'>Add dates for prices</h5>

          <div className="flex">
            {/* ปุ่ม CHECK-IN */}
            <div className="relative flex-1">
              <button
                  className='h-20 text-black text-m font-small px-8 py-3 rounded-l-[5px] my-6 border-[.1px] border-black w-full text-left'
                  onClick={() => {
                    setShowCheckInCalendar(!showCheckInCalendar);
                    setShowCheckOutCalendar(false);
                  }}
              >
                CHECK-IN <br/>{checkInDate ? checkInDate.toLocaleDateString() : 'Select date'}
              </button>
              {showCheckInCalendar && (
                  <div className="absolute z-10 mt-1">
                    <DatePicker
                        selected={checkInDate}
                        onChange={(date) => {
                          setCheckInDate(date);
                          setShowCheckInCalendar(false);
                        }}
                        inline
                        minDate={new Date()}
                    />
                  </div>
              )}
            </div>

            {/* ปุ่ม CHECKOUT */}
            <div className="relative flex-1">
              <button
                  className='h-20 text-black text-m font-small px-8 py-3 rounded-r-[5px] my-6 border-[.1px] border-black w-full text-left'
                  onClick={() => {
                    if (!checkInDate) {
                      alert('กรุณาเลือกวันที่ CHECK-IN ก่อน');
                      return;
                    }
                    setShowCheckOutCalendar(!showCheckOutCalendar);
                    setShowCheckInCalendar(false);
                  }}
              >
                CHECKOUT <br/>{checkOutDate ? checkOutDate.toLocaleDateString() : 'Select date'}
              </button>
              {showCheckOutCalendar && (
                  <div className="absolute z-10 mt-1">
                    <DatePicker
                        selected={checkOutDate}
                        onChange={(date) => {
                          setCheckOutDate(date);
                          setShowCheckOutCalendar(false);
                        }}
                        inline
                        minDate={checkInDate || new Date()}
                    />
                  </div>
              )}
            </div>
          </div>

          {/* ปุ่ม Check Availability */}
          <button
              className={`font-bold px-7 py-3 rounded-[10px] w-full my-4 ${
                  isAvailabilityChecked
                      ? 'border border-black hover:bg-gray-300 text-black' // สีเมื่อกดแล้ว
                      : 'bg-blue-400 hover:bg-blue-500 text-white'   // สีปกติ
              } transition-colors duration-200`}
              onClick={() => {
                setShowPrices(true);
                setIsAvailabilityChecked(true);
              }}
              disabled={!checkInDate || !checkOutDate}
          >
            {isAvailabilityChecked ? 'Available!' : 'Check Availability'}
          </button>
          {/* ส่วนแสดงราคาที่จะโชว์เมื่อกด Check Availability */}
          {showPrices && (
              <>
                <div className='flex justify-between items-center'>
                  <span>฿ {barbers.experience} x {calculateNights()} nights</span>
                  <span className="text-right">฿ {barbers.experience * calculateNights()}</span>
                </div>
                <div className='flex justify-between items-center mt-2'>
                  <span>Service fee</span>
                  <span className="text-right">฿ {(barbers.experience * calculateNights() * 0.1).toFixed(2)}</span>
                </div>
                <hr className='mt-4'/>
                <div className='flex justify-between items-center text-xl py-3'>
                  <span>Total</span>
                  <span className="text-right">฿ {(barbers.experience * calculateNights() * 1.1).toFixed(2)}</span>
                </div>

                {/* ปุ่ม Book Now ที่แท้จริง */}
                <button
                    className={`bg-[#528EFF] text-white text-m font-bold px-7 py-3 rounded-[10px] w-full my-4 ${
                        isBooking ? 'opacity-50 cursor-not-allowed' : ''
                    } transition-opacity`}
                    onClick={() => {
                      setIsBooking(true);
                      bookAppointment();
                    }}
                    disabled={isBooking || !checkInDate || !checkOutDate}

                >
                  {isBooking ? 'Thank you!' : 'Book Now'}
                </button>
              </>
          )}
        </div>
      </div>
      <br/><br/><br/><br/>
    </div>

  );
};

export default Appointment;
