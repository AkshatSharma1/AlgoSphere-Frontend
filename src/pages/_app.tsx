import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from '../context/AuthContext'; // 1. Import AuthProvider

export default function App({ Component, pageProps }: AppProps) {
	return (
		// 2. Remove RecoilRoot and SocketProvider, wrap with AuthProvider
		<AuthProvider>
			<Head>
				<title>AlgoSphere</title> {/* Changed title */}
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<meta
					name='description'
					content='Web application that contains coding problems and solutions'
				/>
			</Head>
			<ToastContainer />
			<Component {...pageProps} />
		</AuthProvider>
	);
}