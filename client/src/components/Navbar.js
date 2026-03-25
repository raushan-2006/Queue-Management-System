import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-slate-900">
          Queue Joy
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>

          {token && user?.role === "patient" && (
            <>
              <Link
                to="/dashboard"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Doctors
              </Link>

              <Link
                to="/book"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Book
              </Link>

              <Link
                to="/track-token"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Track Token
              </Link>
            </>
          )}

          {token && user?.role === "doctor" && (
            <Link
              to="/doctor"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Doctor Panel
            </Link>
          )}

          {token && user?.role === "admin" && (
            <Link
              to="/admin"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Admin
            </Link>
          )}

          {token && (
            <>
              <Link
                to="/queue-status"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Live Status
              </Link>

              <Link
                to="/profile"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

          {!token && (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;