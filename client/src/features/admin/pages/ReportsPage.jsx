import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import Card from '@/components/ui/Card';
export default function ReportsPage() {
 const { data, isPending, error } = useQuery({ queryKey: ['admin-statistics'], queryFn: async () => (await api.get('/admin/statistics')).data.data, refetchInterval: 15000 });
 if (isPending) return <p role="status">Loading reports…</p>;
 if (error) return <p role="alert">Unable to load reports. Please refresh.</p>;
 return <div className="space-y-6"><h1 className="text-3xl font-bold">Reports</h1><p>Today's figures use UTC. Queue totals and performance cover all recorded history.</p>
 {Object.entries(data).map(([group, values]) => <section key={group}><h2 className="mb-3 text-xl font-semibold capitalize">{group.replace(/([A-Z])/g, ' $1')}</h2><div className="grid gap-4 sm:grid-cols-3">{Object.entries(values).map(([label,value]) => <Card key={label}><p className="capitalize">{label.replace(/([A-Z])/g, ' $1')}</p><p className="mt-2 text-3xl font-bold">{value}{label.includes('Rate') ? '%' : label === 'averageServiceTime' ? ' min' : ''}</p></Card>)}</div></section>)}</div>;
}
