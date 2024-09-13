import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Hero from '../../components/Hero'
import Testimonials from '../../components/Testimonials'
import Features from '../../components/Features'
import Pricing from '../../components/Pricing'
import Downloads from '../../components/Downloads'

function Home() {
    return (
        <>
            <Hero />
            <Features />
            <Downloads />
            <Pricing />
            <Testimonials />
        </>
    )
}

export default Home