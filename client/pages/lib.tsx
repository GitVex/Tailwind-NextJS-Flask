import React from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/utils/Card'
import { useUser } from '@auth0/nextjs-auth0'

const card1Icon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
);

const card2Icon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

const card3Icon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
    </svg>
);

const card4Icon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


function lib() {

    const { user, error, isLoading } = useUser();

    return (
        <div className='bg-navy-sierra-100 dark:bg-darknavy-900 h-screen overflow-hidden'>
            <Navbar />
            <div className="h-screen flex justify-center items-center gap-6">
                <div className={isLoading || !user ? "pointer-events-none opacity-50" : ""}>
                    <Card svgIcon={card1Icon} title="Bookmarks" subtext="Your favorites" link="/lib/bookmarks" />
                </div>
                <Card svgIcon={card2Icon} title="Browse" subtext="See what other DMs posted" link="/lib/browse" />
                <Card svgIcon={card3Icon} title="Categories" subtext="Find exactly what youre looking for" link="lib/categories" />
                <div className={isLoading || !user ? "pointer-events-none opacity-50" : ""}>
                    <Card svgIcon={card4Icon} title="Your Tracks" subtext="Things that you added" link="." />
                </div>
            </div>
        </div>
    )
}

export default lib