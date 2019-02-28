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
define(["require", "exports", "esri/views/MapView", "esri/WebMap", "esri/core/watchUtils", "esri/renderers", "esri/symbols", "../widgets/Header", "esri/layers/GeoJSONLayer", "esri/renderers/visualVariables/SizeVariable", "esri/views/layers/support/FeatureFilter", "esri/views/layers/support/FeatureEffect", "../widgets/IconButton", "esri/tasks/support/StatisticDefinition", "esri/widgets/Expand", "esri/widgets/Zoom", "esri/widgets/Home", "esri/geometry"], function (require, exports, MapView, WebMap, watchUtils_1, renderers_1, symbols_1, Header_1, GeoJSONLayer, SizeVariable, FeatureFilter, FeatureEffect, IconButton_1, StatisticDefinition, Expand, Zoom, Home, geometry_1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    var hljs = window["hljs"];
    var map;
    var view;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        function createSlider(view, layer, element, field, numBins) {
            return __awaiter(this, void 0, void 0, function () {
                function executeAnalysis() {
                    if (statsPromise) {
                        refresh = true;
                        return;
                    }
                    refresh = false;
                    var extent = view.extent;
                    var query = layerView.layer.createQuery();
                    query.set({
                        geometry: extent,
                        spatialRelationship: "contains",
                        outStatistics: [
                            new StatisticDefinition({
                                onStatisticField: field,
                                outStatisticFieldName: "min_" + field,
                                statisticType: "min"
                            }),
                            new StatisticDefinition({
                                onStatisticField: field,
                                outStatisticFieldName: "max_" + field,
                                statisticType: "max"
                            })
                        ]
                    });
                    statsPromise = layerView.queryFeatures(query)
                        .then(function (results) {
                        var _a = results.features[0].attributes, _b = "min_" + field, minValue = _a[_b], _c = "max_" + field, maxValue = _a[_c];
                        minValue = Math.floor(minValue);
                        maxValue = Math.ceil(maxValue);
                        var range = maxValue - minValue;
                        var expr = "FLOOR(((" + field + " - " + minValue + ") / " + range + ") * " + numBins + ")";
                        minThumbEl.min = maxThumbEl.min = "" + minValue;
                        minThumbEl.max = maxThumbEl.max = "" + maxValue;
                        minThumbEl.value = "" + Math.max(minValue, +minThumbEl.value);
                        maxThumbEl.value = "" + Math.min(maxValue, +maxThumbEl.value);
                        minValueEl.innerHTML = minThumbEl.value;
                        maxValueEl.innerHTML = maxThumbEl.value;
                        var query = layerView.layer.createQuery();
                        query.set({
                            geometry: view.extent,
                            spatialRelationship: "contains",
                            groupByFieldsForStatistics: [expr],
                            orderByFields: [expr],
                            outStatistics: [
                                new StatisticDefinition({
                                    statisticType: "count",
                                    outStatisticFieldName: "count",
                                    onStatisticField: "1"
                                })
                            ]
                        });
                        return layerView.queryFeatures(query);
                    })
                        .then(function (results) {
                        var bins = results.features.reduce(function (bins, _a) {
                            var attributes = _a.attributes;
                            bins[attributes["EXPR_1"]] = { count: attributes["count"] };
                            return bins;
                        }, []);
                        for (var i = 0; i < bins.length; i++) {
                            if (!bins[i]) {
                                bins[i] = { count: 0 };
                            }
                        }
                        return bins;
                    })
                        .then(function (bins) {
                        var maxCount = bins.reduce(function (max, _a) {
                            var count = _a.count;
                            return Math.max(max, count);
                        }, -Infinity);
                        histogramEl.innerHTML = "";
                        bins.forEach(function (bin, index) {
                            var bar = document.createElement("div");
                            var barContent = document.createElement("div");
                            bar.className = "bar";
                            bar.appendChild(barContent);
                            barContent.className = "content bin" + index;
                            barContent.style.height = Math.max(1, (bin.count / maxCount) * histogramElRect.height) + "px";
                            histogramEl.appendChild(bar);
                        });
                        statsPromise = null;
                        if (refresh) {
                            executeAnalysis();
                        }
                    })
                        .catch(function (error) {
                        console.error(error);
                        statsPromise = null;
                        if (refresh) {
                            executeAnalysis();
                        }
                    });
                }
                var layerView, histogramEl, histogramElRect, minThumbEl, maxThumbEl, minValueEl, maxValueEl, refresh, statsPromise, handler, onMinChange, onMaxChange;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, view.whenLayerView(layer)];
                        case 1:
                            layerView = _a.sent();
                            histogramEl = element.querySelector(".histogram");
                            histogramElRect = histogramEl.getBoundingClientRect();
                            minThumbEl = element.querySelector(".thumb-min");
                            maxThumbEl = element.querySelector(".thumb-max");
                            minValueEl = element.querySelector(".thumb-min-value");
                            maxValueEl = element.querySelector(".thumb-max-value");
                            refresh = false;
                            statsPromise = null;
                            watchUtils_1.whenFalse(layerView, "updating", executeAnalysis);
                            handler = {
                                onChange: null
                            };
                            onMinChange = function (event) {
                                if (+minThumbEl.value >= +maxThumbEl.value) {
                                    minThumbEl.value = "" + (parseFloat(maxThumbEl.value) - parseFloat(minThumbEl.step));
                                }
                                if (handler.onChange) {
                                    handler.onChange(field, parseFloat(minThumbEl.value), parseFloat(maxThumbEl.value));
                                }
                                minValueEl.innerHTML = minThumbEl.value;
                            };
                            onMaxChange = function () {
                                if (+minThumbEl.value >= +maxThumbEl.value) {
                                    maxThumbEl.value = "" + (parseFloat(minThumbEl.value) + parseFloat(maxThumbEl.step));
                                }
                                maxValueEl.innerHTML = maxThumbEl.value;
                                if (handler.onChange) {
                                    handler.onChange(field, parseFloat(minThumbEl.value), parseFloat(maxThumbEl.value));
                                }
                            };
                            minThumbEl.addEventListener("change", onMinChange);
                            minThumbEl.addEventListener("input", onMinChange);
                            maxThumbEl.addEventListener("change", onMaxChange);
                            maxThumbEl.addEventListener("input", onMaxChange);
                            return [2 /*return*/, handler];
                    }
                });
            });
        }
        var response, geojson, url, layer, $, _a, magnitudeSlider, depthSlider;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson")];
                case 1:
                    response = _b.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    geojson = _b.sent();
                    geojson.features.forEach(function (_a) {
                        var coordinates = _a.geometry.coordinates, properties = _a.properties;
                        properties.depth = coordinates[2];
                    });
                    url = URL.createObjectURL(new Blob([JSON.stringify(geojson)], {
                        type: "application/json"
                    }));
                    layer = new GeoJSONLayer({
                        url: url,
                        title: "USGS Earthquakes",
                        copyright: "USGS",
                        definitionExpression: "type = 'earthquake' AND depth > 0 AND mag > 0",
                        popupTemplate: {
                            title: "{title}",
                            content: "\n      Earthquake of magnitude {mag} on {time}.<br />\n      <a href=\"{url}\" target=\"_blank\" class=\"esri-popup__button\">More details...</a>\n    "
                        },
                        outFields: ["depth"],
                        fields: [
                            { "name": "mag", "type": "double" },
                            { "name": "place", "type": "string" },
                            { "name": "time", "type": "date" },
                            { "name": "url", "type": "string" },
                            { "name": "title", "type": "string" },
                            { "name": "type", "type": "string" },
                            { "name": "depth", "type": "double" }
                        ],
                        renderer: new renderers_1.SimpleRenderer({
                            symbol: new symbols_1.SimpleMarkerSymbol({
                                style: "circle",
                                color: "orange",
                                outline: {
                                    color: "rgba(255,255,255,0.1)",
                                    width: "1px"
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
                                            size: 6,
                                            label: "> 2.5"
                                        }, {
                                            value: 6,
                                            size: 10
                                        },
                                        {
                                            value: 8,
                                            size: 40,
                                            label: "> 8"
                                        }]
                                })
                            ]
                        })
                    });
                    map = new WebMap({
                        basemap: {
                            baseLayers: [
                                new GeoJSONLayer({
                                    url: "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector/geojson/ne_110m_land.geojson",
                                    // https://github.com/nvkelso/natural-earth-vector/blob/master/LICENSE.md
                                    copyright: "Made with Natural Earth.",
                                    opacity: 0.7,
                                    spatialReference: {
                                        wkid: 54037
                                    }
                                })
                                // new TileLayer({
                                //   url: "https://tilesdevext.arcgis.com/tiles/LkFyxb9zDq7vAOAm/arcgis/rest/services/VintageHillshadeEqualEarth_Pacific/MapServer",
                                //   opacity: 0.7
                                // })
                            ]
                        },
                        layers: [
                            layer
                        ]
                    });
                    view = new MapView({
                        container: "viewDiv",
                        map: map,
                        ui: {
                            padding: {
                                top: 80
                            },
                            components: ["attribution"]
                        },
                        constraints: {
                            snapToZoom: false
                        },
                        extent: {
                            "spatialReference": {
                                "wkid": 54037
                            },
                            "xmin": -21112411.21972788,
                            "ymin": -9966613.185376981,
                            "xmax": 19652497.25028626,
                            "ymax": 11153267.034977665
                        }
                    });
                    window.view = view;
                    $ = document.querySelector.bind(document);
                    view.ui.add(new Zoom({ view: view, layout: "horizontal" }), "bottom-right");
                    view.ui.add(new Home({ view: view }), "bottom-right");
                    view.ui.add(new Header_1.default({ title: "Filter & Effect" }));
                    // view.ui.add(new BasemapToggle({
                    //   view,
                    //   nextBasemap: new Basemap({
                    //     baseLayers: [
                    //       new TileLayer({
                    //         url: "https://tilesdevext.arcgis.com/tiles/LkFyxb9zDq7vAOAm/arcgis/rest/services/VintageHillshadeEqualEarth_Pacific/MapServer",
                    //         opacity: 0.7
                    //       })
                    //       // basemapGeoJSON
                    //     ]
                    //   })
                    // }), "top-right")
                    view.ui.add(new Expand({
                        expandIconClass: "esri-icon-chart",
                        expandTooltip: "Filter by magnitude",
                        content: $("#filterPanel"),
                        expanded: false,
                        group: "group1",
                        view: view
                    }), "top-left");
                    view.ui.add(new Expand({
                        expandIconClass: "esri-icon-environment-settings",
                        expandTooltip: "Effect",
                        content: $("#effectPanel"),
                        expanded: false,
                        group: "group1",
                        view: view
                    }), "top-left");
                    view.ui.add(new IconButton_1.default({ title: "AK", action: function () {
                            view.goTo(new geometry_1.Extent({
                                "spatialReference": {
                                    "wkid": 54037
                                },
                                "xmin": 2040605.7663298452,
                                "ymin": 6308917.7043609945,
                                "xmax": 4904201.102165737,
                                "ymax": 7792517.024519098
                            }), {
                                duration: 2500
                            });
                        } }), "bottom-right");
                    return [4 /*yield*/, Promise.all([
                            createSlider(view, layer, $("#magnitudeSlider"), "mag", 16),
                            createSlider(view, layer, $("#depthSlider"), "depth", 32)
                        ])];
                case 3:
                    _a = _b.sent(), magnitudeSlider = _a[0], depthSlider = _a[1];
                    magnitudeSlider.onChange = function (field, minValue, maxValue) {
                        var layerView = view.layerViews.getItemAt(0);
                        layerView.filter = new FeatureFilter({
                            where: "mag >= " + minValue + " AND mag <= " + maxValue
                        });
                        $("#filterCode").innerHTML = "\n  layerView.filter = new FeatureFilter({\n    where: `mag &gt;= " + minValue + " AND mag &lt;= " + maxValue + "`\n  });\n  ";
                        hljs.highlightBlock($("#filterCode"));
                    };
                    depthSlider.onChange = function (field, minValue, maxValue) {
                        var layerView = view.layerViews.getItemAt(0);
                        layerView.effect = new FeatureEffect({
                            outsideEffect: "grayscale(100%) opacity(0.5)",
                            filter: new FeatureFilter({
                                where: "depth >= " + minValue + " AND depth <= " + maxValue
                            })
                        });
                        $("#effectCode").innerHTML = "\n  layerView.effect = new FeatureEffect({\n    excludedEffect: &quot;grayscale(100%) opacity(0.5)&quot;,\n    filter: new FeatureFilter({\n      where: `depth &gt;= " + minValue + " AND depth &lt;= " + maxValue + "`\n    })\n  });\n  ";
                        hljs.highlightBlock($("#effectCode"));
                    };
                    return [2 /*return*/];
            }
        });
    }); })();
});
//# sourceMappingURL=application.js.map