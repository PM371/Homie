import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets.js';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AdminContext } from '../context/AdminContext.jsx';
import { AppContext } from '../context/AppContext.jsx';

const AddBarber = () => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [experience, setExperience] = useState('1');
    const [gender, setGender] = useState('Male');
    const [about, setAbout] = useState('');

    const { backendUrl } = useContext(AppContext);
    const { aToken } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!profilePicture) {
            return toast.error('Profile picture is not selected');
        }

        const formData = new FormData();
        formData.append('profilePicture', profilePicture);
        formData.append('name', name);
        formData.append('specialty', specialty);
        formData.append('experience', Number(experience));
        formData.append('gender', gender);
        formData.append('about', about);

        try {
            // เพิ่มคำขอไปยัง backend ด้วยข้อมูลของช่างตัดผม (barber)
            const token = localStorage.getItem('token'); // Assuming you store the token in localStorage

            const response = await axios.post('http://localhost:8085/addBarber', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200 || response.status === 201) {
                toast.success('Barber added successfully!');
                // Reset form fields
                setProfilePicture(null);
                setName('');
                setSpecialty('');
                setExperience('1');
                setGender('Male');
                setAbout('');
            } else {
                toast.error(response.data?.message || 'Failed to add barber');
            }
        } catch (error) {
            console.error('Error adding barber:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                toast.error(error.response.data?.message || 'An error occurred while adding barber');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Barber</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[90vh]'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="profile-picture">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={profilePicture ? URL.createObjectURL(profilePicture) : assets.upload_area} alt="Profile" />
                    </label>
                    <input onChange={(e) => setProfilePicture(e.target.files[0])} type="file" id="profile-picture" hidden />
                    <p>Upload barber <br /> picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Your name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Specialty</p>
                            <input onChange={e => setSpecialty(e.target.value)} value={specialty} className='border rounded px-3 py-2' type="text" placeholder='Specialty' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Experience (in years)</p>
                            <input onChange={e => setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2' type="number" placeholder='Experience' required />
                        </div>
                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Gender</p>
                            <select onChange={e => setGender(e.target.value)} value={gender} className='border rounded px-2 py-2'>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <p className='mt-4 mb-2'>About Barber</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' rows={5} placeholder='Write about barber'></textarea>
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add Barber</button>
            </div>
        </form>
    );
};

export default AddBarber;
