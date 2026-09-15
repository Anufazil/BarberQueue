import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { queueSchema } from '../schemas/queueSchema';
import { useJoinQueue } from '../hooks/useJoinQueue';
import { getQueueStatus } from '../api/customerApi';
import QueueSuccessModal from './QueueSuccessModal';
export default function JoinQueueModal({ barber }) {
 const navigate = useNavigate(); const client = useQueryClient();
 const [open, setOpen] = useState(false); const [receipt, setReceipt] = useState(null); const [checking, setChecking] = useState(false);
 const join = useJoinQueue();
 const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(queueSchema), defaultValues: { customerName: '', phone: '' } });
 const begin = async () => {
   const token = localStorage.getItem('queueToken');
   if (!token) { setOpen(true); return; }
   setChecking(true);
   try {
     const result = await getQueueStatus(token);
     if (['WAITING','SERVING'].includes(result.data.status)) navigate('/customer/queue/' + token);
     else { localStorage.removeItem('queueToken'); setOpen(true); }
   } catch (error) {
     if ([400,404].includes(error.response?.status)) { localStorage.removeItem('queueToken'); setOpen(true); }
     else toast.error('Unable to check your queue. Please retry.');
   } finally { setChecking(false); }
 };
 const close = () => { if (!join.isPending) { setOpen(false); reset(); } };
 const submit = values => join.mutate({ ...values, barberId: barber._id }, { onSuccess: response => {
   const { queue, estimatedWait } = response.data;
   localStorage.setItem('queueToken', queue.accessToken); localStorage.setItem('queueDisplayNumber', String(queue.tokenNumber));
   reset(); setOpen(false); setReceipt({ queue, estimatedWait }); client.invalidateQueries({ queryKey: ['customer-home'] });
 } });
 return <><Button className="w-full py-3" onClick={begin} disabled={checking}>{checking ? 'Checking queue…' : localStorage.getItem('queueToken') ? 'View My Queue' : 'Join Queue'}</Button>
 <Modal open={open} onClose={close} title={'Join ' + barber.displayName + "’s queue"}>
 <p className="mb-5 text-slate-600">{barber.queueLength} waiting · Estimated wait {barber.estimatedWait} min</p>
 <form className="space-y-5" onSubmit={handleSubmit(submit)}>
 <Input label="Customer Name" autoComplete="name" {...register('customerName')} error={errors.customerName?.message} />
 <Input label="Phone Number" type="tel" inputMode="numeric" autoComplete="tel" {...register('phone')} error={errors.phone?.message} />
 <Button type="submit" className="w-full" disabled={join.isPending}>{join.isPending ? 'Joining…' : 'Confirm & Join Queue'}</Button>
 <p className="text-xs text-slate-600">Your details are used to manage your queue entry.</p></form></Modal>
 <QueueSuccessModal open={!!receipt} queue={receipt?.queue} estimatedWait={receipt?.estimatedWait} onClose={() => setReceipt(null)} /></>;
}
