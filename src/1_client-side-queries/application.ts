import PortalItem = require("esri/portal/PortalItem");
import MapView = require("esri/views/MapView");
import Layer = require("esri/layers/Layer");
import GroupLayer = require("esri/layers/GroupLayer");
import FeatureLayer = require("esri/layers/FeatureLayer");
import WebMap = require("esri/WebMap");
import StatisticDefinition = require("esri/tasks/support/StatisticDefinition");
import Header from "../widgets/Header";

const mobile = !!navigator.userAgent.match(/Android|iPhone|iPad|iPod/i);

let view: MapView;

(async () => {

  const map = new WebMap ({
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
    map,
    padding: {
      right: 330
    },
    ui: {
      components: ["attribution"]
    },
    popup: null
  });

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

  const indicator = new Indicator({
    container: "indicator",
    title: "Percent Unemployed",
    format: new Intl.NumberFormat(undefined, {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }),
    queryStatistics: async (layerView, geometry) => {
      const result = await layerView.queryFeatures({
        geometry,
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
      });

      const {
        total_pop, total_unemployed
      } = result.features[0].attributes;

      return total_unemployed / total_pop;
    },
    view,
    layer
  });

  view.ui.add(new Header({
    title: "Client-side queries"
  }));
})();