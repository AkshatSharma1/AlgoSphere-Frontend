import Topbar from "@/components/Topbar/Topbar";
import Workspace from "@/components/Workspace/Workspace";
import useHasMounted from "@/hooks/useHasMounted";
import React from "react";
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { Problem } from "@/utils/types/problem";

type ProblemPageProps = {
	problem: Problem;
};

const ProblemPage: React.FC<ProblemPageProps> = ({ problem }) => {
	const hasMounted = useHasMounted();

	if (!hasMounted) return null;

	return (
		<div>
			<Topbar problemPage />
			<Workspace problem={problem} />
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { pid } = context.params as { pid: string };

	try {
		// Fetch data from a different API endpoint
		const response = await axios.get(`${process.env.NEXT_PUBLIC_CODE_PROBLEM_URL}/api/v1/problems/${pid}`);
		const problem = response?.data?.data;
		return {
			props: {
				problem,
			},
		};
	} catch (error) {
		console.error("Failed to fetch problem data:", error);
		return {
			props: {
				problem: null,
			},
		};
	}
};

export default ProblemPage;
