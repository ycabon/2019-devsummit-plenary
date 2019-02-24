import PortalItem = require("esri/portal/PortalItem");
import MapView = require("esri/views/MapView");
import Layer = require("esri/layers/Layer");
import GroupLayer = require("esri/layers/GroupLayer");
import FeatureLayer = require("esri/layers/FeatureLayer");
import WebMap = require("esri/WebMap");
import StatisticDefinition = require("esri/tasks/support/StatisticDefinition");
import FeatureLayerView = require("esri/views/layers/FeatureLayerView");
import { Polygon } from "esri/geometry";
import { SimpleRenderer, UniqueValueRenderer } from "esri/renderers";
import { SimpleFillSymbol, SimpleMarkerSymbol } from "esri/symbols";
import Header from "../widgets/Header";
import GeoJSONLayer = require("esri/layers/GeoJSONLayer");
import SizeVariable = require("esri/renderers/visualVariables/SizeVariable");

let view: MapView;

(async () => {

  const layer = new GeoJSONLayer({
    url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
    title: "USGS Earthquakes",
    copyright: "USGS",
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
        "name": "updated",
        "type": "date"
      },
      {
        "name": "tz",
        "type": "double"
      },
      {
        "name": "url",
        "type": "string"
      },
      {
        "name": "detail",
        "type": "string"
      },
      {
        "name": "status",
        "type": "string"
      },
      {
        "name": "tsunami",
        "type": "double"
      },
      {
        "name": "sig",
        "type": "double"
      },
      {
        "name": "net",
        "type": "string"
      },
      {
        "name": "code",
        "type": "string"
      },
      {
        "name": "ids",
        "type": "string"
      },
      {
        "name": "sources",
        "type": "string"
      },
      {
        "name": "types",
        "type": "string"
      },
      {
        "name": "nst",
        "type": "double"
      },
      {
        "name": "dmin",
        "type": "double"
      },
      {
        "name": "rms",
        "type": "double"
      },
      {
        "name": "gap",
        "type": "double"
      },
      {
        "name": "magType",
        "type": "string"
      },
      {
        "name": "type",
        "type": "string"
      },
      {
        "name": "title",
        "type": "string"
      },
      {
        "name": "felt",
        "type": "double"
      },
      {
        "name": "cdi",
        "type": "double"
      },
      {
        "name": "mmi",
        "type": "double"
      },
      {
        "name": "alert",
        "type": "string"
      }
    ],
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
        var timeDiff = DateDiff(now(), eqTime, 'hours');
        return When(
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
        value: "hour", // earthquake happened within the hour
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
          },
          {
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
    center: [-180, 40],
    zoom: 3,
    map,
    padding: {
      right: 330
    },
    ui: {
      components: ["attribution"]
    }
    // popup: null
  });

  map.add(layer);
  await view.whenLayerView(layer);

  layer.popupTemplate = layer.createPopupTemplate();

  const [Legend, Zoom, Home, { default: Indicator }] = await Promise.all([
    import("esri/widgets/Legend"),
    import("esri/widgets/Zoom"),
    import("esri/widgets/Home"),
    import("../widgets/Indicator")
  ])
  const zoom = new Zoom({
    view,
    layout: "horizontal"
  });
  const home = new Home({
    view
  });

  view.ui.add(zoom, "bottom-left");
  view.ui.add(home, "bottom-left");

  new Legend({
    container: "legend",
    view
  });

  view.ui.add(new Header({
    title: "GeoJSON"
  }));

})();