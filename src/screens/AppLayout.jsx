import React from 'react'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'
import Header from '../components/Navbar'

function AppLayout() {
    return (
        <>
            <Header />
            <Outlet  />
            <Footer />
        </>)
}

export default AppLayout