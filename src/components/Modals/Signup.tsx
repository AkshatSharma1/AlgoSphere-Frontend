import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Signup: React.FC = () => {
	const [inputs, setInputs] = useState({ email: "", displayName: "", password: "" });
	const { login } = useAuth();
	const [loading, setLoading] = useState(false);

	const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!inputs.email || !inputs.password || !inputs.displayName) {
			return toast.warn("Please fill all fields");
		}
		setLoading(true);
		try {
			const response = await axios.post(`${process.env.NEXT_PUBLIC_USER_API_URL}/users/register`, {
				username: inputs.displayName,
				email: inputs.email,
				password: inputs.password,
			});

			if (response.data.success) {
				login(response.data.data);
				toast.success("Account created successfully!");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className='space-y-6 px-6 pb-4' onSubmit={handleRegister}>
			<h3 className='text-xl font-medium text-white'>Register to AlgoSphere</h3>
			<div>
				<label htmlFor='email' className='text-sm font-medium block mb-2 text-gray-300'>
					Email
				</label>
				<input
					onChange={handleChangeInput}
					type='email'
					name='email'
					id='email'
					className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white'
					placeholder='name@company.com'
				/>
			</div>
			<div>
				<label htmlFor='displayName' className='text-sm font-medium block mb-2 text-gray-300'>
					Display Name
				</label>
				<input
					onChange={handleChangeInput}
					type='text'
					name='displayName'
					id='displayName'
					className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white'
					placeholder='John Doe'
				/>
			</div>
			<div>
				<label htmlFor='password' className='text-sm font-medium block mb-2 text-gray-300'>
					Password
				</label>
				<input
					onChange={handleChangeInput}
					type='password'
					name='password'
					id='password'
					className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white'
					placeholder='*******'
				/>
			</div>
			<button
				type='submit'
				className='w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s'
				disabled={loading}
			>
				{loading ? "Registering..." : "Register"}
			</button>
			{/* You can add a link back to the login modal here if you wish */}
		</form>
	);
};
export default Signup;