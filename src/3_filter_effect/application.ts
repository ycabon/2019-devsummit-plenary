import MapView = require("esri/views/MapView");
import WebMap = require("esri/WebMap");
import TileLayer = require("esri/layers/TileLayer");
import { whenFalse } from "esri/core/watchUtils";
import { SimpleRenderer } from "esri/renderers";
import { SimpleMarkerSymbol } from "esri/symbols";
import Header from "../widgets/Header";
import GeoJSONLayer = require("esri/layers/GeoJSONLayer");
import SizeVariable = require("esri/renderers/visualVariables/SizeVariable");
import FeatureFilter = require("esri/views/layers/support/FeatureFilter");
import FeatureEffect = require("esri/views/layers/support/FeatureEffect");
import FeatureLayerView = require("esri/views/layers/FeatureLayerView");
import IconButton from "../widgets/IconButton";
import StatisticDefinition = require("esri/tasks/support/StatisticDefinition");
import BasemapToggle = require("esri/widgets/BasemapToggle");
import Basemap = require("esri/Basemap");

import Expand = require("esri/widgets/Expand");
import Zoom = require("esri/widgets/Zoom");
import Home = require("esri/widgets/Home");
import { Extent } from "esri/geometry";

const hljs = (window as any)["hljs"];
let map: WebMap;
let view: MapView;

(async () => {

  type FeatureCollection = {
    features: { geometry: { coordinates: number[] }, properties: { [x:string]: any }}[];
  }

  // promote z values as depth attribute.
  // potential improvement / property on GeoJSONLayer
  const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson")
  const geojson: FeatureCollection = await response.json();
  geojson.features.forEach(({ geometry: { coordinates }, properties }) => {
    properties.depth = coordinates[2];
  });
  const url = URL.createObjectURL(new Blob([JSON.stringify(geojson)], {
    type: "application/json"
  }));

  const layer = new GeoJSONLayer({
    url,
    title: "USGS Earthquakes",
    copyright: "USGS",
    definitionExpression: "type = 'earthquake' AND depth > 0 AND mag > 0",
    popupTemplate: {
      title: `{title}`,
      content: `
      Earthquake of magnitude {mag} on {time}.<br />
      <a href="{url}" target="_blank" class="esri-popup__button">More details...</a>
    `
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
    renderer: new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({
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
    map,
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
  (window as any).view = view;

  // const basemapGeoJSON = new GeoJSONLayer({
  //   url: "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector/geojson/ne_110m_land.geojson",
  //   // https://github.com/nvkelso/natural-earth-vector/blob/master/LICENSE.md
  //   copyright: "Made with Natural Earth."
  // });
  // basemapGeoJSON.load();

  const $ = document.querySelector.bind(document);
  view.ui.add(new Zoom({ view, layout: "horizontal" }), "bottom-right");
  view.ui.add(new Home({ view }), "bottom-right");
  view.ui.add(new Header({ title: "Filter & Effect" }));
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
  view.ui.add(
    new Expand({
      expandIconClass: "esri-icon-chart",
      expandTooltip: "Filter by magnitude",
      content: $("#filterPanel"),
      expanded: false,
      group: "group1",
      view
    }),
    "top-left"
  );
  view.ui.add(
    new Expand({
      expandIconClass: "esri-icon-environment-settings",
      expandTooltip: "Effect",
      content: $("#effectPanel"),
      expanded: false,
      group: "group1",
      view
    }),
    "top-left"
  );
  view.ui.add(new IconButton({ title: "AK", action: () => {
    view.goTo(new Extent({
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
  }}), "bottom-right");

  const [magnitudeSlider, depthSlider] = await Promise.all([
    createSlider(view, layer, $("#magnitudeSlider"), "mag", 16),
    createSlider(view, layer, $("#depthSlider"), "depth", 32)
  ]);

  magnitudeSlider.onChange = (field, minValue, maxValue) => {
    const layerView = view.layerViews.getItemAt(0) as FeatureLayerView;
    layerView.filter = new FeatureFilter({
      where: `mag >= ${minValue} AND mag <= ${maxValue}`
    });
    $("#filterCode").innerHTML = `
  const filter = new FeatureFilter({
    where: \`mag &gt;= ${minValue} AND mag &lt;= ${maxValue}\`
  });

  layerView.filter = filter;
  `
    hljs.highlightBlock($("#filterCode"));
  }

  depthSlider.onChange = (field, minValue, maxValue) => {
    const layerView = view.layerViews.getItemAt(0) as FeatureLayerView;
layerView.effect = new FeatureEffect({
  outsideEffect: "grayscale(100%) opacity(0.5)",

  filter: new FeatureFilter({
    where: `depth >= ${minValue} AND depth <= ${maxValue}`
  })
});
    $("#effectCode").innerHTML = `
  const effect = new FeatureEffect({
    excludedEffect: &quot;grayscale(100%) opacity(0.5)&quot;,
    filter: new FeatureFilter({
      where: \`depth &gt;= ${minValue} AND depth &lt;= ${maxValue}\`
    })
  });

  layerView.effect = effect;
  `
    hljs.highlightBlock($("#effectCode"));
  }

  type SliderHandler = {
    onChange: (field: string, min: number, max: number) => void;
  }

  async function createSlider(view: MapView, layer: GeoJSONLayer, element: HTMLElement, field: string, numBins: number): Promise<SliderHandler> {
    const layerView = await view.whenLayerView(layer) as FeatureLayerView;

    const histogramEl = element.querySelector(".histogram");
    const histogramElRect = histogramEl.getBoundingClientRect();
    const minThumbEl: HTMLInputElement = element.querySelector(".thumb-min");
    const maxThumbEl: HTMLInputElement = element.querySelector(".thumb-max");
    const minValueEl: HTMLSpanElement = element.querySelector(".thumb-min-value");
    const maxValueEl: HTMLSpanElement = element.querySelector(".thumb-max-value");

    let refresh = false;
    let statsPromise: any = null;

    function executeAnalysis() {
      if (statsPromise) {
        refresh = true;
        return;
      }

      refresh = false;

      const extent = view.extent;
      const query = layerView.layer.createQuery();
      query.set({
        geometry: extent,
        spatialRelationship: "contains",
        outStatistics: [
          new StatisticDefinition({
            onStatisticField: field,
            outStatisticFieldName: `min_${field}`,
            statisticType: "min"
          }),
          new StatisticDefinition({
            onStatisticField: field,
            outStatisticFieldName: `max_${field}`,
            statisticType: "max"
          })
        ]
      })

      statsPromise = layerView.queryFeatures(query)
        .then((results) => {
          let {
            features: [
              {
                attributes: {
                  [`min_${field}`]: minValue,
                  [`max_${field}`]: maxValue
                }
              }
            ]
          } = results;

          minValue = Math.floor(minValue);
          maxValue = Math.ceil(maxValue);
          const range = maxValue - minValue;
          const expr = `FLOOR(((${field} - ${minValue}) / ${range}) * ${numBins})`;

          minThumbEl.min = maxThumbEl.min = "" + minValue;
          minThumbEl.max = maxThumbEl.max = "" + maxValue;

          minThumbEl.value = "" + Math.max(minValue, +minThumbEl.value);
          maxThumbEl.value = "" + Math.min(maxValue, +maxThumbEl.value);

          minValueEl.innerHTML = minThumbEl.value;
          maxValueEl.innerHTML = maxThumbEl.value;

          const query = layerView.layer.createQuery();

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
        .then((results) => {
          const bins: { count: number }[] = results.features.reduce((bins, { attributes }) => {
            bins[attributes["EXPR_1"]] = { count: attributes["count"] };
            return bins;
          }, []);

          for (let i = 0; i < bins.length; i++) {
            if (!bins[i]) {
              bins[i] = { count: 0 };
            }
          }

          return bins;
        })
        .then((bins) => {
          const maxCount = bins.reduce((max, { count }) => Math.max(max, count), -Infinity);

          histogramEl.innerHTML = "";

          bins.forEach((bin, index) => {
            const bar = document.createElement("div");
            const barContent = document.createElement("div");
            bar.className = "bar";
            bar.appendChild(barContent);
            barContent.className = `content bin${index}`;
            barContent.style.height = Math.max(1, (bin.count / maxCount) * histogramElRect.height) + "px";
            histogramEl.appendChild(bar);
          });

          statsPromise = null;
          if (refresh) {
            executeAnalysis();
          }
        })
        .catch((error) => {
          console.error(error);
          statsPromise = null;
          if (refresh) {
            executeAnalysis();
          }
        });
    }

    whenFalse(layerView, "updating", executeAnalysis);

    const handler: SliderHandler = {
      onChange: null
    }

    const onMinChange = (event: Event) => {
      if (+minThumbEl.value >= +maxThumbEl.value) {
        minThumbEl.value = "" + (parseFloat(maxThumbEl.value) - parseFloat(minThumbEl.step));
      }
      if (handler.onChange) {
        handler.onChange(field, parseFloat(minThumbEl.value), parseFloat(maxThumbEl.value));
      }
      minValueEl.innerHTML = minThumbEl.value;
    };
    const onMaxChange = () => {
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

    return handler;
  }

})();
