import { useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";
import type {
  LivePlayer,
  GamePlayerResult,
} from "../../pages/companyUser/ChallengeArea";

interface UseChallengeSocketProps {
  challengeId: string | undefined;
  currentUserId: string | undefined;
  user: any;
  phase: "COUNTDOWN" | "PLAY";
  isFinished: boolean;
  typedText: string;
  wpm: number;
  accuracy: number | null;
  errors: number;
  elapsedTime: number;
  totalLength: number;
  onPlayersUpdate: (
    updater: (prev: LivePlayer[] | null) => LivePlayer[] | null,
  ) => void;
  onGameFinished: (results: GamePlayerResult[]) => void;
}

export function useChallengeSocket({
  challengeId,
  currentUserId,
  user,
  phase,
  isFinished,
  typedText,
  wpm,
  accuracy,
  errors,
  elapsedTime,
  totalLength,
  onPlayersUpdate,
  onGameFinished,
}: UseChallengeSocketProps) {
  const navigate = useNavigate();

  // Join challenge room
  useEffect(() => {
    if (!challengeId || !currentUserId) return;
    socket.emit("challenge-join", {
      challengeId,
      userId: currentUserId,
      name: user.name,
      imageUrl: user.imageUrl,
    });
  }, [challengeId, currentUserId]);

  // Emit live typing progress
  useEffect(() => {
    if (!challengeId || !currentUserId) return;
    if (phase !== "PLAY" || (isFinished && typedText.length !== totalLength))
      return;

    socket.emit("typing-progress-challenge", {
      challengeId: challengeId,
      userId: currentUserId,
      typedLength: typedText.length,
      wpm,
      status: "PLAYING",
      accuracy,
      errors,
      timeTaken: elapsedTime,
    });
  }, [
    typedText,
    wpm,
    accuracy,
    errors,
    phase,
    isFinished,
    elapsedTime,
    challengeId,
    currentUserId,
  ]);

  // Listen for other players' progress
  useEffect(() => {
    const handler = (data: any) => {
      onPlayersUpdate(
        (prev) =>
          prev?.map((p) =>
            p.userId === data.userId
              ? {
                  ...p,
                  ...data,
                  progress:
                    data.status === "FINISHED" ||
                    (totalLength && data.typedLength === totalLength)
                      ? 100
                      : totalLength
                        ? Math.min(
                            100,
                            Math.round((data.typedLength / totalLength) * 100),
                          )
                        : 0,
                }
              : p,
          ) ?? null,
      );
    };
    socket.off("typing-progress-update-challenge");
    socket.on("typing-progress-update-challenge", handler);

    return () => {
      socket.off("typing-progress-update-challenge", handler);
    };
  }, [challengeId, totalLength, onPlayersUpdate]);

  const hasLeftRef = useRef(false);

  const emitLeave = useCallback(() => {
    if (!hasLeftRef.current && challengeId && currentUserId) {
      hasLeftRef.current = true;
      socket.emit("leave-challenge", {
        challengeId,
        userId: currentUserId,
      });
    }
  }, [challengeId, currentUserId]);

  useEffect(() => {
    const handleBeforeUnload = () => emitLeave();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [emitLeave]);

  useEffect(() => {
    const handler = (data: GamePlayerResult[]) => {
      onGameFinished(data);
    };

    socket.off("game-finished-challenge");
    socket.on("game-finished-challenge", handler);

    return () => {
      socket.off("game-finished-challenge", handler);
    };
  }, [challengeId]);
  useEffect(() => {
    const handler = () => {
      navigate("/company/user/challenges");
    };
    socket.on("challenge-already-finished", handler);
    return () => {
      socket.off("challenge-already-finished", handler);
    };
  }, []);
}
