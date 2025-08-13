import React from "react";
import { toast } from "react-toastify";

const ResetPassword: React.FC = () => {

	const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Inform the user that this feature is not yet implemented
		toast.warn("Password reset is not yet available. Please contact support if you need assistance.");
	};

	return (
		<form className='space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8' onSubmit={handleReset}>
			<h3 className='text-xl font-medium  text-white'>Reset Password</h3>
			<p className='text-sm text-white '>
				This feature is currently under development. Please check back later.
			</p>
			<div>
				<label htmlFor='email' className='text-sm font-medium block mb-2 text-gray-300'>
					Your email
				</label>
				<input
					type='email'
					name='email'
					id='email'
					className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white'
					placeholder='name@company.com'
					disabled // Disable the input field
				/>
			</div>

			<button
				type='submit'
				className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s cursor-not-allowed opacity-50`}
				disabled // Disable the button
			>
				Reset Password
			</button>
		</form>
	);
};
export default ResetPassword;