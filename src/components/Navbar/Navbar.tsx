import Link from "next/link";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import Logout from "../Buttons/Logout";
import Image from "next/image";

const Navbar: React.FC = () => {
	const { user } = useAuth();

	return (
		<div className='flex items-center justify-between sm:px-12 px-2 md:px-24'>
			<Link href='/' className='flex items-center justify-center h-20'>
				<div className='text-white text-2xl font-bold'>AlgoSphere</div>
			</Link>
			<div className='flex items-center'>
				{!user ? (
					<Link href='/auth'>
						<button
							className='bg-brand-orange text-white px-2 py-1 sm:px-4 rounded-md text-sm font-medium
                            hover:text-brand-orange hover:bg-white hover:border-2 hover:border-brand-orange border-2 border-transparent
                            transition duration-300 ease-in-out'
						>
							Sign In
						</button>
					</Link>
				) : (
					<div className='flex items-center space-x-4'>
						<div className='cursor-pointer group relative'>
							<Image src='/avatar.png' alt='User Avatar' width={30} height={30} className='rounded-full' />
							<div
								className='absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg 
								z-40 group-hover:scale-100 scale-0 
								transition-all duration-300 ease-in-out'
							>
								<p className='text-sm'>{user.email}</p>
							</div>
						</div>
						<Logout />
					</div>
				)}
			</div>
		</div>
	);
};
export default Navbar;