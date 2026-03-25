import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Home() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchQueues();
  }, []);

  const stats = useMemo(() => {
    if (queues.length === 0) {
      return {
        currentToken: "--",
        totalQueues: 0,
        avgWait: 0,
        doctorName: "No active queues",
      };
    }

    const firstQueue = queues[0];
    const avgWait = Math.round(
      queues.reduce((sum, queue) => sum + (queue.averageServiceTime || 0), 0) /
        queues.length
    );

    return {
      currentToken: firstQueue.currentToken ?? 0,
      totalQueues: queues.length,
      avgWait,
      doctorName:
        firstQueue.doctor?.name ||
        firstQueue.serviceName ||
        "Active Service Queue",
    };
  }, [queues]);

  const features = [
    {
      icon: "🎟️",
      title: "Book Tokens Online",
      desc: "Skip physical lines. Get your queue token from anywhere.",
    },
    {
      icon: "⏱️",
      title: "Live Queue Tracking",
      desc: "Real-time position updates with estimated wait times.",
    },
    {
      icon: "🔔",
      title: "Notifications",
      desc: "Get alerted when your turn is approaching.",
    },
    {
      icon: "📊",
      title: "Admin Analytics",
      desc: "Monitor queue performance with real-time dashboards.",
    },
  ];

  const steps = [
    {
      no: "1",
      title: "Choose a Service",
      desc: "Select from available doctor or service queues.",
    },
    {
      no: "2",
      title: "Get Your Token",
      desc: "Receive a digital token instantly after booking.",
    },
    {
      no: "3",
      title: "Track & Arrive",
      desc: "Monitor live progress and arrive at the right time.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Smart Queue Management
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-900">
              Manage queues without the waiting chaos
            </h1>

            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Book tokens online, track your live queue position, and reduce
              crowding with a fast, modern queue management system.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/dashboard"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow hover:bg-blue-700"
              >
                Get Started
              </Link>

              <Link
                to="/queue-status"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Live Queue
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            {loading ? (
              <div className="grid gap-4">
                <div className="rounded-2xl bg-slate-100 p-5">
                  <p className="text-sm text-slate-500">Loading live data...</p>
                  <h3 className="mt-2 text-3xl font-bold text-slate-700">
                    Please wait
                  </h3>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                <div className="rounded-2xl bg-blue-50 p-5">
                  <p className="text-sm text-blue-600">Now Serving</p>
                  <h3 className="mt-2 text-4xl font-bold text-blue-900">
                    {stats.currentToken}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {stats.doctorName}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-100 p-5">
                    <p className="text-sm text-slate-500">Active Queues</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {stats.totalQueues}
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-slate-100 p-5">
                    <p className="text-sm text-slate-500">Avg Wait</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      {stats.avgWait} min
                    </h3>
                  </div>
                </div>

                <div className="rounded-2xl bg-green-50 p-5">
                  <p className="text-sm text-green-700">
                    Live queue data is being fetched from the backend in real
                    time.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900">Key Features</h2>
          <p className="mt-3 text-slate-600">
            Everything needed to make queue handling smarter and faster.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-3xl bg-white p-7 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-900">How It Works</h2>
            <p className="mt-3 text-slate-600">
              A simple 3-step flow for users.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="rounded-3xl bg-white p-8 text-center shadow-md"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                  {step.no}
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl bg-slate-900 px-8 py-12 text-center text-white shadow-lg">
          <h2 className="text-4xl font-bold">Ready to modernize your queue?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Start using digital tokens, live updates, and smart queue tracking
            for a better customer experience.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="rounded-xl border border-slate-600 px-6 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;