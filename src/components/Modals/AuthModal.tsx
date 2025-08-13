import React, { useState } from "react";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import Signup from "./Signup";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/router";

type AuthModalProps = {};

const AuthModal: React.FC<AuthModalProps> = () => {
	const [authType, setAuthType] = useState<"login" | "register" | "forgotPassword">("login");
	const router = useRouter();

	const closeModal = () => {
		// Instead of managing state, we just navigate away from the auth page
		router.push("/");
	};

	return (
		<>
			<div
				className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60'
				onClick={closeModal}
			></div>
			<div className='w-full sm:w-[450px]  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  flex justify-center items-center'>
				<div className='relative w-full h-full mx-auto flex items-center justify-center'>
					<div className='bg-white rounded-lg shadow relative w-full bg-gradient-to-b from-brand-orange to-slate-900 mx-6'>
						<div className='flex justify-end p-2'>
							<button
								type='button'
								className='bg-transparent  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 hover:text-white text-white'
								onClick={closeModal}
							>
								<IoClose className='h-5 w-5' />
							</button>
						</div>
						{/* Logic to switch between Login, Signup, and ResetPassword */}
						{authType === "login" ? (
							<Login />
						) : authType === "register" ? (
							<Signup />
						) : (
							<ResetPassword />
						)}

						{/* Links to switch forms */}
						<div className="text-center text-white pb-4">
							{authType === "login" ? (
								<>
									<span>Dont have an account? </span>
									<button onClick={() => setAuthType("register")} className="text-blue-400 hover:underline">Sign up</button>
									<span className="mx-2">|</span>
									<button onClick={() => setAuthType("forgotPassword")} className="text-blue-400 hover:underline">Forgot Password?</button>
								</>
							) : (
								<>
									<span>Already have an account? </span>
									<button onClick={() => setAuthType("login")} className="text-blue-400 hover:underline">Log in</button>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default AuthModal;