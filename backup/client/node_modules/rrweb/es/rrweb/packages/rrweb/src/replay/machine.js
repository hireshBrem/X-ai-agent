import { interpret as v, createMachine as s, assign as o } from './../../../../ext/@xstate/fsm/es/index.js';
import { EventType, IncrementalSource, ReplayerEvents } from '../../../types/dist/types.js';
import { addDelay } from './timer.js';

function discardPriorSnapshots(events, baselineTime) {
    for (let idx = events.length - 1; idx >= 0; idx--) {
        const event = events[idx];
        if (event.type === EventType.Meta) {
            if (event.timestamp <= baselineTime) {
                return events.slice(idx);
            }
        }
    }
    return events;
}
function createPlayerService(context, { getCastFn, applyEventsSynchronously, emitter }) {
    const playerMachine = s({
        id: 'player',
        context,
        initial: 'paused',
        states: {
            playing: {
                on: {
                    PAUSE: {
                        target: 'paused',
                        actions: ['pause'],
                    },
                    CAST_EVENT: {
                        target: 'playing',
                        actions: 'castEvent',
                    },
                    END: {
                        target: 'paused',
                        actions: ['resetLastPlayedEvent', 'pause'],
                    },
                    ADD_EVENT: {
                        target: 'playing',
                        actions: ['addEvent'],
                    },
                },
            },
            paused: {
                on: {
                    PLAY: {
                        target: 'playing',
                        actions: ['recordTimeOffset', 'play'],
                    },
                    CAST_EVENT: {
                        target: 'paused',
                        actions: 'castEvent',
                    },
                    TO_LIVE: {
                        target: 'live',
                        actions: ['startLive'],
                    },
                    ADD_EVENT: {
                        target: 'paused',
                        actions: ['addEvent'],
                    },
                },
            },
            live: {
                on: {
                    ADD_EVENT: {
                        target: 'live',
                        actions: ['addEvent'],
                    },
                    CAST_EVENT: {
                        target: 'live',
                        actions: ['castEvent'],
                    },
                },
            },
        },
    }, {
        actions: {
            castEvent: o({
                lastPlayedEvent: (ctx, event) => {
                    if (event.type === 'CAST_EVENT') {
                        return event.payload.event;
                    }
                    return ctx.lastPlayedEvent;
                },
            }),
            recordTimeOffset: o((ctx, event) => {
                let timeOffset = ctx.timeOffset;
                if ('payload' in event && 'timeOffset' in event.payload) {
                    timeOffset = event.payload.timeOffset;
                }
                return Object.assign(Object.assign({}, ctx), { timeOffset, baselineTime: ctx.events[0].timestamp + timeOffset });
            }),
            play(ctx) {
                var _a;
                const { timer, events, baselineTime, lastPlayedEvent } = ctx;
                timer.clear();
                for (const event of events) {
                    addDelay(event, baselineTime);
                }
                const neededEvents = discardPriorSnapshots(events, baselineTime);
                let lastPlayedTimestamp = lastPlayedEvent === null || lastPlayedEvent === void 0 ? void 0 : lastPlayedEvent.timestamp;
                if ((lastPlayedEvent === null || lastPlayedEvent === void 0 ? void 0 : lastPlayedEvent.type) === EventType.IncrementalSnapshot &&
                    lastPlayedEvent.data.source === IncrementalSource.MouseMove) {
                    lastPlayedTimestamp =
                        lastPlayedEvent.timestamp +
                            ((_a = lastPlayedEvent.data.positions[0]) === null || _a === void 0 ? void 0 : _a.timeOffset);
                }
                if (baselineTime < (lastPlayedTimestamp || 0)) {
                    emitter.emit(ReplayerEvents.PlayBack);
                }
                const syncEvents = new Array();
                for (const event of neededEvents) {
                    if (lastPlayedTimestamp &&
                        lastPlayedTimestamp < baselineTime &&
                        (event.timestamp <= lastPlayedTimestamp ||
                            event === lastPlayedEvent)) {
                        continue;
                    }
                    if (event.timestamp < baselineTime) {
                        syncEvents.push(event);
                    }
                    else {
                        const castFn = getCastFn(event, false);
                        timer.addAction({
                            doAction: () => {
                                castFn();
                            },
                            delay: event.delay,
                        });
                    }
                }
                applyEventsSynchronously(syncEvents);
                emitter.emit(ReplayerEvents.Flush);
                timer.start();
            },
            pause(ctx) {
                ctx.timer.clear();
            },
            resetLastPlayedEvent: o((ctx) => {
                return Object.assign(Object.assign({}, ctx), { lastPlayedEvent: null });
            }),
            startLive: o({
                baselineTime: (ctx, event) => {
                    ctx.timer.toggleLiveMode(true);
                    ctx.timer.start();
                    if (event.type === 'TO_LIVE' && event.payload.baselineTime) {
                        return event.payload.baselineTime;
                    }
                    return Date.now();
                },
            }),
            addEvent: o((ctx, machineEvent) => {
                const { baselineTime, timer, events } = ctx;
                if (machineEvent.type === 'ADD_EVENT') {
                    const { event } = machineEvent.payload;
                    addDelay(event, baselineTime);
                    let end = events.length - 1;
                    if (!events[end] || events[end].timestamp <= event.timestamp) {
                        events.push(event);
                    }
                    else {
                        let insertionIndex = -1;
                        let start = 0;
                        while (start <= end) {
                            const mid = Math.floor((start + end) / 2);
                            if (events[mid].timestamp <= event.timestamp) {
                                start = mid + 1;
                            }
                            else {
                                end = mid - 1;
                            }
                        }
                        if (insertionIndex === -1) {
                            insertionIndex = start;
                        }
                        events.splice(insertionIndex, 0, event);
                    }
                    const isSync = event.timestamp < baselineTime;
                    const castFn = getCastFn(event, isSync);
                    if (isSync) {
                        castFn();
                    }
                    else if (timer.isActive()) {
                        timer.addAction({
                            doAction: () => {
                                castFn();
                            },
                            delay: event.delay,
                        });
                    }
                }
                return Object.assign(Object.assign({}, ctx), { events });
            }),
        },
    });
    return v(playerMachine);
}
function createSpeedService(context) {
    const speedMachine = s({
        id: 'speed',
        context,
        initial: 'normal',
        states: {
            normal: {
                on: {
                    FAST_FORWARD: {
                        target: 'skipping',
                        actions: ['recordSpeed', 'setSpeed'],
                    },
                    SET_SPEED: {
                        target: 'normal',
                        actions: ['setSpeed'],
                    },
                },
            },
            skipping: {
                on: {
                    BACK_TO_NORMAL: {
                        target: 'normal',
                        actions: ['restoreSpeed'],
                    },
                    SET_SPEED: {
                        target: 'normal',
                        actions: ['setSpeed'],
                    },
                },
            },
        },
    }, {
        actions: {
            setSpeed: (ctx, event) => {
                if ('payload' in event) {
                    ctx.timer.setSpeed(event.payload.speed);
                }
            },
            recordSpeed: o({
                normalSpeed: (ctx) => ctx.timer.speed,
            }),
            restoreSpeed: (ctx) => {
                ctx.timer.setSpeed(ctx.normalSpeed);
            },
        },
    });
    return v(speedMachine);
}

export { createPlayerService, createSpeedService, discardPriorSnapshots };
