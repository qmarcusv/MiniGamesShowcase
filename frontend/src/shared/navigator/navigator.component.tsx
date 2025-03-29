import "./navigator.component.scss";
import { Link } from "react-router-dom";

interface NavigatorProps {
	previewLink: string;
	nextLink: string;
}

const Navigator = ({ previewLink = "", nextLink = "" }: NavigatorProps) => {
	return (
		<div className=" h-30 justify-center flex items-center gap-10">
			{previewLink != "" && (
				<Link to={previewLink}>
					<button
						type="button"
						className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
					>
						Back
					</button>
				</Link>
			)}

			{nextLink != "" && (
				<Link to={nextLink}>
					<button
						type="button"
						className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
					>
						Next
					</button>
				</Link>
			)}
		</div>
	);
};

export default Navigator;
