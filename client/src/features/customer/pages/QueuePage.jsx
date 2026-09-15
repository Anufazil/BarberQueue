import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  Ticket,
  Users,
  Scissors,
  Sparkles,
} from "lucide-react";

import Card from "@/components/ui/Card";

const QueuePage = () => {
  const [token, setToken] = useState(
    localStorage.getItem("queueToken")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("queueToken"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center sm:mb-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-200">
          <Ticket className="h-8 w-8 text-white" />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
          <Sparkles className="h-3.5 w-3.5" />
          BarberQueue
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          My Queue
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 sm:text-base">
          Track your current queue and keep an eye on your waiting time.
        </p>
      </div>

      {!token ? (
        /* No Active Queue */
        <Card className="overflow-hidden p-0">
          <div className="px-5 py-12 text-center sm:px-8 sm:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Users className="h-7 w-7 text-slate-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No Active Queue
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You are not currently waiting in a queue. Choose a barber and
              join their queue to get started.
            </p>

            <Link
              to="/customer/barbers"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
            >
              Find a Barber
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-center">
            <p className="text-xs text-slate-500">
              Join a queue remotely and arrive when your turn is approaching.
            </p>
          </div>
        </Card>
      ) : (
        /* Active Queue */
        <Card className="overflow-hidden p-0">
          <div className="px-5 py-10 text-center sm:px-8 sm:py-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
              <Clock3 className="h-8 w-8 text-indigo-600" />
            </div>

            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Queue Active
            </span>

            <h2 className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">
              You have an active queue
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your queue is being tracked. Check your live status below.
            </p>

            {/* Token */}
            <div className="mx-auto mt-7 max-w-sm rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                <Ticket className="h-4 w-4" />
                Your Token
              </div>

              <p className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                #{localStorage.getItem('queueDisplayNumber') || '—'}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Keep this token handy while waiting.
              </p>
            </div>

            <Link
              to={`/customer/queue/${token}`}
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
            >
              View Queue Status
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4">
            <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
              <Scissors className="h-3.5 w-3.5 text-indigo-500" />
              Your queue status updates as the barber serves customers.
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default QueuePage;