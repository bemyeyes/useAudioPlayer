import { Dispatch, ReducerAction, ReducerState } from "react";
import { Action, AudioPlayerState, reducer } from "./audioPlayerState";
import { HowlInstanceManager } from "./HowlInstanceManager";
export declare function useHowlEventSync(howlManager: HowlInstanceManager, [state, dispatch]: [AudioPlayerState, Dispatch<Action>]): [ReducerState<typeof reducer>, Dispatch<ReducerAction<typeof reducer>>];
