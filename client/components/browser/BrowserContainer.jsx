import React from 'react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@auth0/nextjs-auth0'

function BrowserContainer(prop) {

    const [expand, setExpand] = useState(false)
    const [delayedExpand, setDelayedExpand] = useState(false)
    const [ResponseData, setResponseData] = useState(null)
    const data = JSON.parse(prop.trackData)

    const { user, error, isLoading } = useUser();

    // switch delayedExpand to the value of expand 1 second after expand is changed
    useEffect(() => {
        setTimeout(() => {
            setDelayedExpand(expand)
        }, 500)
    }, [expand])

    // switch statement based on the target of the link, using the target property of the passed prop
    function switchTarget(target) {
        switch (target) {
            case 'youtube':
                return (<Image src="/../public/grafik 1.png" height={16} width={16} />)
            case 'spotify':
                return (<Image src="/../public/Spotify_logo_without_text 1.png" height={16} width={16} />)
            case 'soundcloud':
                return (<Image src="/../public/soundcloud 1.png" height={16} width={16} />)
            default:
                return (<Image src="/../public/grafik 1.png" height={16} width={16} />)
        }
    }

    /* Save the entry to the django rest database */
    async function postToDatabase() {

        const requestOptions = {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:8000',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: data.title,
                artist: data.artist,
                url: data.url,
                created_by: user.sub,
                duration: JSON.stringify(data.duration[1]),
            })
        }

        // fetch the data from the django rest api and handle NetworkError
        try {
            const response = await fetch('http://localhost:8000/api/track/', requestOptions)
            const data = await response.json()
            setResponseData(data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div onClick={() => setExpand(!expand)} className="text-navy-sierra-100 bg-darknavy-800/50 p-1 rounded-md flex flex-row">
                <div className='flex flex-row w-[100%] gap-2'>
                    <span className='w-[80%]'>{data.title}</span>
                    <span className='text-navy-sierra-200 text-opacity-30 truncate w-[20%]'>{data.artist}</span>
                    <span className='hover:animate-spin opacity-30 flex items-center justify-self-end flex-grow'>
                        {switchTarget(data.target)}
                    </span>
                </div>
                <motion.button className='justify-self-end flex-grow' onClick={() => setExpand(!expand)} animate={{ rotate: expand ? 0 : 90 }} >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-6 h-6 stroke-navy-sierra-100">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </motion.button>
            </div>
            <motion.div className='text-navy-sierra-100 bg-darknavy-800/40 p-1 rounded-md' animate={expand ? { opacity: 1, height: 350 } : { opacity: 0, height: 0 }}>
                {expand || delayedExpand ?
                    <div className='flex flex-col h-[350px]'>
                        <span className='flex flex-row gap-2 items-end m-2'>
                            <p className='text-2xl'>{data.title.length > 50 ? data.title.slice(0, 47) + " ..." : data.title}</p>
                            <p className='text-navy-sierra-200 text-opacity-30'>{data.url}</p>
                            <p className='text-navy-sierra-200 text-opacity-30'>{data.duration[0]}</p>
                        </span>
                        <span className='m-2'>
                            <motion.div whileHover={{ y: -5 }} className='w-fit' onClick={ /* open link in a new tab */ () => window.open(data.url, '_blank')}>
                                <Image src={data.thumbnail.url} height={data.thumbnail.height} width={data.thumbnail.width} className="rounded-xl cursor-pointer" />
                            </motion.div>
                        </span>
                        <span className='place-self-end m-2 flex flex-row place-items-center gap-2'>
                            <motion.button disabled={isLoading || !user} className={isLoading || !user ? 'rounded-md p-2 bg-darknavy-800 flex flex-row place-items-center gap-2 opacity-50' : 'rounded-md p-2 bg-darknavy-800 flex flex-row place-items-center gap-2'} whileHover={isLoading || !user ? {} : { scale: 1.05, y: -5 }} onClick={() => postToDatabase()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                <p>
                                    Create Entry
                                </p>
                            </motion.button>

                            { // display the response status from the django rest api
                                ResponseData ?
                                    <p className='text-navy-sierra-200 text-opacity-30'>
                                        {ResponseData.status}
                                    </p>
                                    :
                                    null
                            }

                            {/* <motion.p transition={{ duration: 2, ease: "easeOut" }} initial={{x: -10, opacity: 0}} animate={{x: 0, opacity: .5}} className='opacity-50'> { !ResponseData ? "Loading ..." : ResponseData.status} </motion.p> */}
                        </span>
                    </div>
                    : null
                }

            </motion.div>
        </>
    )
}

export default BrowserContainer