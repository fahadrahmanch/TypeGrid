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

    const containerHeight = container.offsetHeight;
    const elementTop = element.offsetTop;
    const elementHeight = element.offsetHeight;

    // Calculate target scroll position to center the current line
    const targetScrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);

    container.scrollTo({
      top: targetScrollTop,
      behavior: "smooth",
    });
  }, [typedText]);
};
