import { useSyncExternalStore } from 'react';
import { socket } from '@/lib/socket';
const subscribe = callback => {
 socket.on('connect', callback); socket.on('disconnect', callback); socket.on('connect_error', callback);
 return () => { socket.off('connect', callback); socket.off('disconnect', callback); socket.off('connect_error', callback); };
};
export default function ConnectionStatus() {
 const connected = useSyncExternalStore(subscribe, () => socket.connected);
 return <span role="status" className={'rounded-full border px-3 py-2 text-sm ' + (connected ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800')}>{connected ? 'Live updates connected' : 'Polling · reconnecting'}</span>;
}
