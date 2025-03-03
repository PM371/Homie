import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

                {/*-------Left Section-------*/}
                <div>
                    <p className='mb-4 w-40 text-3xl font-medium text-[#000b6d]'>Xylaz :)</p>
                    <p>At Xylaz, our vision is to create a seamless grooming experience for every customer. We aim to bridge the gap between clients and professional barbers, making it easier for you to access the style and care you need, when you need it.</p>
                </div>
                {/*-------center Section-------*/}
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                {/*-------Right Section-------*/}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>02-555-5555</li>
                        <li>xylaz@gmail.com</li>
                    </ul>
                </div>
            </div>
            <div>
                {/*-------Copyright text-------*/}
                <hr />
                <p className='py-5 text-sm text-center'>Copyright © 2024 Xylaz - All Right Reserved.</p>
            </div>
        </div>
    )
}

export default Footer