import { useState, useEffect } from 'react';

/**
 * Custom hook to manage WebSocket connections.
 * @param {string} url - The WebSocket URL.
 * @param {function} onMessage - The callback function to handle incoming messages.
 * @returns {WebSocket | null} - The WebSocket instance.
 */
const useWebSocket = (url, onMessage) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket(url);
    ws.onmessage = onMessage;
    setSocket(ws);

    // Cleanup on component unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [url, onMessage]);

  return socket;
};

export default useWebSocket;
