import WebScene = require("esri/WebScene");
import SceneView = require("esri/views/SceneView");
import GeoJSONLayer = require("esri/layers/GeoJSONLayer");
import { SimpleRenderer, ClassBreaksRenderer } from "esri/renderers";
import { PictureMarkerSymbol, PointSymbol3D, ObjectSymbol3DLayer } from "esri/symbols";
import SizeVariable = require("esri/renderers/visualVariables/SizeVariable");
import ColorVariable = require("esri/renderers/visualVariables/ColorVariable");

import Expand = require("esri/widgets/Expand");
import Zoom = require("esri/widgets/Zoom");
import Home = require("esri/widgets/Home");
import Header from "../widgets/Header";
import Slider from "../widgets/Slider";
import IconButton from "../widgets/IconButton";
import Camera = require("esri/Camera");

const layer = new GeoJSONLayer({
  url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
  title: "USGS Earthquakes",
  copyright: "USGS",
  definitionExpression: "type = 'earthquake'",
  popupTemplate: {
    title: `{title}`,
    content: `
      Earthquake of magnitude {mag} on {time}.<br />
      <a href="{url}" target="_blank" class="esri-popup__button">More details...</a>
    `
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
  renderer: new SimpleRenderer({
    symbol: new PictureMarkerSymbol({
      url: "./src/2_geojson/Mag4.png"
    })
  })
});

const scene = new WebScene({
  basemap: { portalItem: { id: "39858979a6ba4cfd96005bbe9bd4cf82" } },
  ground: "world-topobathymetry"
});

const view = new SceneView({
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

(window as any).view = view;

const zoom = new Zoom({ view, layout: "horizontal" });
const home = new Home({ view });
const alaska = new IconButton({ title: "AK", action: () => {
  const camera = new Camera({
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
}});
const quakeBookmark = new IconButton({
  title: "Underground", action: () => {
    scene.ground.navigationConstraint = {
      type: "none"
    };
    const camera = new Camera({
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
})

view.ui.add(zoom, "bottom-right");
view.ui.add(home, "bottom-right");
view.ui.add(quakeBookmark, "bottom-right");
view.ui.add(alaska, "bottom-right");
view.ui.add(new Header({ title: "GeoJSON" }));

const $ = document.querySelector.bind(document);
const opacitySliderDiv = document.getElementById("opacitySlider");

$("#addGeoJSONLayerButton").onclick = () => {
  scene.add(layer);
}

 $("#applyElevationInfoButton").onclick = () => {
  layer.elevationInfo = {
    mode: "absolute-height",
    unit: "kilometers",
    featureExpressionInfo: {
      expression: "Geometry($feature).z * -1"
    }
  };
}

new Slider({
  container: opacitySliderDiv,
  min: 0,
  max: 1,
  step: 0.01,
  value: 1,
  // title: "Ground opacity",
  action: (value) => {
    document.getElementById("groundOpacityCode").innerText = `scene.ground.opacity = ${value}`;
    scene.ground.opacity = value;
  }
});

view.ui.add(
  new Expand({
    expandIconClass: "esri-icon-feature-layer",
    expandTooltip: "Layer",
    content: document.getElementById("layerPanel"),
    expanded: true,
    group: "group1",
    view
  }),
  "top-left"
);

view.ui.add(
  new Expand({
    expandIconClass: "esri-icon-globe",
    expandTooltip: "Elevation",
    content: document.getElementById("elevationPanel"),
    expanded: false,
    group: "group1",
    view
  }),
  "top-left"
);

view.ui.add(
  new Expand({
    expandIconClass: "esri-icon-maps",
    expandTooltip: "Renderer",
    content: document.getElementById("rendererPanel"),
    expanded: false,
    group: "group1",
    view
  }),
  "top-left"
);

$("#applyRendererButton").onclick = () => {
  layer.renderer = new SimpleRenderer({
    symbol: new PointSymbol3D({
      symbolLayers: [
        new ObjectSymbol3DLayer({
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
