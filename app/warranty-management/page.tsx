import Link from 'next/link'
import React from 'react'
import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'; 

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

export async function getData(context: GetServerSidePropsContext) {
    const session = await getSession(context)
    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin', // Redirect to the sign-in page
                permanent: false,
            },
        }
    }

    return {
        props: {},
    }
}

export default page