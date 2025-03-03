import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className='py-10'>

        <div className='text-center text-2xl pt-10 text-white'>
          <p>CONTACT US</p>
        </div>

        <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>

            <img className='w-full md:max-w-[500px]' src={assets.contact_image} alt="" />

            <div className='flex flex-col justify-center items-start gap-6'>
              <p className='font-semibold text-lg text-white'>OUR OFFICE</p>
              <p className='text-base text-white'>50 Ngamwongwan Rd, Chatuchak <br/> Bangkok 10900 Thailand</p>
              <p className='text-base text-white'>Tel: 02-555-5555 <br/> Email: @homiegmail.com</p>
            </div>

        </div>
    </div>
  )
}

export default Contact
