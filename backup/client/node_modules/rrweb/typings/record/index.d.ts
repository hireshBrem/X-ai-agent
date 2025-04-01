import type { recordOptions } from '../types';
import { eventWithTime, listenerHandler } from '@rrweb/types';
declare function record<T = eventWithTime>(options?: recordOptions<T>): listenerHandler | undefined;
declare namespace record {
    var addCustomEvent: <T>(tag: string, payload: T) => void;
    var freezePage: () => void;
    var takeFullSnapshot: (isCheckout?: boolean | undefined) => void;
    var mirror: import("rrweb-snapshot").Mirror;
}
export default record;
