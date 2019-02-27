import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");
import WebMap = require("esri/WebMap");
import TileLayer = require("esri/layers/TileLayer");
import WebScene = require("esri/WebScene");
import { ClassBreaksRenderer, SimpleRenderer } from "esri/renderers";
import { PictureMarkerSymbol, SimpleMarkerSymbol } from "esri/symbols";
import Header from "../widgets/Header";
import IconButton from "../widgets/IconButton";
import Slider from "../widgets/Slider";
import ToggleIconButton from "../widgets/ToggleIconButton";
import ActionButton = require("esri/support/actions/ActionButton");
import GeoJSONLayer = require("esri/layers/GeoJSONLayer");
import SizeVariable = require("esri/renderers/visualVariables/SizeVariable");
import Expand = require("esri/widgets/Expand");
import histogram = require("esri/renderers/smartMapping/statistics/histogram");
import FeatureFilter = require("esri/views/layers/support/FeatureFilter");
import FeatureLayerView = require("esri/views/layers/FeatureLayerView");

let map: WebMap;
let mapView: MapView;

function createLayer() {
  return new GeoJSONLayer({
    url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
    title: "USGS Earthquakes",
    copyright: "USGS",
    popupTemplate: {
      title: `{title}`,
      content: `
        Earthquake of magnitude {mag} on {time}.<br />
      `,
      outFields: ["url"]
    },
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
        "name": "url",
        "type": "string"
      },
      {
        "name": "title",
        "type": "string"
      }
    ],
    renderer: new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({
        style: "circle",
        color: "red",
        outline: {
          color: "rgba(255,255,255,0.2)",
          width: 1
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
            size: 2,
            label: "> 2.5"
          },
          {
            value: 5,
            size: 10
          },
          {
            value: 6,
            size: 20
          },
          {
            value: 7,
            size: 40
          },
          {
            value: 8,
            size: 60,
            label: "> 8"
          }]
        })
      ]
    })
  });
}

(async () => {
  map = new WebMap({
    basemap: {
      baseLayers: [
        new TileLayer({
          url: "https://tilesdevext.arcgis.com/tiles/LkFyxb9zDq7vAOAm/arcgis/rest/services/VintageHillshadeEqualEarth_Pacific/MapServer"
        })
      ]
    },
    layers: [createLayer()]
  });

  map.basemap.baseLayers.getItemAt(0).opacity = 0.90;

  mapView = new MapView({
    container: "viewDiv",
    map,
    ui: {
      components: ["attribution"]
    }
  });

  setupUI(mapView);
  setupSliders(map.layers.getItemAt(0) as GeoJSONLayer);
})();

async function setupUI(view: MapView | SceneView) {
  const [Legend, Zoom, Home, { default: Indicator }] = await Promise.all([
    import("esri/widgets/Legend"),
    import("esri/widgets/Zoom"),
    import("esri/widgets/Home"),
    import("../widgets/Indicator")
  ]);

  const zoom = new Zoom({
    view,
    layout: "horizontal"
  });

  const home = new Home({
    view
  });

  view.ui.add(zoom, "bottom-left");
  view.ui.add(home, "bottom-left");

  view.ui.add(new Header({
    title: "GeoJSON",
    actionContent: [
      new ToggleIconButton({
        title: "Filter",
        toggle: () => {
          const panel = document.getElementById("panel");
          panel.classList.toggle("hidden");
        }
      })
    ]
  }));

  view.popup.viewModel.on("trigger-action", (event) => {
    if (event.action.id === "more-details") {
      window.open(view.popup.viewModel.selectedFeature.attributes.url, "_blank");
    }
  });
}

const filter = new FeatureFilter();

async function updateFilter(): Promise<void> {
  const lv2d = mapView.layerViews.getItemAt(0) as FeatureLayerView;

  lv2d && (lv2d.filter = filter.clone());
}

function setupSliders(layer: GeoJSONLayer): void {
  const magnitudeSlider = setupSlider(layer, document.getElementById("magnitudeSlider"), {
    field: "mag",
    minValue: 0,
    maxValue: 8,
    numBins: 16
  });

  magnitudeSlider.onChange = (field, minValue, maxValue) => {
    filter.where = `mag >= ${minValue} AND mag <= ${maxValue}`;
    updateFilter();
  }

  const timeSlider = setupSlider(layer, document.getElementById("timeSlider"), {
    field: "time",
    numBins: 8
  });
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
  const histogramEl: HTMLDivElement = element.querySelector(".histogram");

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

  const minThumb: HTMLInputElement = element.querySelector(".thumb-min");
  const maxThumb: HTMLInputElement = element.querySelector(".thumb-max");

  const minValue: HTMLSpanElement = element.querySelector(".thumb-min-value");
  const maxValue: HTMLSpanElement = element.querySelector(".thumb-max-value");

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