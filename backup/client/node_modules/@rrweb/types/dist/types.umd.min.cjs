(function (g, f) {
    if ("object" == typeof exports && "object" == typeof module) {
      module.exports = f();
    } else if ("function" == typeof define && define.amd) {
      define("rrwebTypes", [], f);
    } else if ("object" == typeof exports) {
      exports["rrwebTypes"] = f();
    } else {
      g["rrwebTypes"] = f();
    }
  }(this, () => {
var exports = {};
var module = { exports };
"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});var u=(h=>(h[h.DomContentLoaded=0]="DomContentLoaded",h[h.Load=1]="Load",h[h.FullSnapshot=2]="FullSnapshot",h[h.IncrementalSnapshot=3]="IncrementalSnapshot",h[h.Meta=4]="Meta",h[h.Custom=5]="Custom",h[h.Plugin=6]="Plugin",h))(u||{}),D=(h=>(h[h.Mutation=0]="Mutation",h[h.MouseMove=1]="MouseMove",h[h.MouseInteraction=2]="MouseInteraction",h[h.Scroll=3]="Scroll",h[h.ViewportResize=4]="ViewportResize",h[h.Input=5]="Input",h[h.TouchMove=6]="TouchMove",h[h.MediaInteraction=7]="MediaInteraction",h[h.StyleSheetRule=8]="StyleSheetRule",h[h.CanvasMutation=9]="CanvasMutation",h[h.Font=10]="Font",h[h.Log=11]="Log",h[h.Drag=12]="Drag",h[h.StyleDeclaration=13]="StyleDeclaration",h[h.Selection=14]="Selection",h[h.AdoptedStyleSheet=15]="AdoptedStyleSheet",h[h.CustomElement=16]="CustomElement",h))(D||{}),C=(h=>(h[h.MouseUp=0]="MouseUp",h[h.MouseDown=1]="MouseDown",h[h.Click=2]="Click",h[h.ContextMenu=3]="ContextMenu",h[h.DblClick=4]="DblClick",h[h.Focus=5]="Focus",h[h.Blur=6]="Blur",h[h.TouchStart=7]="TouchStart",h[h.TouchMove_Departed=8]="TouchMove_Departed",h[h.TouchEnd=9]="TouchEnd",h[h.TouchCancel=10]="TouchCancel",h))(C||{}),d=(h=>(h[h.Mouse=0]="Mouse",h[h.Pen=1]="Pen",h[h.Touch=2]="Touch",h))(d||{}),g=(h=>(h[h["2D"]=0]="2D",h[h.WebGL=1]="WebGL",h[h.WebGL2=2]="WebGL2",h))(g||{}),l=(h=>(h[h.Play=0]="Play",h[h.Pause=1]="Pause",h[h.Seeked=2]="Seeked",h[h.VolumeChange=3]="VolumeChange",h[h.RateChange=4]="RateChange",h))(l||{}),k=(h=>(h.Start="start",h.Pause="pause",h.Resume="resume",h.Resize="resize",h.Finish="finish",h.FullsnapshotRebuilded="fullsnapshot-rebuilded",h.LoadStylesheetStart="load-stylesheet-start",h.LoadStylesheetEnd="load-stylesheet-end",h.SkipStart="skip-start",h.SkipEnd="skip-end",h.MouseInteraction="mouse-interaction",h.EventCast="event-cast",h.CustomEvent="custom-event",h.Flush="flush",h.StateChange="state-change",h.PlayBack="play-back",h.Destroy="destroy",h))(k||{}),L=(h=>(h[h.Document=0]="Document",h[h.DocumentType=1]="DocumentType",h[h.Element=2]="Element",h[h.Text=3]="Text",h[h.CDATA=4]="CDATA",h[h.Comment=5]="Comment",h))(L||{});exports.CanvasContext=g;exports.EventType=u;exports.IncrementalSource=D;exports.MediaInteractions=l;exports.MouseInteractions=C;exports.NodeType=L;exports.PointerTypes=d;exports.ReplayerEvents=k;
if (typeof module.exports == "object" && typeof exports == "object") {
  var __cp = (to, from, except, desc) => {
    if ((from && typeof from === "object") || typeof from === "function") {
      for (let key of Object.getOwnPropertyNames(from)) {
        if (!Object.prototype.hasOwnProperty.call(to, key) && key !== except)
        Object.defineProperty(to, key, {
          get: () => from[key],
          enumerable: !(desc = Object.getOwnPropertyDescriptor(from, key)) || desc.enumerable,
        });
      }
    }
    return to;
  };
  module.exports = __cp(module.exports, exports);
}
return module.exports;
}))
//# sourceMappingURL=types.umd.min.cjs.map
