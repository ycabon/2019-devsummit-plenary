
import MapView = require("esri/views/MapView");
import GeoJSONLayer = require("esri/layers/GeoJSONLayer");
import SizeVariable = require("esri/renderers/visualVariables/SizeVariable");
import WebMap = require("esri/WebMap");
import { UniqueValueRenderer } from "esri/renderers";
import { SimpleMarkerSymbol, SimpleLineSymbol } from "esri/symbols";

let view: MapView;

(async () => {

  const layer = new GeoJSONLayer({
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
    renderer: new UniqueValueRenderer({
      valueExpression: `
        var eqTime = $feature.time;
        var timeDiff = DateDiff ( now() , eqTime , 'hours' );
        var returnString = When(
            timeDiff <= 1, "hour",
            timeDiff > 1 && timeDiff <= 24, "day",
            timeDiff > 24, "week", "other"
        );
      `,
      defaultSymbol: new SimpleMarkerSymbol({
        color: "black",
        size: "10px",
        outline: {
          width: "1px",
          color: "white"
        }
      }),
      defaultLabel: "Not Reported",
      uniqueValueInfos: [{
        value: "hour", // earthuqake happened within the hour
        label: "Last Hour",
        symbol: new SimpleMarkerSymbol({
          color: [255, 0, 0, 0.5 ],
          outline: {
            color: [255,255,255,0.25]
          }
        }),
      },{
        value: "day", // earthquake happened within the day
        label: "Last Day",
        symbol: new SimpleMarkerSymbol({
          color: [230, 152, 0, 0.5],
          outline: {
            color: [255,255,255,0.25]
          }
        }),
      },{
        value: "week", // earthquake happened within the week
        label: "Last Week",
        symbol: new SimpleMarkerSymbol({
          color: [140, 140, 131, 0.25],
          outline: {
            color: [255,255,255,0.25]
          }
        }),
      }],
      visualVariables: [
        new SizeVariable({
          field: "mag",
          legendOptions: {
            title: "Magnitude"
          },
          stops: [{
            value: 2.5,
            size: 4,
            label: "> 2.5"
          },{
            value: 7,
            size: 40,
            label: "> 7"
          }]
        })
      ]
    })
  });

  var map = new WebMap ({
    basemap: "oceans",
    ground: "world-topobathymetry",
    layers: [layer]
  });

  view = new MapView({
    container: "viewDiv",
    zoom: 3,
    map
  });
})();