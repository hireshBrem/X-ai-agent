import { EventType, IncrementalSource } from '../../../types/dist/types.js';

class Timer {
    constructor(actions = [], config) {
        this.timeOffset = 0;
        this.raf = null;
        this.actions = actions;
        this.speed = config.speed;
        this.liveMode = config.liveMode;
    }
    addAction(action) {
        if (!this.actions.length ||
            this.actions[this.actions.length - 1].delay <= action.delay) {
            this.actions.push(action);
            return;
        }
        const index = this.findActionIndex(action);
        this.actions.splice(index, 0, action);
    }
    start() {
        this.timeOffset = 0;
        let lastTimestamp = performance.now();
        const check = () => {
            const time = performance.now();
            this.timeOffset += (time - lastTimestamp) * this.speed;
            lastTimestamp = time;
            while (this.actions.length) {
                const action = this.actions[0];
                if (this.timeOffset >= action.delay) {
                    this.actions.shift();
                    action.doAction();
                }
                else {
                    break;
                }
            }
            if (this.actions.length > 0 || this.liveMode) {
                this.raf = requestAnimationFrame(check);
            }
        };
        this.raf = requestAnimationFrame(check);
    }
    clear() {
        if (this.raf) {
            cancelAnimationFrame(this.raf);
            this.raf = null;
        }
        this.actions.length = 0;
    }
    setSpeed(speed) {
        this.speed = speed;
    }
    toggleLiveMode(mode) {
        this.liveMode = mode;
    }
    isActive() {
        return this.raf !== null;
    }
    findActionIndex(action) {
        let start = 0;
        let end = this.actions.length - 1;
        while (start <= end) {
            const mid = Math.floor((start + end) / 2);
            if (this.actions[mid].delay < action.delay) {
                start = mid + 1;
            }
            else if (this.actions[mid].delay > action.delay) {
                end = mid - 1;
            }
            else {
                return mid + 1;
            }
        }
        return start;
    }
}
function addDelay(event, baselineTime) {
    if (event.type === EventType.IncrementalSnapshot &&
        event.data.source === IncrementalSource.MouseMove &&
        event.data.positions &&
        event.data.positions.length) {
        const firstOffset = event.data.positions[0].timeOffset;
        const firstTimestamp = event.timestamp + firstOffset;
        event.delay = firstTimestamp - baselineTime;
        return firstTimestamp - baselineTime;
    }
    event.delay = event.timestamp - baselineTime;
    return event.delay;
}

export { Timer, addDelay };
