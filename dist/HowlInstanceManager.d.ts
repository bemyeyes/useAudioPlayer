import { Howl } from "howler";
import { AudioLoadOptions } from "./types";
import { Action } from "./audioPlayerState";
export type AudioActionCallback = (action: Action) => void;
export declare class HowlInstanceManager {
    private callbacks;
    private howl;
    private options;
    private subscriptionIndex;
    subscribe(cb: AudioActionCallback): string;
    unsubscribe(subscriptionId: string): void;
    getHowl(): Howl | undefined;
    getNumberOfConnections(): number;
    createHowl(options: {
        src: string;
    } & AudioLoadOptions): Howl;
    destroyHowl(): void;
    broadcast(action: Action): void;
}
export declare class HowlInstanceManagerSingleton {
    private static instance;
    static getInstance(): HowlInstanceManager;
}
