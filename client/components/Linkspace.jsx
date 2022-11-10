import React from 'react'
import Image from 'next/Image'
import { queryAPIs } from './utils/LinkspaceQueryParser.ts'
import { useState } from 'react'

function Linkspace(setMethod) {

    const [searching, setSearching] = useState(false)
    setMethod = setMethod.setMethod

    // submit method for the search form using the searchYoutube function
    const submit = async (e) => {

        // foward to the browse page if not on it already
        if (window.location.pathname !== '/lib/browse') {
            // nextjs router forwards to the browse page
            Router.push('/lib/browse')
            return
        }

        setSearching(true)

        e.preventDefault()
        const query = e.target.query.value
        const results = await queryAPIs(query)
        console.log(results)
        setMethod(results)
        setSearching(false)
    }

    return (
        <div className='my-4 mx-auto w-max'>
            <form onSubmit={submit} method='POST' className='flex flex-col justify-center'>
                <section className='flex flex-row gap-2'>
                    <input id="query" type="text" placeholder='Add your track to help other Dungeon Masters!' className='w-[42em] font-mono font-extralight text-navy-sierra-100 bg-darknavy-800 border-[3px] p-1 rounded-xl border-darknavy-700' name="query" />
                    {searching &&
                        (<div className='flex flex-row justify-center'>
                            <div className="animate-spin rounded-full h-8 w-8">
                                <svg className="h-8 w-8 text-navy-sierra-100" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>)
                    }
                </section>
                <section className='flex flex-row gap-1 my-1'>
                    <Image src="/../public/grafik 1.png" height={16} width={16} />
                    <Image src="/../public/Spotify_logo_without_text 1.png" height={16} width={16} />
                    <Image src="/../public/soundcloud 1.png" height={16} width={16} />
                </section>
                <input type="submit" hidden />
            </form>
        </div>
    )
}

export default Linkspace