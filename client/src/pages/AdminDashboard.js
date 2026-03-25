import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [queues, setQueues] = useState([]);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [averageServiceTime, setAverageServiceTime] = useState("");

  const token = localStorage.getItem("token");

  const fetchQueues = useCallback(async () => {
    try {
      const res = await API.get("/queue");
      setQueues(res.data.queues || []);
    } catch (error) {
      console.error("Error fetching queues:", error);
      setMessage("Failed to load queues");
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await API.get("/auth/users", {
        headers: {
          Authorization: token,
        },
      });
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Failed to load users");
    }
  }, [token]);

  const fetchDoctors = useCallback(async () => {
    try {
      const res = await API.get("/auth/doctors", {
        headers: {
          Authorization: token,
        },
      });
      setDoctors(res.data.doctors || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  }, [token]);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([fetchQueues(), fetchUsers(), fetchDoctors()]);
    } finally {
      setLoading(false);
    }
  }, [fetchQueues, fetchUsers, fetchDoctors]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleCreateQueue = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await API.post(
        "/queue/create",
        {
          serviceName,
          doctorId,
          averageServiceTime: Number(averageServiceTime) || 5,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setMessage(res.data.message);
      setServiceName("");
      setDoctorId("");
      setAverageServiceTime("");
      await fetchQueues();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to create queue");
    }
  };

  const handleDeleteQueue = async (queueId) => {
    setMessage("");

    try {
      const res = await API.delete(`/queue/delete/${queueId}`, {
        headers: {
          Authorization: token,
        },
      });

      setMessage(res.data.message);
      await fetchQueues();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to delete queue");
    }
  };

  const handleNextToken = async (queueId) => {
    setActionLoading(queueId);
    setMessage("");

    try {
      const res = await API.post(
        "/token/next",
        { queueId },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setMessage(`Next token called successfully: ${res.data.token.tokenNumber}`);
      await fetchQueues();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to call next token");
    } finally {
      setActionLoading("");
    }
  };

  const stats = useMemo(() => {
    const totalQueues = queues.length;
    const totalPatients = users.length;
    const totalDoctors = doctors.length;
    const avgServiceTime =
      queues.length > 0
        ? Math.round(
            queues.reduce((sum, queue) => sum + queue.averageServiceTime, 0) /
              queues.length
          )
        : 0;

    return {
      totalQueues,
      totalPatients,
      totalDoctors,
      avgServiceTime,
    };
  }, [queues, users, doctors]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="mt-2 text-slate-600">
              Manage doctor queues, patients, and appointments.
            </p>
          </div>

          <button
            onClick={fetchAllData}
            className="rounded-xl bg-slate-800 px-5 py-3 font-semibold text-white hover:bg-slate-900"
          >
            Refresh Data
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-xl bg-white p-4 text-center shadow">
            <p className="font-medium text-slate-700">{message}</p>
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-md">
            <p className="text-sm text-slate-500">Doctor Queues</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {stats.totalQueues}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-md">
            <p className="text-sm text-slate-500">Patients</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {stats.totalPatients}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-md">
            <p className="text-sm text-slate-500">Doctors</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {stats.totalDoctors}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-md">
            <p className="text-sm text-slate-500">Avg Service Time</p>
            <h2 className="mt-2 text-3xl font-bold text-purple-600">
              {stats.avgServiceTime} min
            </h2>
          </div>
        </div>

        <div className="mb-10 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-slate-800">
            Create Doctor Queue
          </h2>

          <form
            onSubmit={handleCreateQueue}
            className="grid gap-4 md:grid-cols-4"
          >
            <input
              type="text"
              placeholder="Service Name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Average Service Time"
              value={averageServiceTime}
              onChange={(e) => setAverageServiceTime(e.target.value)}
              className="rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Create Queue
            </button>
          </form>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {queues.map((queue) => (
              <div
                key={queue._id}
                className="rounded-2xl bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {queue.doctor?.name || queue.serviceName}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {queue.doctor?.specialization || queue.serviceName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Queue ID: {queue._id.slice(-6)}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-600">Avg Service Time</span>
                    <span className="font-semibold text-slate-800">
                      {queue.averageServiceTime} min
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-600">Current Token</span>
                    <span className="font-semibold text-slate-800">
                      {queue.currentToken}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-600">Last Issued</span>
                    <span className="font-semibold text-slate-800">
                      {queue.lastIssuedToken ?? 0}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <button
                    onClick={() => handleNextToken(queue._id)}
                    disabled={actionLoading === queue._id}
                    className={`rounded-xl px-4 py-3 font-semibold text-white transition ${
                      actionLoading === queue._id
                        ? "cursor-not-allowed bg-slate-400"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {actionLoading === queue._id
                      ? "Calling..."
                      : "Call Next Patient"}
                  </button>

                  <button
                    onClick={() => handleDeleteQueue(queue._id)}
                    className="rounded-xl bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-600"
                  >
                    Delete Queue
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;