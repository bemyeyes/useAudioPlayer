import { Howl } from "howler";
export declare enum ActionTypes {
    START_LOAD = "START_LOAD",
    ON_LOAD = "ON_LOAD",
    ON_ERROR = "ON_ERROR",
    ON_PLAY = "ON_PLAY",
    ON_PAUSE = "ON_PAUSE",
    ON_STOP = "ON_STOP",
    ON_END = "ON_END",
    ON_RATE = "ON_RATE",
    ON_MUTE = "ON_MUTE",
    ON_VOLUME = "ON_VOLUME",
    ON_LOOP = "ON_LOOP"
}
export type StartLoadAction = {
    type: ActionTypes.START_LOAD;
    linkMediaSession?: boolean;
    howl: Howl;
};
export type AudioEventAction = {
    type: Exclude<ActionTypes, ActionTypes.START_LOAD | ActionTypes.ON_ERROR>;
    howl: Howl;
    toggleValue?: boolean;
    debugId?: string;
};
export type ErrorEvent = {
    type: ActionTypes.ON_ERROR;
    message: string;
};
export type Action = StartLoadAction | AudioEventAction | ErrorEvent;
export interface AudioPlayerState {
    src: string | null;
    looping: boolean;
    isReady: boolean;
    isLoading: boolean;
    paused: boolean;
    stopped: boolean;
    playing: boolean;
    duration: number;
    muted: boolean;
    rate: number;
    volume: number;
    error: string | null;
}
export declare function initStateFromHowl(howl?: Howl): AudioPlayerState;
export declare function reducer(state: AudioPlayerState, action: Action): AudioPlayerState;
