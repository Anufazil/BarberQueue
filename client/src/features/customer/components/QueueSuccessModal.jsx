import { Link } from 'react-router-dom';
import Modal from '@/components/ui/Modal';
export default function QueueSuccessModal({ open, queue, estimatedWait, onClose }) {
 return <Modal open={open} onClose={onClose} title="Queue Joined!">
 <div className="space-y-6 text-center"><p>Your place has been reserved.</p><div className="rounded-2xl bg-indigo-50 p-6"><p>Your Token</p><p className="mt-2 text-5xl font-bold text-indigo-700">#{queue?.tokenNumber}</p></div>
 <p>Estimated wait: <strong>{estimatedWait ?? 0} minutes</strong></p>
 <Link to={'/customer/queue/' + queue?.accessToken} onClick={onClose} className="block rounded-xl bg-indigo-600 p-3 font-semibold text-white">View Queue Status</Link>
 <button className="rounded-xl border p-3" onClick={onClose}>Continue Browsing</button>
 <p className="text-xs text-slate-600">Keep your queue link private. It allows access to your status and cancellation.</p></div></Modal>;
}
