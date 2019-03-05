var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "esri/portal/PortalItem", "esri/views/MapView", "esri/layers/Layer", "esri/WebMap", "esri/tasks/support/StatisticDefinition", "../widgets/Banner", "esri/tasks/support/Query", "esri/widgets/Zoom", "esri/widgets/Legend", "esri/widgets/Home", "../widgets/Indicator", "../widgets/IconButton"], function (require, exports, PortalItem, MapView, Layer, WebMap, StatisticDefinition, Banner_1, Query, Zoom, Legend, Home, Indicator_1, IconButton_1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    var view;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var map, layer, nyc;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    map = new WebMap({
                        basemap: {
                            portalItem: {
                                id: "4f2e99ba65e34bb8af49733d9778fb8e"
                            }
                        }
                    });
                    view = new MapView({
                        container: "viewDiv",
                        map: map,
                        center: [-85, 40],
                        zoom: 3,
                        constraints: {
                            snapToZoom: false,
                        },
                        ui: {
                            components: ["attribution"],
                            padding: {
                                top: 80
                            }
                        },
                        popup: null
                    });
                    window.view = view;
                    return [4 /*yield*/, Layer.fromPortalItem({
                            portalItem: new PortalItem({
                                id: "82d8d8213afc4bb380bb16083735f573"
                            })
                        })];
                case 1:
                    layer = _a.sent();
                    return [4 /*yield*/, layer.loadAll()];
                case 2:
                    _a.sent();
                    layer.layers.forEach(function (layer) {
                        layer.outFields = ["B23025_003E", "B23025_005E"];
                    });
                    map.add(layer);
                    return [4 /*yield*/, view.whenLayerView(layer)];
                case 3:
                    _a.sent();
                    view.ui.add(new Banner_1.default({ title: "Client-side queries" }));
                    view.ui.add(new Zoom({ view: view, layout: "horizontal" }), "bottom-left");
                    view.ui.add(new Home({ view: view }), "bottom-left");
                    nyc = new IconButton_1.default({ title: "NYC", action: function () {
                            view.goTo({ center: [-73.9812, 40.737405], zoom: 12 }, {
                                duration: 2000
                            });
                        } });
                    view.ui.add(nyc, "bottom-left");
                    new Legend({ view: view, container: "legend" });
                    new Indicator_1.default({
                        container: "indicator",
                        title: "Percent Unemployed",
                        format: new Intl.NumberFormat(undefined, {
                            style: "percent",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }),
                        queryStatistics: function (layerView, geometry) { return __awaiter(_this, void 0, void 0, function () {
                            var query, featureSet, _a, sumActivePop, sumUnemployedPop;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        query = new Query({
                                            // view extent
                                            geometry: geometry,
                                            outStatistics: [
                                                // Sum of the active population
                                                new StatisticDefinition({
                                                    onStatisticField: "B23025_003E",
                                                    outStatisticFieldName: "sumActivePop",
                                                    statisticType: "sum"
                                                }),
                                                // Sum of the unemployed population
                                                new StatisticDefinition({
                                                    onStatisticField: "B23025_005E",
                                                    outStatisticFieldName: "sumUnemployedPop",
                                                    statisticType: "sum"
                                                })
                                            ]
                                        });
                                        return [4 /*yield*/, layerView.queryFeatures(query)];
                                    case 1:
                                        featureSet = _b.sent();
                                        _a = featureSet.features[0].attributes, sumActivePop = _a.sumActivePop, sumUnemployedPop = _a.sumUnemployedPop;
                                        // Calculate the percentage
                                        return [2 /*return*/, sumUnemployedPop / sumActivePop];
                                }
                            });
                        }); },
                        view: view,
                        layer: layer
                    });
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=application.js.map