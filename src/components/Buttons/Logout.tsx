import { useAuth } from "@/context/AuthContext"; // 1. Import useAuth
import React from "react";
import { FiLogOut } from "react-icons/fi";

const Logout: React.FC = () => {
	const { logout } = useAuth(); // 2. Get logout function

	return (
		<button className='bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange' onClick={logout}>
			<FiLogOut />
		</button>
	);
};
export default Logout;