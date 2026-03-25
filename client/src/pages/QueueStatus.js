import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import socket from "../services/socket";
import API from "../services/api";

function QueueStatus() {
  const [token, setToken] = useState("--");
  const [queueId, setQueueId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialQueue = async () => {
      try {
        const res = await API.get("/queue");
        const queues = res.data.queues || [];

        if (queues.length > 0) {
          // you can change this if you want a specific queue
          setToken(queues[0].currentToken ?? "--");
          setQueueId(queues[0]._id ?? "");
        }
      } catch (error) {
        console.error("Failed to fetch initial queue data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialQueue();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("queueUpdated", (data) => {
      console.log("queueUpdated received:", data);
      setToken(data.tokenNumber);
      setQueueId(data.queueId);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("queueUpdated");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg">
          <h2 className="mb-4 text-2xl font-bold">Live Queue Status</h2>
          <p className="mb-6 text-gray-500">
            Track the currently served token in real time
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-blue-100 p-6">
              <p className="text-blue-600">Now Serving</p>
              <h1 className="text-4xl font-bold text-blue-800">
                {loading ? "..." : token}
              </h1>
            </div>

            <div className="rounded-xl bg-gray-100 p-6">
              <p className="text-gray-600">Queue ID</p>
              <h2 className="break-all text-lg font-semibold">
                {loading ? "Loading..." : queueId || "Waiting..."}
              </h2>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-green-100 p-3 text-green-700">
            Live updates enabled 🚀
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueueStatus;