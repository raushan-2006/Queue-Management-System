import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchQueues = async () => {
    try {
      const res = await API.get("/queue");
      setQueues(res.data.queues || []);
    } catch (error) {
      console.error("Error fetching queues:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  const handleBook = (queueId) => {
    navigate("/book", { state: { queueId } });
  };

  const avgServiceTime =
    queues.length > 0
      ? Math.round(
          queues.reduce((sum, queue) => sum + queue.averageServiceTime, 0) /
            queues.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">
            Available Doctors
          </h1>
          <p className="mt-2 text-slate-600">
            Choose a doctor and book your appointment token instantly.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-md">
            <p className="text-sm text-slate-500">Total Doctor Queues</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {queues.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-md">
            <p className="text-sm text-slate-500">Active Doctors</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {queues.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-md">
            <p className="text-sm text-slate-500">Avg Service Time</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {avgServiceTime} min
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-slate-600">Loading doctors...</p>
          </div>
        ) : queues.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-slate-600">No doctor queues available right now.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {queues.map((queue) => (
              <div
                key={queue._id}
                className="rounded-2xl bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
                      🩺
                    </div>

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
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Available
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-600">
                      Avg Service Time
                    </span>
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
                </div>

                <button
                  onClick={() => handleBook(queue._id)}
                  className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;