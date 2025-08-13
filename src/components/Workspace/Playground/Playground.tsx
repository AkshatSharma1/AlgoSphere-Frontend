import { useState, useEffect, useRef } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import AceEditor from 'react-ace';
import "../../../imports/AceBuilderImports";
import EditorFooter, { SubmissionStatus } from "./EditorFooter";
import { Problem } from "@/utils/types/problem";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

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
	const { user, token } = useAuth();
	const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
	const [language, setLanguage] = useState<string>('python');
	const [theme, setTheme] = useState<string>('twilight');
	const [status, setStatus] = useState<SubmissionStatus>("");
	const [isConsoleOpen, setIsConsoleOpen] = useState(true);
	const [settings, setSettings] = useState<ISettings>({
		fontSize: "16px",
		settingsModalIsOpen: false,
		dropdownIsOpen: false,
	});

	// State for the user's editable code
	const [userCode, setUserCode] = useState<string>("");

	// Refs to store the non-editable snippets
	const startSnippetRef = useRef<string>("");
	const endSnippetRef = useRef<string>("");

	useEffect(() => {
		const matchingStub = problem.codeStubs.find((stub: { language: string }) => stub.language.toLowerCase() === language.toLowerCase());
		if (matchingStub) {
			startSnippetRef.current = matchingStub.startSnippet || "";
			endSnippetRef.current = matchingStub.endSnippet || "";
			setUserCode(matchingStub.userSnippet || "");
		} else {
			// Handle case where no stub is found for the selected language
			startSnippetRef.current = `// No code stub available for ${language}`;
			endSnippetRef.current = "";
			setUserCode("");
		}
	}, [problem, language]);

	// This is the combined code that will be displayed in the editor
	const editorValue = `${startSnippetRef.current}\n${userCode}\n${endSnippetRef.current}`;

	const handleEditorChange = (newValue: string) => {
		const startSnippet = startSnippetRef.current;
		const endSnippet = endSnippetRef.current;

		// Protect the start and end snippets from being edited
		if (newValue.startsWith(startSnippet) && newValue.endsWith(endSnippet)) {
			const startSnippetLines = startSnippet.split('\n').length;
			const totalLines = newValue.split('\n').length;
			const endSnippetLines = endSnippet.split('\n').length;

			// Extract the editable part
			const editableContent = newValue.split('\n').slice(startSnippetLines, totalLines - endSnippetLines).join('\n');
			setUserCode(editableContent);
		}
	};


	const handleSubmit = async () => {
		if (!user || !token) {
			return toast.error("Please login to submit your code");
		}
		if (!userCode) {
			return toast.warn("Code cannot be empty.");
		}

		try {
			setStatus('Pending');
			const config = { headers: { Authorization: `Bearer ${token}` } };

			const response = await axios.post(`${process.env.NEXT_PUBLIC_CODE_SUBMISSION_URL}/api/v1/submissions`, {
				code: userCode, // We only submit the user's editable code
				language: language.toUpperCase(),
				problemId: problem._id
			}, config);

			if (response.data.success) {
				const submissionId = response.data.data.submission._id;
				pollForResult(submissionId, config);
			} else {
				throw new Error("Submission failed to be accepted.");
			}

		} catch (error: any) {
			console.error("Submission failed:", error);
			toast.error(error.response?.data?.message || "Failed to submit.");
			setStatus("");
		}
	};

	const pollForResult = (submissionId: string, config: any) => {
		const intervalId = setInterval(async () => {
			try {
				const { data } = await axios.get(`${process.env.NEXT_PUBLIC_CODE_SUBMISSION_URL}/api/v1/submissions/${submissionId}`, config);

				if (data.data.status !== "Pending") {
					clearInterval(intervalId);
					setStatus(data.data.status);

					if (data.data.status === "Success") {
						toast.success("Congrats! All tests passed!");
						setSuccess(true);
						setSolved(true);
						setTimeout(() => setSuccess(false), 4000);
					} else {
						toast.error(`Result: ${data.data.status}`);
					}
				}
			} catch (error) {
				console.error("Polling error:", error);
				clearInterval(intervalId);
				setStatus("Error" as SubmissionStatus);
				toast.error("Could not retrieve submission result.");
			}
		}, 2000);
	};

	return (
		<div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
			<PreferenceNav settings={settings} setSettings={setSettings} language={language} setLanguage={setLanguage}
				theme={theme} setTheme={setTheme} />

			<Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={isConsoleOpen ? [60, 40] : [100, 0]} minSize={isConsoleOpen ? 60 : 0}>
				<div className='w-full overflow-auto'>
					<AceEditor
						value={editorValue} // Bind to the combined value
						onChange={handleEditorChange} // Use the new handler
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
				{isConsoleOpen && (
					<div className='w-full px-5 overflow-auto'>
						<div className='flex h-10 items-center space-x-6'>
							<div className='relative flex h-full flex-col justify-center cursor-pointer'>
								<div className='text-sm font-medium leading-5 text-white'>Testcases</div>
								<hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />
							</div>
						</div>

						<div className='flex'>
							{problem?.testCases?.map((example: any, index: number) => (
								<div
									key={index}
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
				)}
			</Split>
			<EditorFooter handleSubmit={handleSubmit} status={status} isConsoleOpen={isConsoleOpen} setIsConsoleOpen={setIsConsoleOpen} />
		</div>
	);
};
export default Playground;