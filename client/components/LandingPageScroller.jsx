import React from 'react'
import VideoContainer from './videoContainers/VideoContainer'
import Slider from 'react-slick'
import styles from './Scroller.module.css'

function LandingPageScroller() {

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 2000,
    autoplay: true,
  };

  return (
    <>
        <Slider {...settings} className={"z-1 overflow-hidden align-middle gap-5 w-screen h-96 " + styles.Scroller}>
          <VideoContainer videoURL="https://www.youtube.com/watch?v=jrp39d9ZFtE"/>
          <VideoContainer videoURL="https://www.youtube.com/watch?v=I05yWxGRA9g"/>
          <VideoContainer videoURL="https://www.youtube.com/watch?v=ND5snVy4Fnw"/>
          <VideoContainer videoURL="https://www.youtube.com/watch?v=ztzq05IzYds"/>
          <VideoContainer videoURL="https://www.youtube.com/watch?v=e4C4qUFH2-8"/>
        </Slider>
    </>
  )
}

export default LandingPageScroller