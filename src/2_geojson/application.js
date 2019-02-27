define(["require", "exports", "esri/WebScene", "esri/views/SceneView", "esri/layers/GeoJSONLayer", "esri/renderers", "esri/symbols", "esri/renderers/visualVariables/SizeVariable", "esri/renderers/visualVariables/ColorVariable", "esri/widgets/Expand", "esri/widgets/Zoom", "esri/widgets/Home", "../widgets/Header", "../widgets/Slider", "../widgets/IconButton", "esri/Camera"], function (require, exports, WebScene, SceneView, GeoJSONLayer, renderers_1, symbols_1, SizeVariable, ColorVariable, Expand, Zoom, Home, Header_1, Slider_1, IconButton_1, Camera) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var layer = new GeoJSONLayer({
        url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
        title: "USGS Earthquakes",
        copyright: "USGS",
        definitionExpression: "type = 'earthquake' and mag > 0",
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
        elevationInfo: { mode: "on-the-ground" },
        renderer: new renderers_1.SimpleRenderer({
            symbol: new symbols_1.PictureMarkerSymbol({
                url: "./src/2_geojson/Mag4.png"
            })
        })
    });
    var scene = new WebScene({
        basemap: { portalItem: { id: "39858979a6ba4cfd96005bbe9bd4cf82" } },
        ground: "world-elevation"
    });
    var view = new SceneView({
        container: "viewDiv",
        map: scene,
        qualityProfile: "high",
        camera: {
            position: {
                x: -16743466,
                y: 3344365,
                z: 10123853,
                spatialReference: { wkid: 102100 }
            },
            heading: 7.55,
            tilt: 14.93
        },
        environment: {
            background: {
                type: "color",
                color: "black"
            },
            starsEnabled: false,
            atmosphereEnabled: false
        },
        ui: {
            padding: {
                top: 80
            },
            components: ["attribution"]
        },
    });
    window.view = view;
    var zoom = new Zoom({ view: view, layout: "horizontal" });
    var home = new Home({ view: view });
    var alaska = new IconButton_1.default({ title: "AK", action: function () {
            var camera = new Camera({
                "position": {
                    "spatialReference": {
                        "wkid": 102100
                    },
                    "x": -17273102.82417752,
                    "y": 7377420.827751662,
                    "z": 577513.3076313715
                },
                "heading": 16.130538766633766,
                "tilt": 52.01343839819215
            });
            view.goTo(camera, {
                duration: 3000
            });
        } });
    var quakeBookmark = new IconButton_1.default({
        title: "Underground", action: function () {
            scene.ground.navigationConstraint = {
                type: "none"
            };
            var camera = new Camera({
                "position": {
                    "spatialReference": {
                        "wkid": 102100
                    },
                    "x": -16789244.894988775,
                    "y": 8574543.43502422,
                    "z": -44618.189062614925
                },
                "heading": 22.958547703630877,
                "tilt": 95.36043529090966
            });
            view.goTo(camera, {
                duration: 3000
            });
        }
    });
    view.ui.add(zoom, "bottom-right");
    view.ui.add(home, "bottom-right");
    view.ui.add(quakeBookmark, "bottom-right");
    view.ui.add(alaska, "bottom-right");
    view.ui.add(new Header_1.default({ title: "GeoJSON" }));
    var $ = document.querySelector.bind(document);
    var opacitySliderDiv = $("#opacitySlider");
    $("#addGeoJSONLayerButton").onclick = function () {
        scene.add(layer);
    };
    $("#applyElevationInfoButton").onclick = function () {
        layer.elevationInfo = {
            mode: "absolute-height",
            unit: "kilometers",
            featureExpressionInfo: {
                expression: "Geometry($feature).z * -1"
            }
        };
    };
    new Slider_1.default({
        container: opacitySliderDiv,
        min: 0,
        max: 1,
        step: 0.01,
        value: 1,
        // title: "Ground opacity",
        action: function (value) {
            $("#groundOpacityCode").innerText = "scene.ground.opacity = " + value;
            scene.ground.opacity = value;
        }
    });
    view.ui.add(new Expand({
        expandIconClass: "esri-icon-feature-layer",
        expandTooltip: "Layer",
        content: $("#layerPanel"),
        expanded: false,
        group: "group1",
        view: view
    }), "top-left");
    view.ui.add(new Expand({
        expandIconClass: "esri-icon-globe",
        expandTooltip: "Elevation",
        content: $("#elevationPanel"),
        expanded: false,
        group: "group1",
        view: view
    }), "top-left");
    view.ui.add(new Expand({
        expandIconClass: "esri-icon-maps",
        expandTooltip: "Renderer",
        content: $("#rendererPanel"),
        expanded: false,
        group: "group1",
        view: view
    }), "top-left");
    $("#applyRendererButton").onclick = function () {
        layer.renderer = new renderers_1.SimpleRenderer({
            symbol: new symbols_1.PointSymbol3D({
                symbolLayers: [
                    new symbols_1.ObjectSymbol3DLayer({
                        resource: {
                            primitive: "sphere"
                        }
                    })
                ]
            }),
            visualVariables: [
                new ColorVariable({
                    field: "mag",
                    stops: [
                        {
                            value: 1,
                            color: "white"
                        }, {
                            value: 5,
                            color: "red"
                        }
                    ]
                }),
                new SizeVariable({
                    field: "mag",
                    axis: "all",
                    stops: [
                        {
                            value: 2,
                            size: 500
                        },
                        {
                            value: 7,
                            size: 10000
                        }
                    ]
                })
            ]
        });
    };
});
//# sourceMappingURL=application.js.map