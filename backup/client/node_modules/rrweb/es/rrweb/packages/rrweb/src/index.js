import record from './record/index.js';
export { default as record } from './record/index.js';
import '../../rrweb-snapshot/es/rrweb-snapshot.js';
import '../../rrdom/es/rrdom.js';
import * as utils from './utils.js';
export { utils };
export { _mirror as mirror } from './utils.js';
import './../../../ext/base64-arraybuffer/dist/base64-arraybuffer.es5.js';

const { addCustomEvent } = record;
const { freezePage } = record;

export { addCustomEvent, freezePage };
