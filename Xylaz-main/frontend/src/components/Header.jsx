import React, {useRef} from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    const barbersRef = useRef(null);
    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            behavior: 'smooth'
        });
    };
    return (
        <div className="flex justify-center" style={{ backgroundColor: '#0B192C', width: '100vw', height: '94vh' }}>
            <div className="flex justify-center mt-9 ml-[170px]">
                <p className="absolute text-[70px] text-[#ffffff] font-bold leading-tight" style={{ transform: 'rotate(270deg)', top: '20%', left: '5%', transform: 'translate(-50%, -50%) rotate(270deg)' }}>
                    XYLAZ
                </p>
                <p className="absolute text-[30px] text-[#ffffff]  leading-tight" style={{ transform: 'rotate(270deg)', top: '21%', left: '9%', transform: 'translate(-50%, -50%) rotate(270deg)' }}>
                    BARBER SHOP
                </p>
                <p className="absolute text-[18px] text-[#ffffff] font-bold leading-tight"  style={{ transform: 'rotate(0deg)', top: '60%', left: '3%' }}>
                    FOLLOW US
                </p>
                <p className="absolute text-[15px] text-[#ffffff] leading-tight leading-[1.5]"  style={{ transform: 'rotate(0deg)', top: '65%', left: '3%' }}>
                    Connect with us and let's elevate your <br/> grooming game. Your journey to <br/>a better-looking you starts here.
                </p>
                <p className="absolute text-[60px] text-[#ffffff] font-bold leading-tight"  style={{ transform: 'rotate(0deg)', top: '28%', left: '26%' }}>
                    BARBER <br/>APPOINTMENT
                </p>
                <p className="absolute text-[17px] text-[#ffffff]  leading-tight leading-[1.5]"  style={{ transform: 'rotate(0deg)', top: '48%', left: '26%' }}>
                    Simply browse through our extensive list of skilled barbers,<br/> schedule your appointment hassle-free.
                </p>
                <a onClick={() => scrollToSection(barbersRef)}  className="absolute flex items-center gap-2 bg-[#ffffff] text-[#000000] px-14 py-4 rounded-50 text-[16px] m-auto md:m-0 hover:bg-[#000000] hover:text-[#ffffff] hover:scale-105 transition-all duration-300 rounded-full" style={{ transform: 'rotate(0deg)', top: '59%', left: '26%' }}>
                    Book appointment
                    <img className="w-3" src={assets.arrow_icon} alt="Arrow Icon" />
                </a>


                <svg xmlns="http://www.w3.org/2000/svg" width="997" height="637" viewBox="0 0 997 637" fill="none">
                    <defs>
                        <clipPath id="shapeClip">
                            <path d="M0 58C0 25.9674 25.9675 0 58 0H735.17C759.963 0 782.015 15.7597 790.044 39.2171L795.886 56.2828C803.915 79.7402 825.967 95.5 850.76 95.5H939C971.033 95.5 997 121.467 997 153.5V579C997 611.033 971.032 637 939 637H306.071C289.825 637 274.323 630.186 263.338 618.216L238.34 590.975C227.355 579.005 211.853 572.191 195.607 572.191H58C25.9675 572.191 0 546.223 0 514.191V58Z" />
                        </clipPath>
                    </defs>

                    <image href="http://localhost:8085/picture/banner_pic.png" x="0" y="0" width="997" height="900"
                           preserveAspectRatio="xMidYMid slice" clip-path="url(#shapeClip)" />
                </svg>

            </div>
            <div className="absolute "  style={{ transform: 'rotate(0deg)', top: '80%', left: '3%' }}ref={barbersRef}  id="barbers-section"></div>
        </div>

    )
}

export default Header