import React, { useState, useEffect } from 'react'
import Image from 'next/Image'
import styles from './VideoContainer.module.css'
import { motion } from 'framer-motion'
import { queryAPIs, VidData } from '../utils/LinkspaceQueryParser'


// Language Typescript

function VideoContainer(props) {

    const videoURL: string = props.videoURL
    const propData: VidData = props.propData

    if (!videoURL && !propData) {
        throw new Error('VideoContainer requires either a videoURL or propData')
    }

    const [data, setData] = useState<VidData>(propData)

    // fetch data before rendering
    useEffect(() => {
        if (videoURL) {
            queryAPIs(videoURL).then((data) => {
                setData(data[0])
            })
        } else {
            setData(propData)
        }
    }, [])

    console.log(data)

    if (!data || data === undefined) {
        return null
    }

    return (
        <motion.div className={styles.videoContainer + ' flex justify-center bg-navy-sierra-100 dark:bg-black rounded-lg m-4'} whileHover={{ scale: 1.05 }} transition={{ duration: .1 }} >
            <Image src={data.thumbnail.url} width={data.thumbnail.width} height={data.thumbnail.height} alt="Here should be the video thumbnail" />
            <span className='relative flex align-middle px-4 z-2 translate-y-[-5rem]'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-16 h-16 fill-black dark:fill-navy-sierra-50">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
                </svg>
                <span className='flex flex-col align-middle justify-center px-2'>
                    <p className='text-start text-darknavy-900 dark:text-darknavy-100 text-2xl truncate w-80'>{data.title}</p>
                    <p className='text-start font-thin text-darknavy-900 dark:text-darknavy-100 text-md truncate'>{data.artist}</p>
                </span>
            </span>
        </motion.div>
    )
}

export default VideoContainer