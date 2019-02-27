var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
define(["require", "exports", "esri/views/MapView", "esri/WebMap", "esri/layers/TileLayer", "esri/renderers", "esri/symbols", "../widgets/Header", "../widgets/ToggleIconButton", "esri/layers/GeoJSONLayer", "esri/renderers/visualVariables/SizeVariable", "esri/renderers/smartMapping/statistics/histogram", "esri/views/layers/support/FeatureFilter"], function (require, exports, MapView, WebMap, TileLayer, renderers_1, symbols_1, Header_1, ToggleIconButton_1, GeoJSONLayer, SizeVariable, histogram, FeatureFilter) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    var map;
    var mapView;
    function createLayer() {
        return new GeoJSONLayer({
            url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
            title: "USGS Earthquakes",
            copyright: "USGS",
            popupTemplate: {
                title: "{title}",
                content: "\n        Earthquake of magnitude {mag} on {time}.<br />\n      ",
                outFields: ["url"]
            },
            fields: [
                {
                    "name": "mag",
                    "type": "double"
                },
                {
                    "name": "place",
                    "type": "string"
                },
                {
                    "name": "time",
                    "type": "date"
                },
                {
                    "name": "url",
                    "type": "string"
                },
                {
                    "name": "title",
                    "type": "string"
                }
            ],
            renderer: new renderers_1.SimpleRenderer({
                symbol: new symbols_1.SimpleMarkerSymbol({
                    style: "circle",
                    color: "red",
                    outline: {
                        color: "rgba(255,255,255,0.2)",
                        width: 1
                    }
                }),
                visualVariables: [
                    new SizeVariable({
                        field: "mag",
                        legendOptions: {
                            title: "Magnitude",
                            showLegend: false
                        },
                        stops: [{
                                value: 2.5,
                                size: 2,
                                label: "> 2.5"
                            },
                            {
                                value: 5,
                                size: 10
                            },
                            {
                                value: 6,
                                size: 20
                            },
                            {
                                value: 7,
                                size: 40
                            },
                            {
                                value: 8,
                                size: 60,
                                label: "> 8"
                            }]
                    })
                ]
            })
        });
    }
    (function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            map = new WebMap({
                basemap: {
                    baseLayers: [
                        new TileLayer({
                            url: "https://tilesdevext.arcgis.com/tiles/LkFyxb9zDq7vAOAm/arcgis/rest/services/VintageHillshadeEqualEarth_Pacific/MapServer"
                        })
                    ]
                },
                layers: [createLayer()]
            });
            map.basemap.baseLayers.getItemAt(0).opacity = 0.90;
            mapView = new MapView({
                container: "viewDiv",
                map: map,
                ui: {
                    components: ["attribution"]
                }
            });
            setupUI(mapView);
            setupSliders(map.layers.getItemAt(0));
            return [2 /*return*/];
        });
    }); })();
    function setupUI(view) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, Legend, Zoom, Home, Indicator, zoom, home;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            new Promise(function (resolve_1, reject_1) { require(["esri/widgets/Legend"], resolve_1, reject_1); }),
                            new Promise(function (resolve_2, reject_2) { require(["esri/widgets/Zoom"], resolve_2, reject_2); }),
                            new Promise(function (resolve_3, reject_3) { require(["esri/widgets/Home"], resolve_3, reject_3); }),
                            new Promise(function (resolve_4, reject_4) { require(["../widgets/Indicator"], resolve_4, reject_4); })
                        ])];
                    case 1:
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
                        view.ui.add(new Header_1.default({
                            title: "GeoJSON",
                            actionContent: [
                                new ToggleIconButton_1.default({
                                    title: "Filter",
                                    toggle: function () {
                                        var panel = document.getElementById("panel");
                                        panel.classList.toggle("hidden");
                                    }
                                })
                            ]
                        }));
                        view.popup.viewModel.on("trigger-action", function (event) {
                            if (event.action.id === "more-details") {
                                window.open(view.popup.viewModel.selectedFeature.attributes.url, "_blank");
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    }
    var filter = new FeatureFilter();
    function updateFilter() {
        return __awaiter(this, void 0, void 0, function () {
            var lv2d;
            return __generator(this, function (_a) {
                lv2d = mapView.layerViews.getItemAt(0);
                lv2d && (lv2d.filter = filter.clone());
                return [2 /*return*/];
            });
        });
    }
    function setupSliders(layer) {
        var magnitudeSlider = setupSlider(layer, document.getElementById("magnitudeSlider"), {
            field: "mag",
            minValue: 0,
            maxValue: 8,
            numBins: 16
        });
        magnitudeSlider.onChange = function (field, minValue, maxValue) {
            filter.where = "mag >= " + minValue + " AND mag <= " + maxValue;
            updateFilter();
        };
        var timeSlider = setupSlider(layer, document.getElementById("timeSlider"), {
            field: "time",
            numBins: 8
        });
    }
    function setupSlider(layer, element, options) {
        var histogramEl = element.querySelector(".histogram");
        if (histogramEl) {
            var histogramElRect_1 = histogramEl.getBoundingClientRect();
            histogram(__assign({ layer: layer, classificationMethod: "equal-interval" }, options))
                .then(function (result) {
                var maxCount = result.bins.reduce(function (max, _a) {
                    var count = _a.count;
                    return Math.max(max, count);
                }, -Infinity);
                result.bins.forEach(function (bin) {
                    var bar = document.createElement("div");
                    var barContent = document.createElement("div");
                    bar.className = "bar";
                    bar.appendChild(barContent);
                    barContent.className = "content";
                    barContent.style.height = Math.max(1, (bin.count / maxCount) * histogramElRect_1.height) + "px";
                    histogramEl.appendChild(bar);
                });
            });
        }
        var minThumb = element.querySelector(".thumb-min");
        var maxThumb = element.querySelector(".thumb-max");
        var minValue = element.querySelector(".thumb-min-value");
        var maxValue = element.querySelector(".thumb-max-value");
        minThumb.min = maxThumb.min = "" + options.minValue;
        minThumb.max = maxThumb.max = "" + options.maxValue;
        var handler = {
            onChange: null
        };
        var onMinChange = function (event) {
            if (+minThumb.value >= +maxThumb.value) {
                minThumb.value = "" + (parseFloat(maxThumb.value) - parseFloat(minThumb.step));
            }
            if (handler.onChange) {
                handler.onChange(options.field, parseFloat(minThumb.value), parseFloat(maxThumb.value));
            }
            minValue.innerHTML = minThumb.value;
        };
        var onMaxChange = function () {
            if (+minThumb.value >= +maxThumb.value) {
                maxThumb.value = "" + (parseFloat(minThumb.value) + parseFloat(maxThumb.step));
            }
            maxValue.innerHTML = maxThumb.value;
            if (handler.onChange) {
                handler.onChange(options.field, parseFloat(minThumb.value), parseFloat(maxThumb.value));
            }
        };
        minThumb.addEventListener("change", onMinChange);
        minThumb.addEventListener("input", onMinChange);
        maxThumb.addEventListener("change", onMaxChange);
        maxThumb.addEventListener("input", onMaxChange);
        return handler;
    }
});
//# sourceMappingURL=application.js.map