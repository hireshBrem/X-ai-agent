import type { Mirror } from 'rrweb-snapshot';
import { blockClass, canvasManagerMutationCallback, IWindow, listenerHandler } from '@rrweb/types';
export default function initCanvasWebGLMutationObserver(cb: canvasManagerMutationCallback, win: IWindow, blockClass: blockClass, blockSelector: string | null, mirror: Mirror): listenerHandler;
