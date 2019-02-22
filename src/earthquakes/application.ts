


import MapView = require("esri/views/MapView");
import GeoJSONLayer = require("esri/layers/GeoJSONLayer");
import WebMap = require("esri/WebMap");
import { SimpleRenderer } from "esri/renderers";
import { SimpleMarkerSymbol } from "esri/symbols";

(async () => {
  const geojsonLayer = new GeoJSONLayer({
    url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
    title: "USGS Earthquakes",
    copyright: "USGS",
    elevationInfo: {
      mode: "absolute-height",
      unit: "kilometers",
      featureExpressionInfo: {
        expression: "Geometry($feature).z * -1"
      }
    },
    renderer: new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({
        color: "dodgerblue",
        size: "10px",
        outline: {
          width: "1px",
          color: "white"
        }
      })
    })
  });

  var map = new WebMap ({
    basemap: {
      portalItem: {
        id: "58c4506214f3433788f4bcbd86ca1238"
      }
    },
    ground: "world-topobathymetry",
    layers: [geojsonLayer]
  });

  var view = new MapView({
    container: "viewDiv",
    zoom: 3,
    map: map
  });
})();