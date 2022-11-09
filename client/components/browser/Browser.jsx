import React from 'react'
import BrowserContainer from './BrowserContainer.jsx';

function Browser(prop) {

    let data = JSON.parse(prop.items)

    // loop over data and check if an entry is null, if so, remove it
    for (let i = 0; i < data.length; i++) {
        if (data[i] === null) {
            data.splice(i, 1)
        }
    }

    return (
        <div className='mx-20 flex flex-col gap-1 justify-start'>
            {data.map((item) => 
                <BrowserContainer trackData={JSON.stringify(item)}/>)
            }
        </div>)
}

export default Browser