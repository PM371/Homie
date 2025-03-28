import React from 'react'
import { assets } from '../assets/assets'
import home_icon from "../assets/assets_admin/home_icon.svg";

const Contact = () => {
  return (
    <div className='py-10'>

        <div className='text-center text-2xl pt-10 text-black'>
          <p>CONTACT US</p>
        </div>

        <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>

            <img className='w-full md:max-w-[500px]' src={assets.ahome_icon} alt="" />

            <div className='flex flex-col justify-center items-start gap-6'>
              <p className='font-semibold text-lg text-black'>OUR OFFICE</p>
              <p className='text-base text-black'>50 Ngamwongwan Rd, Chatuchak <br/> Bangkok 10900 Thailand</p>
              <p className='text-base text-black'>Tel: 02-555-5555 <br/> Email: @homiegmail.com</p>
            </div>

        </div>
    </div>
  )
}

export default Contact
