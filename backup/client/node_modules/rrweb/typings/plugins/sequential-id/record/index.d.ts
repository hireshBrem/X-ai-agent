import type { RecordPlugin } from '@rrweb/types';
export declare type SequentialIdOptions = {
    key: string;
};
export declare const PLUGIN_NAME = "rrweb/sequential-id@1";
export declare const getRecordSequentialIdPlugin: (options?: Partial<SequentialIdOptions>) => RecordPlugin;
