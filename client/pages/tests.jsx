import React from "react";
import VideoContainer from '../components/videoContainers/VideoContainer.tsx'

function tests() {
    return (
        <div className="bg-darknavy-900 h-screen flex items-center justify-center">
            <VideoContainer videoURL="https://www.youtube.com/watch?v=jrp39d9ZFtE" />
        </div>
    );
}

export default tests;