import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "../socket";
const RealtimeContext = createContext<any>(null);

export const RealtimeProvider = ({ children }: any) => {
  const [challengeModal, setChallengeModal] = useState<any>(null);
  const [incomingChallenge, setIncomingChallenge] = useState<any>(null);
  const [rejectedChallenge, setRejectedChallenge] = useState<any>(null);

  const companyUser = useSelector((state: any) => state.auth.user);
  useEffect(() => {
    socket.on("challenge-rejected", (data) => {
      setChallengeModal(null);
      setRejectedChallenge({
        open: true,
        challengeId: data?.challengeId || data,
      });
      return () => {
        socket.off("challenge-rejected");
      };
    });
    socket.on("challenge-status-updated", (data) => {
      setChallengeModal({
        open: true,
        challengeId: data.challengeId,
      });
      return () => {
        socket.off("challenge-status-updated");
      };
    });
    socket.on("challenge-received", (challenge) => {
      setIncomingChallenge({ open: true, challenge });
      return () => {
        socket.off("challenge-received");
      };
    });
    return () => {
      socket.off("challenge-status-updated");
    };
  }, []);

  useEffect(() => {
    if (!companyUser?._id) return;

    socket.emit("register-user", companyUser._id);
  }, [companyUser]);
  useEffect(() => {
    socket.on("start-match", ({ challengeId }) => {
      window.location.href = `/company/user/challenge/${challengeId}`;
    });

    return () => {
      socket.off("start-match");
    };
  }, []);
  useEffect(() => {
    socket.on("waiting-for-opponent", (data) => {
      setChallengeModal({
        open: true,
        challengeId: data.challengeId,
        waiting: true,
      });
    });
    return () => {
      socket.off("waiting-for-opponent");
    };
  }, []);

  return (
    <RealtimeContext.Provider
      value={{
        socket,
        challengeModal,
        setChallengeModal,
        incomingChallenge,
        setIncomingChallenge,
        rejectedChallenge,
        setRejectedChallenge,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => useContext(RealtimeContext);
