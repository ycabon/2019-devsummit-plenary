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
define(["require", "exports", "esri/portal/PortalItem", "esri/views/MapView", "esri/layers/Layer", "esri/WebMap", "esri/tasks/support/StatisticDefinition", "../widgets/Header"], function (require, exports, PortalItem, MapView, Layer, WebMap, StatisticDefinition, Header_1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    var mobile = !!navigator.userAgent.match(/Android|iPhone|iPad|iPod/i);
    var view;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var map, layer, _a, Legend, Zoom, Home, Indicator, zoom, home, indicator;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
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
                        center: [-100, 40],
                        zoom: 4,
                        map: map,
                        padding: {
                            right: 330
                        },
                        ui: {
                            components: ["attribution"]
                        },
                        popup: null
                    });
                    return [4 /*yield*/, Layer.fromPortalItem({
                            portalItem: new PortalItem({
                                id: "82d8d8213afc4bb380bb16083735f573"
                            })
                        })];
                case 1:
                    layer = _b.sent();
                    return [4 /*yield*/, layer.loadAll()];
                case 2:
                    _b.sent();
                    layer.layers.forEach(function (layer) {
                        layer.outFields = ["B23025_003E", "B23025_005E"];
                    });
                    map.add(layer);
                    return [4 /*yield*/, view.whenLayerView(layer)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, Promise.all([
                            new Promise(function (resolve_1, reject_1) { require(["esri/widgets/Legend"], resolve_1, reject_1); }),
                            new Promise(function (resolve_2, reject_2) { require(["esri/widgets/Zoom"], resolve_2, reject_2); }),
                            new Promise(function (resolve_3, reject_3) { require(["esri/widgets/Home"], resolve_3, reject_3); }),
                            new Promise(function (resolve_4, reject_4) { require(["../widgets/Indicator"], resolve_4, reject_4); })
                        ])];
                case 4:
                    _a = _b.sent(), Legend = _a[0], Zoom = _a[1], Home = _a[2], Indicator = _a[3].default;
                    zoom = new Zoom({
                        view: view,
                        layout: "horizontal"
                    });
                    home = new Home({
                        view: view
                    });
                    view.ui.add(zoom, "bottom-left");
                    view.ui.add(home, "bottom-left");
                    new Legend({
                        container: "legend",
                        view: view
                    });
                    indicator = new Indicator({
                        container: "indicator",
                        title: "Percent Unemployed",
                        format: new Intl.NumberFormat(undefined, {
                            style: "percent",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }),
                        queryStatistics: function (layerView, geometry) { return __awaiter(_this, void 0, void 0, function () {
                            var result, _a, total_pop, total_unemployed;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, layerView.queryFeatures({
                                            geometry: geometry,
                                            outStatistics: [
                                                new StatisticDefinition({
                                                    // All Population in Civilian Labor Force
                                                    onStatisticField: "B23025_003E",
                                                    outStatisticFieldName: "total_pop",
                                                    statisticType: "sum"
                                                }),
                                                new StatisticDefinition({
                                                    // Unemployed Population in Civilian Labor Force
                                                    onStatisticField: "B23025_005E",
                                                    outStatisticFieldName: "total_unemployed",
                                                    statisticType: "sum"
                                                })
                                            ]
                                        })];
                                    case 1:
                                        result = _b.sent();
                                        _a = result.features[0].attributes, total_pop = _a.total_pop, total_unemployed = _a.total_unemployed;
                                        return [2 /*return*/, total_unemployed / total_pop];
                                }
                            });
                        }); },
                        view: view,
                        layer: layer
                    });
                    view.ui.add(new Header_1.default({
                        title: "Client-side queries"
                    }));
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=application.js.map