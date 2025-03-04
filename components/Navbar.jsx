import React from 'react'
import { Button } from './ui/button';
import { SiAmazondocumentdb } from "react-icons/si";
import { UserButton } from '@clerk/nextjs';
import { FiFolderPlus } from "react-icons/fi";
import Link from 'next/link';
const Navbar = () => {
  return (
    <nav className='h-[64px] shadow-md px-4 flex items-center'>
        <div className='flex items-center justify-between w-full max-w-6xl mx-auto'>
       <div className='flex items-center justify-center gap-2'> <p className='text-2xl font-bold'>McVault</p> <SiAmazondocumentdb size={35}/></div>
        <ul className='flex gap-4 items-center'>
             <li><Link href='/'>Home</Link></li>
            <li className='flex items-center'><Link href='/add'> <FiFolderPlus size={35} color='green' className='cursor-pointer' /></Link></li>
        </ul>
        </div>
        <UserButton/>
    </nav>
  )
}

export default Navbar;