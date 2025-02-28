import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Barbers from '../pages/Barbers';
const Home = () => {
    return (
        <div>
            <Header/>
            <Barbers/>
            <About/>
            <Contact/>
        </div>
    )
}

export default Home;
