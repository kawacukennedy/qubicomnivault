import { useEffect, useRef } from 'react';
import { useNotificationStore } from '../stores/notificationStore';

export const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null);
  const { addToast } = useNotificationStore();

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle different event types
      if (data.type === 'liquidation') {
        addToast({ message: 'Liquidation alert!', type: 'warning' });
      } else if (data.type === 'price_update') {
        // Update portfolio
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current?.close();
    };
  }, [url, addToast]);

  const sendMessage = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { sendMessage };
};