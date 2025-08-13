import AuthModal from "@/components/Modals/AuthModal";
import Navbar from "@/components/Navbar/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const AuthPage: React.FC = () => {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (user && !loading) {
			router.push("/");
		}
	}, [user, loading, router]);

	// Show a loading indicator while the auth state is being determined
	if (loading) {
		return (
			<div className='bg-gradient-to-b from-gray-600 to-black h-screen flex justify-center items-center'>
				<div className='text-white text-2xl'>Loading...</div>
			</div>
		);
	}

	// Do not render the auth page if the user is logged in (while redirecting)
	if (user) return null;

	return (
		<div className='bg-gradient-to-b from-gray-600 to-black h-screen relative'>
			<div className='max-w-7xl mx-auto'>
				<Navbar />
				<div className='flex items-center justify-center h-[calc(100vh-5rem)] pointer-events-none select-none'>
					<Image src='/hero.png' alt='Hero img' width={700} height={700} />
				</div>
				{/* This AuthModal can now be simplified or controlled by local state if needed */}
				<AuthModal />
			</div>
		</div>
	);
};
export default AuthPage;