import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await API.get("/auth/profile", {
          headers: {
            Authorization: token,
          },
        });

        setUser(res.data.user);
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleTrackToken = (tokenId) => {
    navigate("/track-token", { state: { tokenId } });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="mx-auto mt-16 max-w-6xl px-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-800">My Profile</h2>
              <p className="mt-1 text-slate-500">View your account details and orders</p>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-500">Loading profile...</p>
          ) : user ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Full Name</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-800">
                    {user.name}
                  </h3>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Email</p>
                  <h3 className="mt-2 break-all text-xl font-semibold text-slate-800">
                    {user.email}
                  </h3>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Mobile Number</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-800">
                    {user.mobile}
                  </h3>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Role</p>
                  <h3 className="mt-2 text-xl font-semibold capitalize text-slate-800">
                    {user.role}
                  </h3>
                </div>
              </div>

              <div className="mt-10">
                <div className="mb-5">
                  <h3 className="text-2xl font-bold text-slate-800">My Orders</h3>
                  <p className="mt-1 text-slate-500">
                    Your booked queue tokens and details
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-5 text-slate-600">
                    No orders found.
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="rounded-2xl bg-slate-50 p-5 shadow-sm"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="text-lg font-bold text-slate-800">
                            {order.queue?.serviceName || "Queue"}
                          </h4>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              order.status === "served"
                                ? "bg-green-100 text-green-700"
                                : order.status === "waiting"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm text-slate-700">
                          <p>
                            <span className="font-semibold">Token Number:</span>{" "}
                            {order.tokenNumber}
                          </p>
                          <p className="break-all">
                            <span className="font-semibold">Token ID:</span>{" "}
                            {order._id}
                          </p>
                          <p className="break-all">
                            <span className="font-semibold">Queue ID:</span>{" "}
                            {order.queue?._id}
                          </p>
                          <p>
                            <span className="font-semibold">Booked On:</span>{" "}
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <button
                          onClick={() => handleTrackToken(order._id)}
                          className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                          Track This Token
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-red-50 p-4 text-red-700">
              Unable to load profile data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;