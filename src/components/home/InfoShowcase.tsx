import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const InfoShowcase = () => {
    return (
        <div className="bg-gradient-to-br from-blue-500 to-purple-400 py-16 p-10 m-10">
            <div className='grid grid-cols-2 gap-8'>
                <div className='flex items-center justify-center'>
                    <Image src="/water.png" alt="Showcase Image" width={200} height={180} className='items-end' />
                </div>
                <div className='text-white '>
                    <h2 className='text-4xl font-bold mb-4'>Water Shield</h2>
                    <p className='text-lg mb-6'>Experience the best in smart electronics with our curated selection of cutting-edge products. From innovative gadgets to sleek devices, we bring you the future of technology today.</p>
                    <Link href="/products" className='bg-white text-blue-500 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition'>Shop Now</Link>
                </div>

            </div>

        </div>
    )
}

export default InfoShowcase