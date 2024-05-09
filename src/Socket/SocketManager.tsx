import { Outlet } from "react-router-dom"
import { useSocket, SocketProvider } from "./SocketProvider"

export const SocketManager: React.FC = () => {

    return (
        <SocketProvider>
            <Outlet/>
        </SocketProvider>
    )
}