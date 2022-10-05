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
            return ((0, widget_1.tsx)("div", { bind: this, class: CSS.base },
                (0, widget_1.tsx)("span", { class: CSS.title }, this.title),
                (0, widget_1.tsx)("div", { class: "aria-widget-slider" },
                    (0, widget_1.tsx)("div", { class: "rail-label min" }, "0"),
                    (0, widget_1.tsx)("div", { class: "rail", style: "width: 300px;" },
                        (0, widget_1.tsx)("img", { id: "minPriceHotel", src: "images/min-arrow.png", role: "slider", tabindex: "0", class: "min thumb", "aria-valuemin": "0", "aria-valuenow": "100", "aria-valuetext": "$100", "aria-valuemax": "400", "aria-label": "Hotel Minimum Price" }),
                        (0, widget_1.tsx)("img", { id: "maxPriceHotel", src: "images/max-arrow.png", role: "slider", tabindex: "0", class: "max thumb", "aria-valuemin": "0", "aria-valuenow": "250", "aria-valuetext": "$250", "aria-valuemax": "400", "aria-label": "Hotel Maximum Price" })),
                    (0, widget_1.tsx)("div", { class: "rail-label max" }, "0"))));
        };
        Slider.prototype._changeHandler = function (event) {
            this.value = parseFloat(event.target.value);
            if (this.action) {
                this.action(this.value);
            }
        };
        __decorate([
            (0, decorators_1.property)()
        ], Slider.prototype, "action", void 0);
        __decorate([
            (0, decorators_1.property)()
        ], Slider.prototype, "min", void 0);
        __decorate([
            (0, decorators_1.property)()
        ], Slider.prototype, "max", void 0);
        __decorate([
            (0, decorators_1.property)()
        ], Slider.prototype, "step", void 0);
        __decorate([
            (0, decorators_1.property)()
        ], Slider.prototype, "value", void 0);
        __decorate([
            (0, decorators_1.property)()
        ], Slider.prototype, "title", void 0);
        __decorate([
            (0, widget_1.accessibleHandler)()
        ], Slider.prototype, "_changeHandler", null);
        Slider = __decorate([
            (0, decorators_1.subclass)("widgets.Slider")
        ], Slider);
        return Slider;
    }(Widget));
    exports.default = Slider;
});
//# sourceMappingURL=RangeSlider.js.map