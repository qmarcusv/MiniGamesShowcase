import "./navigator.component.scss";
import { Link } from "react-router-dom";

interface NavigatorProps {
  previewLink: string;
  nextLink: string;
}

const Navigator = ({ previewLink = "", nextLink = "" }: NavigatorProps) => {
  return (
    <div className="navigator">
      {previewLink != "" && (
        <Link to={previewLink}>
          <button>Preview</button>
        </Link>
      )}

      {nextLink != "" && (
        <Link to={nextLink}>
          <button>Next</button>
        </Link>
      )}
    </div>
  );
};

export default Navigator;
