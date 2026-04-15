import { useSelector } from "react-redux";

export type KeyboardLayoutType = "qwerty" | "azerty" | "dvorak";

type LayoutMap = {
    [key: string]: string;
};

type Layouts = {
    [key in KeyboardLayoutType]: LayoutMap;
};

export const layoutMaps: Layouts = {
    qwerty: {
        q: "q", w: "w", e: "e", r: "r", t: "t", y: "y",
        a: "a", s: "s", d: "d", f: "f",
        z: "z", x: "x", c: "c"
    },

    azerty: {
        q: "a", w: "z", e: "e", r: "r", t: "t", y: "y",
        a: "q", s: "s", d: "d", f: "f",
        z: "w", x: "x", c: "c"
    },

    dvorak: {
        q: "'", w: ",", e: ".", r: "p", t: "y", y: "f",
        a: "a", s: "o", d: "e", f: "u",
        z: ";", x: "q", c: "j"
    }
}; 
export function getMappedKey(
    key: string,
    layout: KeyboardLayoutType
) {
    console.log("layout",layout);
    if (!layout || layout === "qwerty") {
        return key;
    }
    const isUpperCase = key === key.toUpperCase();

    const lowerKey = key.toLowerCase();
    console.log("key mapped item",layoutMaps[layout][lowerKey] )
    const mapped = layoutMaps[layout][lowerKey] || lowerKey;

    return isUpperCase ? mapped.toUpperCase() : mapped;
}