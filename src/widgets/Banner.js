var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
        base: "widgets-header",
        actionContent: "widgets-header--actionContent",
        label: "widgets-header--label"
    };
    var Header = /** @class */ (function (_super) {
        __extends(Header, _super);
        function Header(props) {
            var _this = _super.call(this, props) || this;
            _this.title = "";
            return _this;
        }
        Header.prototype.render = function () {
            var classes = {};
            return ((0, widget_1.tsx)("div", { bind: this, class: CSS.base, classes: classes },
                (0, widget_1.tsx)("div", { class: CSS.label }, this.title),
                (0, widget_1.tsx)("div", { class: CSS.actionContent }, this.actionContent && this.actionContent.map(function (content) { return content.render(); }))));
        };
        __decorate([
            (0, decorators_1.property)()
        ], Header.prototype, "title", void 0);
        __decorate([
            (0, decorators_1.property)()
        ], Header.prototype, "actionContent", void 0);
        Header = __decorate([
            (0, decorators_1.subclass)("widgets.Header")
        ], Header);
        return Header;
    }(Widget));
    exports.default = Header;
});
//# sourceMappingURL=Banner.js.map