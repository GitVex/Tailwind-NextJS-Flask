import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import VideoContainer from '../components/videoContainers/VideoContainer.tsx'

function tests() {

    const [moveX, setMoveX] = useState(0)
    const [moveY, setMoveY] = useState(0)
    const [rot, setRot] = useState(0)

    // make two sliders that move the video container

    //html slider
    const sliderX = <input type="range" min="0" max="100" value={moveX} className="slider" id="myRange" onChange={(e) => setMoveX(parseFloat(e.target.value))} />
    const sliderY = <input type="range" min="0" max="100" value={moveY} className="slider" id="myRange" onChange={(e) => setMoveY(parseFloat(e.target.value))} />
    const sliderRotation = <input type="range" min="0" max="360" value={rot} className="slider" id="myRange" onChange={(e) => setRot(parseFloat(e.target.value))} />


    return (
        <div className="bg-darknavy-900 h-screen flex flex-col gap-2 place-items-center">
            <motion.div animate={{ x: moveX, y: moveY, rotate: rot }} className="">
                <VideoContainer videoURL="https://www.youtube.com/watch?v=jrp39d9ZFtE" scale={.5} />
            </motion.div>
            {sliderX}
            {sliderY}
            {sliderRotation}
        </div>
    );
}

export default tests;