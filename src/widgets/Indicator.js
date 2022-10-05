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
define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget", "esri/core/reactiveUtils"], function (require, exports, decorators_1, Widget, widget_1, reactiveUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CSS = {
        base: "esri-widget widgets-indicator",
        titleWrapper: "widgets-indicator--title-wrapper",
        title: "widgets-indicator--title",
        valueWrapper: "widgets-indicator--value-wrapper",
        value: "widgets-indicator--value",
    };
    var Indicator = /** @class */ (function (_super) {
        __extends(Indicator, _super);
        function Indicator(props) {
            var _this = _super.call(this, props) || this;
            // promise to the current stats.
            _this._statsPromise = null;
            _this._refresh = false;
            _this.iconClass = "esri-icon-dashboard";
            return _this;
        }
        Indicator.prototype.initialize = function () {
            var _this = this;
            var updateCallback = function () { return _this.updateStatistics(); };
            this.own([
                (0, reactiveUtils_1.when)(function () { var _a; return !((_a = _this.view) === null || _a === void 0 ? void 0 : _a.updating); }, updateCallback),
                (0, reactiveUtils_1.watch)(function () { var _a; return [(_a = _this.view) === null || _a === void 0 ? void 0 : _a.extent, _this.geometry]; }, updateCallback)
            ]);
        };
        Indicator.prototype.updateStatistics = function () {
            var _this = this;
            if (this._statsPromise) {
                this._refresh = true;
                return;
            }
            if (!this.view || !this.layer || !this.queryStatistics) {
                this.value = null;
                return;
            }
            this._refresh = false;
            var layerView;
            if ("layers" in this.layer) {
                var layers = this.layer.layers.toArray();
                var _loop_1 = function (layer) {
                    var lv = this_1.view.allLayerViews.find(function (layerView) { return layerView.layer === layer; });
                    if (!lv.suspended) {
                        layerView = lv;
                        return "break-search";
                    }
                };
                var this_1 = this;
                search: for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
                    var layer = layers_1[_i];
                    var state_1 = _loop_1(layer);
                    switch (state_1) {
                        case "break-search": break search;
                    }
                }
            }
            else {
                layerView = this.view.allLayerViews.find(function (layerView) { return layerView.layer === _this.layer; });
            }
            this._statsPromise = this.queryStatistics(layerView, this.geometry || this.view.extent)
                .then(function (value) {
                _this.value = value;
                _this._statsPromise = null;
                if (_this._refresh) {
                    _this.updateStatistics();
                }
            })
                .catch(function (error) {
                console.error(error);
                _this._statsPromise = null;
                if (_this._refresh) {
                    _this.updateStatistics();
                }
            });
        };
        Indicator.prototype.render = function () {
            var classes = {};
            return ((0, widget_1.tsx)("div", { bind: this, class: CSS.base, classes: classes },
                (0, widget_1.tsx)("div", { class: CSS.titleWrapper },
                    (0, widget_1.tsx)("span", { class: CSS.title }, this.title)),
                (0, widget_1.tsx)("div", { class: CSS.valueWrapper },
                    (0, widget_1.tsx)("span", { class: CSS.value }, !this.value ? "-" : this.format.format(this.value)))));
        };
        __decorate([
            (0, decorators_1.property)()
        ], Indicator.prototype, "iconClass", void 0);
        __decorate([
            (0, decorators_1.property)()
        ], Indicator.prototype, "queryStatistics", void 0);
        __decorate([
            (0, decorators_1.property)()
        ], Indicator.prototype, "layer", void 0);
        __decorate([
            (0, decorators_1.property)()
        ], Indicator.prototype, "title", void 0);
        __decorate([
            (0, decorators_1.property)()
        ], Indicator.prototype, "value", void 0);
        __decorate([
            (0, decorators_1.property)()
        ], Indicator.prototype, "view", void 0);
        __decorate([
            (0, decorators_1.property)()
        ], Indicator.prototype, "geometry", void 0);
        Indicator = __decorate([
            (0, decorators_1.subclass)("widgets.Indicator")
        ], Indicator);
        return Indicator;
    }(Widget));
    exports.default = Indicator;
});
//# sourceMappingURL=Indicator.js.map