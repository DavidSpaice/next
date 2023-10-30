import Link from 'next/link'
import React from 'react'

function page() {
    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <Link href="/dealer-data/add-dealer"><button className='bg-[#182887] px-2 text-white hover:text-gray-300'>Add Dealer</button></Link>
            <br />
            <Link href="/dealer-data/modify-dealer"><button className='bg-[#182887] px-2 text-white hover:text-gray-300'>Modify Dealer</button></Link>
            <br />
            <Link href="/dealer-data/delete-dealer"><button className='bg-[#182887] px-2 text-white hover:text-gray-300'>Delete Dealer</button></Link>
        </div>
    )
}

export default page