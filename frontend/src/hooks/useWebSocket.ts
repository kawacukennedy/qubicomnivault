import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNotificationStore } from '../stores/notificationStore';

export const useWebSocket = (url: string) => {
  const socket = useRef<Socket | null>(null);
  const { addToast } = useNotificationStore();

  useEffect(() => {
    socket.current = io(url);

    socket.current.on('connect', () => {
      console.log('Socket connected');
    });

    socket.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.current.on('notification', (data) => {
      addToast({ message: data.message, type: data.type || 'info' });
    });

    socket.current.on('portfolio-update', (data) => {
      // Handle portfolio update
      console.log('Portfolio update:', data);
    });

    socket.current.on('loan-update', (data) => {
      // Handle loan update
      console.log('Loan update:', data);
    });

    socket.current.on('valuation-update', (data) => {
      // Handle valuation update
      console.log('Valuation update:', data);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [url, addToast]);

  const joinUserRoom = (userId: string) => {
    socket.current?.emit('join-user-room', { userId });
  };

  const joinValuationRoom = (jobId: string) => {
    socket.current?.emit('join-valuation-room', { jobId });
  };

  const sendMessage = (event: string, data: unknown) => {
    socket.current?.emit(event, data);
  };

  return { joinUserRoom, joinValuationRoom, sendMessage };
};