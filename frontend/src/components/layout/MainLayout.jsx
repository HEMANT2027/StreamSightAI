import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'



const MainLayout = () => {
    return (
        <div className='flex flex-col min-h-screen overflow-x-hidden pt-[70px]'>
            <Navbar />
            <div>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default MainLayout
