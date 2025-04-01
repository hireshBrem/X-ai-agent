var rrwebSequentialIdRecord=function(e){"use strict";const t={key:"_sid"},n="rrweb/sequential-id@1",c=r=>{const i=r?Object.assign({},t,r):t;let s=0;return{name:n,eventProcessor(u){return Object.assign(u,{[i.key]:++s}),u},options:i}};return e.PLUGIN_NAME=n,e.getRecordSequentialIdPlugin=c,Object.defineProperty(e,"__esModule",{value:!0}),e}({});
//# sourceMappingURL=sequential-id-record.min.js.map
