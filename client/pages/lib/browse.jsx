import React from 'react'
import Browser from '../../components/browser/Browser'
import Linkspace from '../../components/Linkspace'
import Navbar from '../../components/Navbar'
import { useState, useEffect } from "react";

function browse() {

  const [data, setData] = useState([])

  return (
    <div className='bg-navy-sierra-100 dark:bg-darknavy-900'>
        <Navbar/>
        <div className="h-screen overflow-scroll">
            <Linkspace setMethod={setData}/>
            <Browser items={JSON.stringify(data)}/>
        </div>
    </div>
  )
}

export default browse