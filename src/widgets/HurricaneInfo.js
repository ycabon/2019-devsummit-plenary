var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget"], function (require, exports, decorators_1, Widget, widget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CSS = {
        base: "widgets-hurricaneinfo",
        background: "widgets-hurricaneinfo--background",
        modal: "widgets-hurricaneinfo--modal",
        visible: "widgets-hurricaneinfo--visible",
        hurricaneName: "widgets-hurricaneinfo--hurricane-name",
        hurricaneSeason: "widgets-hurricaneinfo--hurricane-season",
        hurricaneMaxWind: "widgets-hurricaneinfo--hurricane-maxwind",
        hurricaneInfo: "widgets-hurricaneinfo--info",
    };
    var HurricaneInfo = /** @class */ (function (_super) {
        __extends(HurricaneInfo, _super);
        function HurricaneInfo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        HurricaneInfo.prototype.render = function () {
            var _a;
            var classes = (_a = {},
                _a[CSS.visible] = this.hurricane != null,
                _a);
            var hurricane = this.hurricane;
            var renderedHurricanes = !hurricane ? null : (widget_1.tsx("div", { class: CSS.modal },
                widget_1.tsx("div", { class: CSS.hurricaneInfo },
                    widget_1.tsx("div", { class: CSS.hurricaneSeason }, hurricane.season),
                    widget_1.tsx("div", { class: CSS.hurricaneMaxWind }, Math.round(hurricane.maxWind * 1.852) + " km/h")),
                widget_1.tsx("div", { class: CSS.hurricaneName }, hurricane.name)));
            return (widget_1.tsx("div", { bind: this, classes: classes, class: CSS.base },
                widget_1.tsx("div", { class: CSS.background }, renderedHurricanes)));
        };
        __decorate([
            decorators_1.property()
        ], HurricaneInfo.prototype, "hurricane", void 0);
        HurricaneInfo = __decorate([
            decorators_1.subclass("widgets.HurricaneInfo")
        ], HurricaneInfo);
        return HurricaneInfo;
    }(Widget));
    exports.default = HurricaneInfo;
});
//# sourceMappingURL=HurricaneInfo.js.map