import { Problem } from "@/utils/types/problem";
import { BsCheck2Circle } from "react-icons/bs";

type ProblemDescriptionProps = {
	problem: Problem;
	_solved: boolean;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem, _solved }) => {
	if (!problem) {
		return (
			<div className='bg-dark-layer-1 text-white p-5'>
				<div>Loading problem details...</div>
			</div>
		);
	}

	const getDifficultyClass = () => {
		switch (problem.difficulty) {
			case "easy":
				return "bg-dark-green-s text-dark-green-s"; // Corrected Color
			case "medium":
				return "bg-dark-yellow text-dark-yellow";
			case "hard":
				return "bg-dark-pink text-dark-pink";
			default:
				return "bg-gray-500 text-gray-500";
		}
	};

	return (
		<div className='bg-dark-layer-1'>
			{/* TAB */}
			<div className='flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden'>
				<div className={"bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
					Description
				</div>
			</div>

			<div className='flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
				<div className='px-5'>
					{/* Problem heading */}
					<div className='w-full'>
						<div className='flex space-x-4'>
							<div className='flex-1 mr-2 text-lg text-white font-medium'>{problem.title}</div>
						</div>

						<div className='flex items-center mt-3'>
							<div
								className={`${getDifficultyClass()} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
							>
								{problem.difficulty}
							</div>
							{_solved && (
								<div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
									<BsCheck2Circle />
								</div>
							)}
						</div>

						{/* Problem Statement(paragraphs) */}
						<div className='text-white text-sm' dangerouslySetInnerHTML={{ __html: problem.description }} />

						{/* Examples */}
						<div className='mt-4'>
							{problem.testCases?.map((example: any, index: number) => (
								<div key={index}>
									<p className='font-medium text-white '>Example {index + 1}: </p>
									<div className='example-card'>
										<pre>
											<strong className='text-white'>Input: </strong> {example.input}
											<br />
											<strong>Output:</strong> {example.output}
										</pre>
									</div>
								</div>
							))}
						</div>

						{/* Constraints */}
						<div className='my-8 pb-4'>
							<div className='text-white text-sm font-medium'>Constraints:</div>
							<ul className='text-white ml-5 list-disc '>
								<div dangerouslySetInnerHTML={{ __html: problem.constraints }} />
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ProblemDescription;