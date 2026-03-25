import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function DoctorDashboard() {
  const [queues, setQueues] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDoctorQueues();
  }, []);

  const fetchDoctorQueues = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await API.get("/queue");
      const ownQueues = (res.data.queues || []).filter(
        (queue) => queue.doctor?._id === user._id
      );
      setQueues(ownQueues);
    } catch (error) {
      console.error(error);
    }
  };

  const callNext = async (queueId) => {
    const token = localStorage.getItem("token");

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

      setMessage(`Now calling token ${res.data.token.tokenNumber}`);
      fetchDoctorQueues();
    } catch (error) {
      console.error(error);
      setMessage("Failed to call next patient");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-4xl font-bold text-slate-800">Doctor Dashboard</h1>
        <p className="mt-2 text-slate-600">Manage your patient queue.</p>

        {message && (
          <div className="mt-4 rounded-xl bg-white p-4 shadow">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {queues.map((queue) => (
            <div key={queue._id} className="rounded-2xl bg-white p-6 shadow-md">
              <h3 className="text-2xl font-bold text-slate-900">
                {queue.serviceName}
              </h3>
              <p className="mt-2 text-slate-600">
                Current Token: {queue.currentToken}
              </p>
              <p className="mt-1 text-slate-600">
                Last Issued: {queue.lastIssuedToken}
              </p>

              <button
                onClick={() => callNext(queue._id)}
                className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Call Next Patient
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;