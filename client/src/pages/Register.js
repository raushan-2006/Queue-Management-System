import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [specialization, setSpecialization] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", {
        name,
        email,
        mobile,
        password,
        role,
        specialization,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-6 py-12 md:grid-cols-2">
        <div>
          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            Create Account
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-900">
            Join the smarter healthcare queue system
          </h1>

          <p className="mt-5 max-w-xl text-lg text-slate-600">
            Register as a patient, doctor, or admin to access your role-based
            dashboard and manage appointments easily.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-slate-900">Register</h2>
          <p className="mt-2 text-slate-500">
            Create your account to get started.
          </p>

          {error && (
            <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Mobile Number
              </label>
              <input
                type="text"
                placeholder="+919876543210"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Account Type
              </label>
              <select
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {role === "doctor" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Specialization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cardiology"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-2xl px-5 py-3 text-sm font-semibold text-white transition ${
                loading
                  ? "cursor-not-allowed bg-slate-400"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-green-600 hover:text-green-700"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;