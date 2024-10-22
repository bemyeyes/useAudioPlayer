/// <reference types="howler" />
import { MutableRefObject } from "react";
import { HowlInstanceManager } from "./HowlInstanceManager";
import { AudioPlayer } from "./types";
export declare const useAudioPlayer: () => AudioPlayer & {
    cleanup: VoidFunction;
    howlManager: MutableRefObject<HowlInstanceManager | null>;
    howlerGlobal: MutableRefObject<HowlerGlobal | null>;
};
