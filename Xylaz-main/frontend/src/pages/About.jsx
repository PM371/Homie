import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='md:mx-10 my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[600px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome to Xylaz, your trusted partner in managing your grooming needs conveniently and efficiently. At Xylaz, we understand the challenges individuals face when it comes to maintaining their personal style.</p>
          <p>Xylaz is committed to excellence in grooming services and technology. We continuously strive to enhance our platform, integrating the latest advancements to improve your experience and deliver top-notch service. Whether you're booking your first haircut or keeping up with your regular grooming routine, Xylaz is here to support you every step of the way.</p>
          <p className='text-gray-800'>Our Vision</p>
          <p>At Xylaz, our vision is to create a seamless grooming experience for every customer. We aim to bridge the gap between clients and professional barbers, making it easier for you to access the style and care you need, when you need it.</p>
        </div>
      </div>

      <div className='md:mx-10 text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EFFICIENCY :</b>
          <p>Streamlined appointment scheduling that fits seamlessly into your busy lifestyle.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>CONVENIENCE :</b>
        <p>Access to a network of trusted barbers and grooming professionals in your area.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
        <b>PERSONALIZATION :</b>
        <p>Tailored style recommendations and reminders to help you maintain your best look.</p>
        </div>
      </div>
      
    </div>
  )
}

export default About
