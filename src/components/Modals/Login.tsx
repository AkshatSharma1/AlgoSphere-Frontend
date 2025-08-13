import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext"; // 1. Import useAuth
import { toast } from "react-toastify";
import axios from "axios";

const Login: React.FC = () => {
	const [inputs, setInputs] = useState({ email: "", password: "" });
	const { login } = useAuth(); // 2. Get the login function from our context
	const [loading, setLoading] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!inputs.email || !inputs.password) return toast.warn("Please fill all fields");
		setLoading(true);
		try {
			// 3. Call your User-Service backend
			const response = await axios.post(`${process.env.NEXT_PUBLIC_USER_API_URL}/users/login`, {
				email: inputs.email,
				password: inputs.password,
			});

			if (response.data.success) {
				// 4. Call the context's login function
				login(response.data.data);
				toast.success("Logged in successfully!");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className='space-y-6 px-6 pb-4' onSubmit={handleLogin}>
			{/* ... The rest of the JSX form remains the same ... */}
			<h3 className='text-xl font-medium text-white'>Sign in to AlgoSphere</h3>
			<div>
				<label htmlFor='email' className='text-sm font-medium block mb-2 text-gray-300'>Your Email</label>
				<input onChange={handleInputChange} type='email' name='email' id='email' placeholder='name@company.com' className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white' />
			</div>
			<div>
				<label htmlFor='password' className='text-sm font-medium block mb-2 text-gray-300'>Your Password</label>
				<input onChange={handleInputChange} type='password' name='password' id='password' placeholder='*******' className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white' />
			</div>
			<button type='submit' className='w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s' disabled={loading}>
				{loading ? "Loading..." : "Log In"}
			</button>
			{/* ... rest of the form ... */}
		</form>
	);
};
export default Login;