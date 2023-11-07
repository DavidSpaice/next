import Link from 'next/link'
import React from 'react'

function page() {
    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <Link href="/warranty-management/search-warranty"><button className='bg-[#182887] px-2 text-white hover:text-gray-300'>Search Warranty</button></Link>
            <br />
            <Link href="/warranty-management/modify-warranty"><button className='bg-[#182887] px-2 text-white hover:text-gray-300'>Modify Warranty</button></Link>
            <br />
            <Link href="/warranty-management/delete-warranty"><button className='bg-[#182887] px-2 text-white hover:text-gray-300'>Delete Warranty</button></Link>
        </div>
    )
}

export default page