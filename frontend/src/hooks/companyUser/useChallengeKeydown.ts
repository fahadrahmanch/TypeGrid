import { useEffect } from "react";
import { socket } from "../../socket";

interface UseChallengeKeydownProps {
    lessonText: string | undefined;
    challengeId: string | undefined;
    currentUserId: string | undefined;
    currentUserName: string | undefined;
    currentUserImageUrl: string | undefined;
    isFinished: boolean;
    phase: "COUNTDOWN" | "PLAY";
    hasError: boolean;
    typedText: string;
    elapsedTime: number;
    wpm: number;
    accuracy: number | null;
    errors: number;
    totalTyped: number;
    setHasError: (v: boolean) => void;
    setTypedText: React.Dispatch<React.SetStateAction<string>>;
    setTotalTyped: React.Dispatch<React.SetStateAction<number>>;
    setErrors: React.Dispatch<React.SetStateAction<number>>;
    setIsFinished: (v: boolean) => void;
}

export function useChallengeKeydown({
    lessonText,
    challengeId,
    currentUserId,
    currentUserName,
    currentUserImageUrl,
    isFinished,
    phase,
    hasError,
    typedText,
    elapsedTime,
    wpm,
    accuracy,
    errors,
    totalTyped,
    setHasError,
    setTypedText,
    setTotalTyped,
    setErrors,
    setIsFinished,
}: UseChallengeKeydownProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lessonText || isFinished || phase !== "PLAY") return;

            if (e.key === "Backspace") {
                setHasError(false);
                setTypedText((prev) => prev.slice(0, -1));
                return;
            }

            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();

                if (hasError) return;

                const expectedChar = lessonText[typedText.length];
                setTotalTyped((prev) => prev + 1);

                if (e.key !== expectedChar) {
                    setErrors((prev) => prev + 1);
                    setHasError(true);
                    setTypedText((prev) => prev + e.key);
                    return;
                }

                const nextText = typedText + e.key;
                setTypedText(nextText);

                if (nextText.length === lessonText.length) {
                    setIsFinished(true);
    
                    socket.emit("player-finished-challenge", {
                        challengeId,
                        userId: currentUserId,
                        name: currentUserName,
                        imageUrl: currentUserImageUrl,
                        timeTaken: elapsedTime,
                        wpm,
                        accuracy,
                        errors,
                        typedLength: nextText.length,
                        totalTyped,
                        status: "FINISHED",
                    });
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lessonText, isFinished, typedText, phase, hasError, challengeId]);
}