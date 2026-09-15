import { useCancelQueue } from '../hooks/useCancelQueue';
import { Link } from 'react-router-dom';
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import QueueStatusCard from "../components/QueueStatusCard";
import { useQueueStatus } from "../hooks/useQueueStatus";
import { socket } from "@/lib/socket";
import SOCKET_EVENTS from "@/constants/socketEvents";

const QueueStatusPage = () => {
  const cancel = useCancelQueue();
  const { token } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQueueStatus(token);

  // Real-time queue updates
  useEffect(() => {
    if (!token) return;

    const handleQueueUpdated = () => {
      queryClient.invalidateQueries({
        queryKey: ["queue-status", token],
      });
    };

    socket.on(
      SOCKET_EVENTS.QUEUE_UPDATED,
      handleQueueUpdated
    );

    return () => {
      socket.off(
        SOCKET_EVENTS.QUEUE_UPDATED,
        handleQueueUpdated
      );
    };
  }, [token, queryClient]);

  // Remove invalid / expired queue token
  useEffect(() => {
    if (!isError) return;

    const status = error?.response?.status;

    if (status === 404 || status === 400) {
      const savedToken = localStorage.getItem("queueToken");

      if (savedToken === String(token)) {
        localStorage.removeItem("queueToken");
      }


    }
  }, [isError, error, token, navigate]);

  // Remove token after queue completion/cancellation
  useEffect(() => {
    if (!data?.data) return;

    const status = data.data.status;

    if (
      status === "COMPLETED" ||
      ["CANCELLED", "SKIPPED", "NO_SHOW"].includes(status)
    ) {
      const savedToken = localStorage.getItem("queueToken");

      if (savedToken === String(token)) {
        localStorage.removeItem("queueToken");
      }
    }
  }, [data, token]);

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[500px] max-w-4xl items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-900">
            Loading your queue
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Getting the latest queue status...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="mx-auto flex min-h-[500px] max-w-4xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
            <AlertCircle className="h-7 w-7 text-red-600" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Unable to load queue
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error?.response?.data?.message || 'Could not reach the server. Please retry.'}
          </p>

          <button type="button" className="mt-4 rounded-xl border px-5 py-3" onClick={() => window.location.reload()}>Retry</button>
          <button
            type="button"
            onClick={() => navigate("/customer/barbers")}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Find a Barber
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <QueueStatusCard queue={data?.data} />
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {data?.data?.status === 'WAITING' && <button className="rounded-xl bg-red-600 px-5 py-3 text-white" disabled={cancel.isPending} onClick={() => { if (window.confirm('Cancel your queue entry?')) cancel.mutate(token); }}>{cancel.isPending ? 'Cancelling…' : 'Cancel Queue'}</button>}
        <Link className="rounded-xl border px-5 py-3" to="/customer/barbers">Browse Barbers</Link>
      </div>
    </div>
  );
};

export default QueueStatusPage;