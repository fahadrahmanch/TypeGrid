import { useEffect } from "react";

interface Props {
  activeCharRef: React.RefObject<HTMLSpanElement | null>;
  snippetContainerRef: React.RefObject<HTMLDivElement | null>;
  typedText: string;
}

export const useTypingScroll = ({ activeCharRef, snippetContainerRef, typedText }: Props) => {
  useEffect(() => {
    if (!activeCharRef.current || !snippetContainerRef.current) return;

    const container = snippetContainerRef.current;
    const element = activeCharRef.current;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const relativeTop = elementRect.top - containerRect.top;
    const relativeBottom = elementRect.bottom - containerRect.top;

    if (relativeBottom > containerRect.height / 2 || relativeTop < containerRect.height / 3) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [typedText]);
};
