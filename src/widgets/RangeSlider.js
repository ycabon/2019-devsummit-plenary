/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget"], function (require, exports, __extends, __decorate, decorators_1, Widget, widget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CSS = {
        base: "esri-widget widgets-slider",
        title: "widgets-slider--title",
        value: "widgets-slider--value"
    };
    var Slider = /** @class */ (function (_super) {
        __extends(Slider, _super);
        function Slider(props) {
            var _this = _super.call(this, props) || this;
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
        Slider.prototype.render = function () {
            return (widget_1.tsx("div", { bind: this, class: CSS.base },
                widget_1.tsx("span", { class: CSS.title }, this.title),
                widget_1.tsx("div", { class: "aria-widget-slider" },
                    widget_1.tsx("div", { class: "rail-label min" }, "0"),
                    widget_1.tsx("div", { class: "rail", style: "width: 300px;" },
                        widget_1.tsx("img", { id: "minPriceHotel", src: "images/min-arrow.png", role: "slider", tabindex: "0", class: "min thumb", "aria-valuemin": "0", "aria-valuenow": "100", "aria-valuetext": "$100", "aria-valuemax": "400", "aria-label": "Hotel Minimum Price" }),
                        widget_1.tsx("img", { id: "maxPriceHotel", src: "images/max-arrow.png", role: "slider", tabindex: "0", class: "max thumb", "aria-valuemin": "0", "aria-valuenow": "250", "aria-valuetext": "$250", "aria-valuemax": "400", "aria-label": "Hotel Maximum Price" })),
                    widget_1.tsx("div", { class: "rail-label max" }, "0"))));
        };
        Slider.prototype._changeHandler = function (event) {
            this.value = parseFloat(event.target.value);
            if (this.action) {
                this.action(this.value);
            }
        };
        __decorate([
            decorators_1.property()
        ], Slider.prototype, "action", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], Slider.prototype, "min", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], Slider.prototype, "max", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], Slider.prototype, "step", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], Slider.prototype, "value", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], Slider.prototype, "title", void 0);
        __decorate([
            widget_1.accessibleHandler()
        ], Slider.prototype, "_changeHandler", null);
        Slider = __decorate([
            decorators_1.subclass("widgets.Slider")
        ], Slider);
        return Slider;
    }(decorators_1.declared(Widget)));
    exports.default = Slider;
});
//# sourceMappingURL=RangeSlider.js.map