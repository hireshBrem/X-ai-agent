import { actionWithDelay, eventWithTime } from '@rrweb/types';
export declare class Timer {
    timeOffset: number;
    speed: number;
    private actions;
    private raf;
    private liveMode;
    constructor(actions: actionWithDelay[] | undefined, config: {
        speed: number;
        liveMode: boolean;
    });
    addAction(action: actionWithDelay): void;
    start(): void;
    clear(): void;
    setSpeed(speed: number): void;
    toggleLiveMode(mode: boolean): void;
    isActive(): boolean;
    private findActionIndex;
}
export declare function addDelay(event: eventWithTime, baselineTime: number): number;
