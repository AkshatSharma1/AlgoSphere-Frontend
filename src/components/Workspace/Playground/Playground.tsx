import { useState, useEffect } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import AceEditor from 'react-ace';
import "../../../imports/AceBuilderImports";
import EditorFooter from "./EditorFooter";
import { Problem } from "@/utils/types/problem";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useSocket } from '../../../context/SocketContext'
import axios from "axios";

type PlaygroundProps = {
	problem: Problem;
	setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
	setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISettings {
	fontSize: string;
	settingsModalIsOpen: boolean;
	dropdownIsOpen: boolean;
}

const Playground: React.FC<PlaygroundProps> = ({ problem, setSuccess, setSolved }) => {
	const socket = useSocket();

	useEffect(() => {
		if (!socket) return;

		// Check if the socket is connected
		if (socket.connected) {
			console.log('Socket connected');
		} else {
			console.warn('Socket not connected yet');
		}
		console.log('socket', socket)

		socket.on('connect', () => {
			console.log('Connected to server');
		});

		socket.on('submissionPayloadResponse', (data) => {
			setStatus('');
			if (data.response.status === 'Success') {
				toast.success("Congrats! All tests passed!", {
					position: "top-center",
					autoClose: 3000,
					theme: "dark",
				});
				setSuccess(true);
				setSolved(true);
			} else {
				toast.error(`Wrong Answer \n ${data.response.output}`, {
					position: "top-center",
					autoClose: 3000,
					theme: "dark",
				});
			}
			setTimeout(() => {
				setSuccess(false);
			}, 4000);
			console.log('Received submissionPayloadResponse:', data);
		});

		socket.on('disconnect', () => {
			console.log('Disconnected from server');
		});

		return () => {
			socket.off('connect');
			socket.off('submissionPayloadResponse');
			socket.off('disconnect');
		};
	}, [socket]);



	const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
	let [userCode, setUserCode] = useState<string>(problem?.codeStubs[0].userSnippet);
	const [language, setLanguage] = useState<string>('javascript');
	const [code, setCode] = useState<string>(problem?.codeStubs[0].userSnippet);
	const [theme, setTheme] = useState<string>('twilight');
	const [status, setStatus] = useState<"" | "Pending" | "Success" | "RE" | "TLE" | "ME" | "WA">("");
	const [settings, setSettings] = useState<ISettings>({
		fontSize: "16px",
		settingsModalIsOpen: false,
		dropdownIsOpen: false,
	});

	const [user] = useAuthState(auth);
	const {
		query: { pid },
	} = useRouter();

	const handleSubmit = async () => {
		if (!user) {
			toast.error("Please login to submit your code", {
				position: "top-center",
				autoClose: 3000,
				theme: "dark",
			});
			return;
		}
		try {
			socket?.emit("setUserId", "1");
			await axios.post(`${process.env.NEXT_PUBLIC_CODE_SUBMISSION_URL}/api/v1/submissions`, {
				code, language, userId: 1, problemId: '667430fcb50c9db42efe737f'
			}).then((response) => {
				if (response.data?.success) {
					setStatus('Pending')
				} else {
					throw response;
				}
			})

			// if (typeof handler === "function") {
			// 	const success = handler(cb);
			// 	if (success) {
			// 		toast.success("Congrats! All tests passed!", {
			// 			position: "top-center",
			// 			autoClose: 3000,
			// 			theme: "dark",
			// 		});
			// 		

			// 		const userRef = doc(firestore, "users", user.uid);
			// 		await updateDoc(userRef, {
			// 			solvedProblems: arrayUnion(pid),
			// 		});
			// 		setSolved(true);
			// 	}
			// }
		} catch (error: any) {
			console.log(error.message);
			if (
				error.message.startsWith("AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:")
			) {
				toast.error("Oops! One or more test cases failed", {
					position: "top-center",
					autoClose: 3000,
					theme: "dark",
				});
			} else {
				toast.error(error.message, {
					position: "top-center",
					autoClose: 3000,
					theme: "dark",
				});
			}
		}
	};

	useEffect(() => {
		const code = localStorage.getItem(`code-${pid}`);
		if (user) {
			setUserCode(code ? JSON.parse(code) : problem?.codeStubs[0]?.userSnippet);
		} else {
			setUserCode(problem?.codeStubs[0]?.userSnippet);
		}
	}, [pid, user, problem?.codeStubs[0]?.userSnippet]);

	const onChange = (value: string) => {
		setUserCode(value);
		localStorage.setItem(`code-${pid}`, JSON.stringify(value));
	};

	return (
		<div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
			<PreferenceNav settings={settings} setSettings={setSettings} language={language} setLanguage={setLanguage}
				theme={theme} setTheme={setTheme} />

			<Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60, 40]} minSize={60}>
				<div className='w-full overflow-auto'>
					<AceEditor
						value={code}
						onChange={(e: string) => setCode(e)}
						mode={language}
						theme={theme}
						name='codeEditor'
						className='editor'
						style={{ width: '100%' }}
						setOptions={{
							enableBasicAutocompletion: true,
							enableLiveAutocompletion: true,
							showLineNumbers: true,
							fontSize: settings.fontSize
						}}
						height='100%'
					/>
				</div>
				<div className='w-full px-5 overflow-auto'>
					{/* testcase heading */}
					<div className='flex h-10 items-center space-x-6'>
						<div className='relative flex h-full flex-col justify-center cursor-pointer'>
							<div className='text-sm font-medium leading-5 text-white'>Testcases</div>
							<hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />
						</div>
					</div>

					<div className='flex'>
						{problem?.testCases?.map((example: any, index: number) => (
							<div
								className='mr-2 items-start mt-2 '
								onClick={() => setActiveTestCaseId(index)}
							>
								<div className='flex flex-wrap items-center gap-y-4'>
									<div
										className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${activeTestCaseId === index ? "text-white" : "text-gray-500"}
									`}
									>
										Case {index + 1}
									</div>
								</div>
							</div>
						))}
					</div>

					<div className='font-semibold my-4'>
						<p className='text-sm font-medium mt-4 text-white'>Input:</p>
						<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
							{problem?.testCases[activeTestCaseId]?.input}
						</div>
						<p className='text-sm font-medium mt-4 text-white'>Output:</p>
						<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
							{problem?.testCases[activeTestCaseId]?.output}
						</div>
					</div>
				</div>
			</Split>
			<EditorFooter handleSubmit={handleSubmit} status={status} />
		</div>
	);
};
export default Playground;
