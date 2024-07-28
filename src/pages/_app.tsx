import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketProvider } from '../context/SocketContext';
export default function App({ Component, pageProps }: AppProps) {
	return (
		<RecoilRoot>
			<Head>
				<title>AlgoCode</title>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<meta
					name='description'
					content='Web application that contains AlgoCode problems and video solutions'
				/>
			</Head>
			<ToastContainer />
			<SocketProvider url={process.env.NEXT_PUBLIC_CODE_SOCKET_URL || ''}>
				<Component {...pageProps} />
			</SocketProvider>
		</RecoilRoot>
	);
}
