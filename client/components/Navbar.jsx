import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0';

function Navbar() {

    const { user, error, isLoading } = useUser();

    return (
        <>
            <nav className="flex sticky top-0 z-50 h-16 dark:bg-darknavy-900 dark:text-darknavy-50 align-middle">
                <div className="flex flex-row navcontainer w-full justify-between items-center mx-20">
                    <div className="container-left">
                        <Link href="/"> DungeonSounds </Link>
                    </div>
                    <div className="flex flex-row container-right gap-8 items-center">
                        <Link href="/lib" className='text-center w-20'> Library </Link>
                        <Link href="/mix" className='text-center w-20'> Mix </Link>
                        <Link href="/compose" className='text-center w-20'> Compose </Link>
                        <Link href="/about" className='text-center w-20'> About </Link>
                        <Link href="/contribute" className='text-center w-20'> Contribute </Link>
                        <a href={
                            /* show profile if logged in or forward to login in page if not */
                            user ? '/api/auth/logout' : '/api/auth/login'
                        }>
                            {
                                /* show profile picture if logged in and default svg if not, display spinning animation while loading */
                                isLoading ?
                                    <svg className="animate-spin h-10 w-10 text-navy-sierra-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                    :
                                    user ?
                                        <Image src={user.picture} className="rounded-full h-10 w-10" width={40} height={40} />
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                            }
                        </a>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar