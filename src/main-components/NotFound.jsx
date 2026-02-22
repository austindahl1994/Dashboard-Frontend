import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <h1>404 — Page Not Found</h1>
      <p>The page you requested does not exist.</p>
      <p>
        <Link to="/">Go back home</Link>
      </p>
    </div>
  );
};

export default NotFound;
