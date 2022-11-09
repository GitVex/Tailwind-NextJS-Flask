import React from 'react'
import Navbar from '../components/Navbar'
import LandingPageScroller from '../components/LandingPageScroller'
import Linkspace from '../components/Linkspace'

export default function App() {
    return (
    <>
        <div className='bg-navy-sierra-100 dark:bg-darknavy-900'>
            <Navbar/>
            <LandingPageScroller/>
            <div className='flex flex-col justify-center align-middle p-24'>
                <span className='text-4xl text-darknavy-50 text-center w-auto'>The database to take your game to the next level</span>
                <Linkspace/>
            </div>
        </div>
    </>
    )
}