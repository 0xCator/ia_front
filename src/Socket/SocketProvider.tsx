import React, { createContext, useContext, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { WebSocketHook } from 'react-use-websocket/dist/lib/types';
import { getUserData } from '../Services/userData';
import { websocketPath } from '../Services/constants';

const WebSocketContext = createContext<WebSocketHook | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const nameid = getUserData()?.user.nameid;
    const socket = useWebSocket(websocketPath(nameid!));
    if (socket.readyState === 1) {
        console.log('Connected to WebSocket, ID is:', nameid);
    }

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useSocket = () => useContext(WebSocketContext);
