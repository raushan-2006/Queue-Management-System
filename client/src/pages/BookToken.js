import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function BookToken() {
  const [queueId, setQueueId] = useState("");
  const [tokenNumber, setTokenNumber] = useState(null);
  const [tokenId, setTokenId] = useState("");
  const [peopleAhead, setPeopleAhead] = useState(null);
  const [estimatedWait, setEstimatedWait] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertShown, setAlertShown] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.queueId) {
      setQueueId(location.state.queueId);
    }
  }, [location.state]);

  const fetchTokenStatus = useCallback(
    async (id) => {
      const token = localStorage.getItem("token");

      try {
        const res = await API.get(`/token/status/${id}`, {
          headers: {
            Authorization: token,
          },
        });

        setPeopleAhead(res.data.peopleAhead);
        setEstimatedWait(res.data.estimatedWait);

        if (res.data.peopleAhead <= 2 && !alertShown) {
          alert("Your turn is coming soon!");
          setAlertShown(true);
        }
      } catch (error) {
        console.error("Error fetching token status:", error);
      }
    },
    [alertShown]
  );

  const bookToken = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setMessage("");
    setAlertShown(false);

    try {
      const res = await API.post(
        "/token/book",
        { queueId },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const bookedToken = res.data.token;

      setTokenNumber(bookedToken.tokenNumber);
      setTokenId(bookedToken._id);
      setMessage("Token booked successfully 🎉");

      await fetchTokenStatus(bookedToken._id);
    } catch (error) {
      console.error(error);
      setMessage("Booking failed ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tokenId) return;

    const interval = setInterval(() => {
      fetchTokenStatus(tokenId);
    }, 5000);

    return () => clearInterval(interval);
  }, [tokenId, fetchTokenStatus]);

  const progressWidth =
    peopleAhead !== null ? `${Math.max(5, 100 - peopleAhead * 10)}%` : "5%";

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="mx-auto mt-16 max-w-xl px-6">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="text-center text-3xl font-bold text-slate-800">
            Book Token
          </h2>
          <p className="mt-2 text-center text-slate-500">
            Confirm your queue and generate your token
          </p>

          <input
            type="text"
            value={queueId}
            onChange={(e) => setQueueId(e.target.value)}
            placeholder="Enter Queue ID"
            className="mt-6 w-full rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={bookToken}
            disabled={loading}
            className={`mt-4 w-full rounded-xl p-3 font-semibold text-white transition ${
              loading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Booking..." : "Book Token"}
          </button>

          {message && (
            <div className="mt-4 rounded-xl bg-slate-100 p-3 text-center text-slate-700">
              {message}
            </div>
          )}

          {tokenNumber && (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-yellow-100 p-5 text-center">
                <p className="text-sm text-yellow-700">Your Token Number</p>
                <h3 className="mt-2 text-4xl font-bold text-yellow-900">
                  {tokenNumber}
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-blue-50 p-5 text-center">
                  <p className="text-sm text-blue-600">People Ahead</p>
                  <h3 className="mt-2 text-3xl font-bold text-blue-900">
                    {peopleAhead ?? "--"}
                  </h3>
                </div>

                <div className="rounded-2xl bg-green-50 p-5 text-center">
                  <p className="text-sm text-green-600">Estimated Wait</p>
                  <h3 className="mt-2 text-3xl font-bold text-green-900">
                    {estimatedWait ?? "--"} min
                  </h3>
                </div>
              </div>

              <div className="mt-6">
                <div className="h-3 w-full rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: progressWidth }}
                  ></div>
                </div>
                <p className="mt-2 text-center text-sm text-slate-500">
                  Queue Progress
                </p>
              </div>

              {peopleAhead !== null && peopleAhead <= 2 && (
                <div className="rounded-xl bg-red-50 p-4 text-center text-sm font-medium text-red-700">
                  Your turn is near. Please stay ready.
                </div>
              )}

              {tokenId && (
                <div className="rounded-xl bg-slate-50 p-3 text-center text-sm text-slate-500">
                  Token ID: {tokenId}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookToken;