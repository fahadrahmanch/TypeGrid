// hooks/useChallengeSocket.ts
import { useEffect } from "react";
import { socket } from "../../socket";

export const useMyChallengeSocket = (
  setChallenges: React.Dispatch<React.SetStateAction<any[]>>
) => {
  useEffect(() => {
    const onChallengeReceived = (challenge: any) => {
      setChallenges((prev) => {
        const alreadyExists = prev.find((c) => c.id === challenge.id);
        if (alreadyExists) return prev;
        return [challenge, ...prev];
      });
    };

    const onStatusUpdated = (data: any) => {
      setChallenges((prev) =>
        prev.map((c) =>
          c.id === data.challengeId ? { ...c, status: "accepted" } : c
        )
      );
    };

    socket.on("challenge-received", onChallengeReceived);
    socket.on("challenge-status-updated", onStatusUpdated);

    return () => {
      socket.off("challenge-received", onChallengeReceived);
      socket.off("challenge-status-updated", onStatusUpdated);
    };
  }, []);
};