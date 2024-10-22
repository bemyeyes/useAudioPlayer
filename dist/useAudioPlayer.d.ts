import { HowlInstanceManager } from "./HowlInstanceManager";
import { AudioPlayer } from "./types";
export declare const useAudioPlayer: () => AudioPlayer & {
    cleanup: VoidFunction;
    getHowlManager: () => HowlInstanceManager;
};
