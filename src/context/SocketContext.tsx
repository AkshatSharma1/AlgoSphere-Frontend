import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ url: string, children: React.ReactNode }> = ({ url, children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socketInstance = io(url);
        setSocket(socketInstance);

        return () => {
            socketInstance.close();
        };
    }, [url]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
