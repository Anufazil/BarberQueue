import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket, connectSocket, disconnectSocket } from '@/lib/socket';
import { useAuth } from './AuthContext';
const keys = ['dashboard','barbers','barber-dashboard','admin-queue','admin-statistics'];
export function SocketProvider({ children }) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!token) return;
    const refresh = () => keys.forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
    socket.on('connect', refresh);
    socket.on('QUEUE_UPDATED', refresh);
    socket.on('BARBER_STATUS_CHANGED', refresh);
    socket.on('DASHBOARD_UPDATED', refresh);
    connectSocket(token);
    return () => {
      socket.off('connect', refresh); socket.off('QUEUE_UPDATED', refresh);
      socket.off('BARBER_STATUS_CHANGED', refresh); socket.off('DASHBOARD_UPDATED', refresh);
      disconnectSocket();
    };
  }, [token, queryClient]);
  return children;
}
