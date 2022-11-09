import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useUser } from '@auth0/nextjs-auth0'

/**
 * @param {string} pxlIcon - the path to the icon
 * @param {JSX.Element | JSX.Element[]} svgIcon - the svg element
 * @param {string} title - the title of the card
 * @param {string} subtext - the subtext of the card
 * @param {string} link - the link of the card
 * 
 * 
 * Card component to create a customizable menu card.
 * 
 * 
 * passed Icons should have dimensions of 64px*64px </p>
 * 
 * @returns {JSX.Element} - the card element
*/
export default function Card(prop: { pxlIcon?: string, svgIcon?: JSX.Element | JSX.Element[], title: string, subtext?: string, link: string }) {

    // throw an error if both strIcon and svgIcon are passed
    if (prop.pxlIcon && prop.svgIcon) {
        throw new Error('Only one of pxlIcon or svgIcon can be parsed to the Card component');
    }

    // return the svg element if it is passed, otherwise return the image element
    function getIcon() {
        if (prop.svgIcon) {
            return prop.svgIcon;
        } else if (prop.pxlIcon) {
            return <Image src={prop.pxlIcon} alt={prop.title} width={64} height={64} />;
        } else if (!prop.svgIcon && !prop.pxlIcon) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
            );
        }
    }

    return (
        <motion.a href={prop.link} className="flex flex-col gap-2 p-2 rounded-md bg-darknavy-800 hover:bg-darknavy-600 text-navy-sierra-100 hover:text-navy-sierra-900 w-40 cursor-pointer duration-100 items-center" transition={{ duration: .1 }} whileHover={{ scale: 1.05 }}>
            <motion.div>
                {getIcon()}
            </motion.div>
            <div className="flex flex-col gap-1 items-center h-16 m-2 content-end text-center">
                <p className="text-navy-sierra-100 font-bold">{prop.title}</p>
                <p className="text-navy-sierra-200 text-opacity-75">{prop.subtext}</p>
            </div>
        </motion.a>
    );
}