import PortalItem = require("esri/portal/PortalItem");
import MapView = require("esri/views/MapView");
import Layer = require("esri/layers/Layer");
import GroupLayer = require("esri/layers/GroupLayer");
import FeatureLayer = require("esri/layers/FeatureLayer");
import WebMap = require("esri/WebMap");
import StatisticDefinition = require("esri/tasks/support/StatisticDefinition");
import FeatureLayerView = require("esri/views/layers/FeatureLayerView");
import { Polygon } from "esri/geometry";
import { SimpleRenderer } from "esri/renderers";
import { SimpleFillSymbol } from "esri/symbols";
import Header from "../widgets/Header";

import Expand = require("esri/widgets/Expand");
import Zoom = require("esri/widgets/Zoom");
import Legend = require("esri/widgets/Legend");
import Home = require("esri/widgets/Home");
import Indicator from "../widgets/Indicator";

let view: MapView;

(async () => {

  const map = new WebMap({
    basemap: {
      portalItem: {
        id: "4f2e99ba65e34bb8af49733d9778fb8e"
      }
    }
  });

  view = new MapView({
    container: "viewDiv",
    map,
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
  (window as any).view = view;

  const layer = await Layer.fromPortalItem({
    portalItem: new PortalItem({
      id: "82d8d8213afc4bb380bb16083735f573"
    })
  }) as GroupLayer;
  await layer.loadAll();
  layer.layers.forEach((layer: FeatureLayer) => {
    layer.outFields = ["B23025_003E", "B23025_005E"];
  })
  map.add(layer);
  await view.whenLayerView(layer);

  view.ui.add(new Header({ title: "Client-side queries" }));
  view.ui.add(new Zoom({ view, layout: "horizontal" }), "bottom-right");
  view.ui.add(new Home({ view }), "bottom-right");

  new Legend({ view, container: "legend" });
  new Indicator({
    container: "indicator",
    title: "Percent Unemployed",
    format: new Intl.NumberFormat(undefined, {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }),
    queryStatistics: async (layerView, geometry) => {


      const result = await layerView.queryFeatures({
        geometry, // view extent
        outStatistics: [
          // Sum of the population
          new StatisticDefinition({
            onStatisticField: "B23025_003E",
            outStatisticFieldName: "total_pop",
            statisticType: "sum"
          }),
          // Sum of the unemployed population
          new StatisticDefinition({
            onStatisticField: "B23025_005E",
            outStatisticFieldName: "total_unemployed",
            statisticType: "sum"
          })
        ]
      });

      const {
        total_pop,
        total_unemployed
      } = result.features[0].attributes;

      return total_unemployed / total_pop;
    },
    view,
    layer
  });

})();