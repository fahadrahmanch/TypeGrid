import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "../socket";
const RealtimeContext = createContext<any>(null);

export const RealtimeProvider = ({ children }: any) => {

    const [challengeModal, setChallengeModal] = useState<any>(null);

    const companyUser = useSelector((state: any) => state.companyAuth.user);
    useEffect(() => {

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });

        socket.on("challenge-status-updated", (data) => {


            setChallengeModal({
                open: true,
                challengeId: data.challengeId
            });

        });

        return () => {
            socket.off("challenge-status-updated");
        };

    }, []);

    useEffect(() => {

        if (!companyUser?._id) return;

        socket.emit("register-user", companyUser._id);

    }, [companyUser]);
  

    return (
        <RealtimeContext.Provider value={{ socket, challengeModal, setChallengeModal }}>
            {children}
        </RealtimeContext.Provider>
    );
};

export const useRealtime = () => useContext(RealtimeContext);