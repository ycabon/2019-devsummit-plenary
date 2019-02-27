import MapView = require("esri/views/MapView");
import WebMap = require("esri/WebMap");
import TileLayer = require("esri/layers/TileLayer");
import { SimpleRenderer } from "esri/renderers";
import { SimpleMarkerSymbol } from "esri/symbols";
import Header from "../widgets/Header";
import GeoJSONLayer = require("esri/layers/GeoJSONLayer");
import SizeVariable = require("esri/renderers/visualVariables/SizeVariable");
import histogram = require("esri/renderers/smartMapping/statistics/histogram");
import FeatureFilter = require("esri/views/layers/support/FeatureFilter");
import FeatureLayerView = require("esri/views/layers/FeatureLayerView");

import Expand = require("esri/widgets/Expand");
import Zoom = require("esri/widgets/Zoom");
import Home = require("esri/widgets/Home");


let map: WebMap;
let view: MapView;

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
          size: 4,
          label: "> 2.5"
        },{
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
  map,
  ui: {
    padding: {
      top: 80
    },
    components: ["attribution"]
  }
});

const $ = document.querySelector.bind(document);
view.ui.add(new Zoom({ view, layout: "horizontal" }), "bottom-right");
view.ui.add(new Home({ view }), "bottom-right");
view.ui.add(new Header({ title: "Filter & Effect" }));

const magnitudeSlider = setupSlider(layer, $("#magnitudeSlider"), {
  field: "mag",
  minValue: 0,
  maxValue: 8,
  numBins: 16
});

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

magnitudeSlider.onChange = (field, minValue, maxValue) => {
  const layerView = view.layerViews.getItemAt(0) as FeatureLayerView;
  layerView.filter = new FeatureFilter({
    where: `mag >= ${minValue} AND mag <= ${maxValue}`
  });
  // $("#filterCode").innerHTML =
}

type SliderHandler = {
  onChange: (field: string, min: number, max: number) => void;
}

function setupSlider(layer: any, element: HTMLElement, options?: {
  field: string;
  minValue?: number;
  maxValue?: number;
  numBins: number;
}): SliderHandler {
  const histogramEl: HTMLDivElement = $(".histogram");

  if (histogramEl) {
    const histogramElRect = histogramEl.getBoundingClientRect();

    histogram({
      layer,
      classificationMethod: "equal-interval",
      ...options
    })
      .then((result) => {
        const maxCount = result.bins.reduce((max, { count }) => Math.max(max, count), -Infinity);

        result.bins.forEach((bin) => {
          const bar = document.createElement("div");
          const barContent = document.createElement("div");
          bar.className = "bar";
          bar.appendChild(barContent);
          barContent.className = "content";
          barContent.style.height = Math.max(1, (bin.count / maxCount) * histogramElRect.height) + "px";
          histogramEl.appendChild(bar);
        })
      });
  }

  const minThumb: HTMLInputElement = $(".thumb-min");
  const maxThumb: HTMLInputElement = $(".thumb-max");

  const minValue: HTMLSpanElement = $(".thumb-min-value");
  const maxValue: HTMLSpanElement = $(".thumb-max-value");

  minThumb.min = maxThumb.min = "" + options.minValue;
  minThumb.max = maxThumb.max = "" + options.maxValue;

  const handler: SliderHandler = {
    onChange: null
  }

  const onMinChange = (event: Event) => {
    if (+minThumb.value >= +maxThumb.value) {
      minThumb.value = "" + (parseFloat(maxThumb.value) - parseFloat(minThumb.step));
    }
    if (handler.onChange) {
      handler.onChange(options.field, parseFloat(minThumb.value), parseFloat(maxThumb.value));
    }
    minValue.innerHTML = minThumb.value;
  };
  const onMaxChange = () => {
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