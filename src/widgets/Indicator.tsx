import { subclass, property } from "esri/core/accessorSupport/decorators";
import Widget = require("esri/widgets/Widget");
import { tsx } from "esri/widgets/support/widget";

import GroupLayer = require("esri/layers/GroupLayer");
import FeatureLayer = require("esri/layers/FeatureLayer");
import GeoJSONLayer = require("esri/layers/GeoJSONLayer");
import CSVLayer = require("esri/layers/CSVLayer");
import MapView = require("esri/views/MapView");
import FeatureLayerView = require("esri/views/layers/FeatureLayerView");
import { Extent, Polygon } from "esri/geometry";
import { watch, when } from "esri/core/reactiveUtils";

const CSS = {
  base: "esri-widget widgets-indicator",
  titleWrapper: "widgets-indicator--title-wrapper",
  title: "widgets-indicator--title",
  valueWrapper: "widgets-indicator--value-wrapper",
  value: "widgets-indicator--value",
};

@subclass("widgets.Indicator")
export default class Indicator extends Widget {

  constructor(props?: Partial<Pick<Indicator, "queryStatistics" | "title" | "layer" | "view" | "format" | "container">>) {
    super(props);
  }

  // promise to the current stats.
  private _statsPromise: Promise<number> = null;
  private _refresh: boolean = false;

  @property()
  iconClass: string = "esri-icon-dashboard";

  format: Intl.NumberFormat;

  @property()
  queryStatistics: (layerView: FeatureLayerView, geometry: Extent | Polygon) => Promise<number>;

  @property()
  layer: GroupLayer | FeatureLayer | CSVLayer | GeoJSONLayer;

  @property()
  title: string;

  @property()
  value: number;

  @property()
  view: MapView;

  @property()
  geometry: Extent | Polygon;

  initialize() {
    const updateCallback = () => this.updateStatistics();
    this.own([
      when(() => !this.view?.updating, updateCallback),
      watch(() => [this.view?.extent, this.geometry], updateCallback)
    ])
  }

  updateStatistics(): void {
    if (this._statsPromise) {
      this._refresh = true;
      return;
    }

    if (!this.view || !this.layer || !this.queryStatistics) {
      this.value = null;
      return;
    }

    this._refresh = false;

    let layerView: FeatureLayerView;

    if ("layers" in this.layer) {
      const layers = this.layer.layers.toArray();

      search: for (const layer of layers) {
        const lv = this.view.allLayerViews.find((layerView) => layerView.layer === layer);

        if (!lv.suspended) {
          layerView = lv as FeatureLayerView;
          break search;
        }
      }
    }
    else {
      layerView = this.view.allLayerViews.find(layerView => layerView.layer === this.layer) as FeatureLayerView;
    }

    this._statsPromise = this.queryStatistics(layerView, this.geometry || this.view.extent)
      .then((value) => {
        this.value = value;

        this._statsPromise = null;
        if (this._refresh) {
          this.updateStatistics();
        }
      })
      .catch((error) => {
        console.error(error);
        this._statsPromise = null;
        if (this._refresh) {
          this.updateStatistics();
        }
      }) as unknown as IPromise<number>;
  }

  render() {
    const classes = {
    };
    return (
      <div bind={this}
        class={CSS.base}
        classes={classes}>
        <div class={CSS.titleWrapper}><span class={CSS.title}>{this.title}</span></div>
        <div class={CSS.valueWrapper}><span class={CSS.value}>{!this.value ? "-" : this.format.format(this.value)}</span></div>
      </div>
    );
  }

}
