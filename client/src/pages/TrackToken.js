import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function TrackToken() {
  const [tokenId, setTokenId] = useState("");
  const [tokenData, setTokenData] = useState(null);
  const [message, setMessage] = useState("");
  const location = useLocation();

  const handleTrack = useCallback(
    async (passedTokenId) => {
      const token = localStorage.getItem("token");
      const finalTokenId = passedTokenId || tokenId;

      if (!finalTokenId) {
        setMessage("Please enter token ID");
        return;
      }

      setMessage("");
      setTokenData(null);

      try {
        const res = await API.get(`/token/status/${finalTokenId}`, {
          headers: {
            Authorization: token,
          },
        });

        setTokenData(res.data);
      } catch (error) {
        console.error(error);
        setMessage("Token not found or failed to fetch status");
      }
    },
    [tokenId]
  );

  useEffect(() => {
    if (location.state?.tokenId) {
      setTokenId(location.state.tokenId);
      handleTrack(location.state.tokenId);
    }
  }, [location.state, handleTrack]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="mx-auto mt-16 max-w-xl rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-slate-800">
          Track My Queue
        </h2>
        <p className="mt-2 text-center text-slate-500">
          Enter your token ID to check queue status
        </p>

        <input
          type="text"
          placeholder="Enter Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="mt-6 w-full rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={() => handleTrack()}
          className="mt-4 w-full rounded-xl bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
        >
          Track Token
        </button>

        {message && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-center text-red-700">
            {message}
          </div>
        )}

        {tokenData && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-yellow-100 p-5 text-center">
              <p className="text-sm text-yellow-700">Your Token Number</p>
              <h3 className="mt-2 text-4xl font-bold text-yellow-900">
                {tokenData.tokenNumber}
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-blue-50 p-5 text-center">
                <p className="text-sm text-blue-600">People Ahead</p>
                <h3 className="mt-2 text-3xl font-bold text-blue-900">
                  {tokenData.peopleAhead}
                </h3>
              </div>

              <div className="rounded-2xl bg-green-50 p-5 text-center">
                <p className="text-sm text-green-600">Estimated Wait</p>
                <h3 className="mt-2 text-3xl font-bold text-green-900">
                  {tokenData.estimatedWait} min
                </h3>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Service Name</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-800">
                {tokenData.serviceName}
              </h3>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Current Serving</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-800">
                {tokenData.currentServing}
              </h3>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Status</p>
              <h3 className="mt-2 text-xl font-semibold capitalize text-slate-800">
                {tokenData.status}
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackToken;