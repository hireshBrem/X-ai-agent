import { strFromU8, zlibSync, strToU8 } from './../../../../ext/fflate/esm/browser.js';
import { MARK } from './base.js';

const pack = (event) => {
    const _e = Object.assign(Object.assign({}, event), { v: MARK });
    return strFromU8(zlibSync(strToU8(JSON.stringify(_e))), true);
};

export { pack };
