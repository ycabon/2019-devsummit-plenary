/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget"], function (require, exports, __extends, __decorate, decorators_1, Widget, widget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CSS = {
        button: "esri-widget-button esri-widget widgets-iconbutton",
        disabled: "esri-disabled",
        interactive: "esri-interactive",
        icon: "esri-icon"
    };
    var IconButton = /** @class */ (function (_super) {
        __extends(IconButton, _super);
        function IconButton(props) {
            var _this = _super.call(this, props) || this;
            //----------------------------------
            //  enabled
            //----------------------------------
            _this.enabled = true;
            //----------------------------------
            //  iconClass
            //----------------------------------
            _this.iconClass = "";
            //----------------------------------
            //  title
            //----------------------------------
            _this.title = "";
            return _this;
        }
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        IconButton.prototype.render = function () {
            var _a, _b;
            var tabIndex = this.enabled ? 0 : -1;
            var rootClasses = (_a = {},
                _a[CSS.disabled] = !this.enabled,
                _a[CSS.interactive] = this.enabled,
                _a);
            var iconClasses = (_b = {},
                _b[this.iconClass] = !!this.iconClass,
                _b);
            var iconRendered = !this.iconClass ?
                null :
                widget_1.tsx("span", { "aria-hidden": "true", role: "presentation", class: CSS.icon, classes: iconClasses });
            var titleRendered = !this.title ?
                null :
                widget_1.tsx("span", null, this.title);
            return (widget_1.tsx("div", { bind: this, class: CSS.button, classes: rootClasses, onclick: this._triggerAction, onkeydown: this._triggerAction, role: "button", tabIndex: tabIndex, title: this.title },
                iconRendered,
                titleRendered));
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        IconButton.prototype._triggerAction = function () {
            if (this.enabled) {
                this.action.call(this);
            }
        };
        __decorate([
            decorators_1.property()
        ], IconButton.prototype, "action", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], IconButton.prototype, "enabled", void 0);
        __decorate([
            decorators_1.property({
                readOnly: false
            }),
            widget_1.renderable()
        ], IconButton.prototype, "iconClass", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], IconButton.prototype, "title", void 0);
        __decorate([
            widget_1.accessibleHandler()
        ], IconButton.prototype, "_triggerAction", null);
        IconButton = __decorate([
            decorators_1.subclass("widgets.IconButton")
        ], IconButton);
        return IconButton;
    }(decorators_1.declared(Widget)));
    exports.default = IconButton;
});
//# sourceMappingURL=IconButton.js.map