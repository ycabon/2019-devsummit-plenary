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
define(["require", "exports", "esri/views/MapView", "esri/WebMap", "esri/layers/TileLayer", "esri/renderers", "esri/symbols", "../widgets/Header", "esri/layers/GeoJSONLayer", "esri/renderers/visualVariables/SizeVariable", "esri/renderers/smartMapping/statistics/histogram", "esri/views/layers/support/FeatureFilter", "esri/widgets/Expand", "esri/widgets/Zoom", "esri/widgets/Home"], function (require, exports, MapView, WebMap, TileLayer, renderers_1, symbols_1, Header_1, GeoJSONLayer, SizeVariable, histogram, FeatureFilter, Expand, Zoom, Home) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map;
    var view;
    var layer = new GeoJSONLayer({
        url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
        title: "USGS Earthquakes",
        copyright: "USGS",
        definitionExpression: "type = 'earthquake'",
        popupTemplate: {
            title: "{title}",
            content: "\n      Earthquake of magnitude {mag} on {time}.<br />\n      <a href=\"{url}\" target=\"_blank\" class=\"esri-popup__button\">More details...</a>\n    "
        },
        fields: [
            { "name": "mag", "type": "double" },
            { "name": "place", "type": "string" },
            { "name": "time", "type": "date" },
            { "name": "url", "type": "string" },
            { "name": "title", "type": "string" },
            { "name": "type", "type": "string" }
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
                            size: 4,
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
                new TileLayer({
                    url: "https://tilesdevext.arcgis.com/tiles/LkFyxb9zDq7vAOAm/arcgis/rest/services/VintageHillshadeEqualEarth_Pacific/MapServer"
                })
            ]
        },
        layers: [
            layer
        ]
    });
    map.basemap.baseLayers.getItemAt(0).opacity = 1;
    view = new MapView({
        container: "viewDiv",
        map: map,
        ui: {
            padding: {
                top: 80
            },
            components: ["attribution"]
        }
    });
    var $ = document.querySelector.bind(document);
    view.ui.add(new Zoom({ view: view, layout: "horizontal" }), "bottom-right");
    view.ui.add(new Home({ view: view }), "bottom-right");
    view.ui.add(new Header_1.default({ title: "Filter & Effect" }));
    var magnitudeSlider = setupSlider(layer, $("#magnitudeSlider"), {
        field: "mag",
        minValue: 0,
        maxValue: 8,
        numBins: 16
    });
    view.ui.add(new Expand({
        expandIconClass: "esri-icon-chart",
        expandTooltip: "Filter by magnitude",
        content: $("#filterPanel"),
        expanded: false,
        group: "group1",
        view: view
    }), "top-left");
    magnitudeSlider.onChange = function (field, minValue, maxValue) {
        var layerView = view.layerViews.getItemAt(0);
        layerView.filter = new FeatureFilter({
            where: "mag >= " + minValue + " AND mag <= " + maxValue
        });
        // $("#filterCode").innerHTML =
    };
    function setupSlider(layer, element, options) {
        var histogramEl = $(".histogram");
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
        var minThumb = $(".thumb-min");
        var maxThumb = $(".thumb-max");
        var minValue = $(".thumb-min-value");
        var maxValue = $(".thumb-max-value");
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