import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useBarbers } from '../hooks/useBarbers';
import api from '@/lib/axios';
import CurrentCustomerCard from '@/features/barber/components/CurrentCustomerCard';
import WaitingQueueTable from '@/features/barber/components/WaitingQueueTable';
import BarberStatusControl from '@/features/barber/components/BarberStatusControl';
import QueueAnalyticsCard from '@/features/barber/components/QueueAnalyticsCard';
export default function QueueManagement() {
 const [params, setParams] = useSearchParams();
 const barbers = useBarbers();
 const id = params.get('barber') || barbers.data?.barbers?.[0]?._id;
 const queue = useQuery({ queryKey: ['admin-queue', id], enabled: !!id, refetchInterval: 15000,
  queryFn: async () => { const [q,a] = await Promise.all([api.get('/queue/' + id), api.get('/queue/' + id + '/analytics')]); return { ...q.data.data, analytics: a.data.data }; } });
 return <div className="space-y-6"><h1 className="text-3xl font-bold">Barber Details & Queues</h1>
 <label className="block">Select barber<select className="ml-3 max-w-full rounded-lg border p-3" value={id || ''} onChange={e => setParams({ barber: e.target.value })}>{barbers.data?.barbers?.map(b => <option key={b._id} value={b._id}>{b.displayName}{!b.isActive ? ' (Inactive)' : ''}</option>)}</select></label>
 {barbers.isPending && <p role="status">Loading barbers…</p>}{barbers.error && <p role="alert">Unable to load barbers.</p>}
 {!barbers.isPending && !barbers.error && !id && <p>No barbers yet. Create one in Barber Management.</p>}
 {id && queue.isPending && <p role="status">Loading queue…</p>}{queue.error && <p role="alert">Unable to load queue.</p>}
 {queue.data && <><p>{queue.data.barber.user?.name} · {queue.data.barber.user?.email} · Chair {queue.data.barber.chairNumber} · {queue.data.barber.phone || 'No phone'} · {queue.data.barber.experience} years</p><p>{queue.data.barber.specialization}</p>
 {queue.data.barber.isActive && <BarberStatusControl barber={queue.data.barber} />}
 <div className="grid gap-6 lg:grid-cols-2"><CurrentCustomerCard customer={queue.data.currentCustomer} barberId={id} /><QueueAnalyticsCard analytics={queue.data.analytics} /></div><WaitingQueueTable queue={queue.data.waitingQueue} /></>}
 </div>;
}
