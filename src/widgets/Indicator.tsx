/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import { subclass, declared, property } from "esri/core/accessorSupport/decorators";
import Widget = require("esri/widgets/Widget");
import { renderable, tsx } from "esri/widgets/support/widget";

import { whenFalse, watch } from "esri/core/watchUtils";
import GroupLayer = require("esri/layers/GroupLayer");
import FeatureLayer = require("esri/layers/FeatureLayer");
import GeoJSONLayer = require("esri/layers/GeoJSONLayer");
import CSVLayer = require("esri/layers/CSVLayer");
import StatisticDefinition = require("esri/tasks/support/StatisticDefinition");
import MapView = require("esri/views/MapView");
import FeatureLayerView = require("esri/views/layers/FeatureLayerView");
import { Extent, Polygon } from "esri/geometry";

const CSS = {
  base: "widgets-indicator esri-widget",
  titleWrapper: "widgets-indicator--title-wrapper",
  title: "widgets-indicator--title",
  valueWrapper: "widgets-indicator--value-wrapper",
  value: "widgets-indicator--value",
};

@subclass("widgets.Indicator")
export default class Indicator extends declared(Widget) {

  constructor(props?: Partial<Pick<Indicator, "queryStatistics" | "title" | "layer" | "view" | "format" | "container">>) {
    super();
  }

  // promise to the current stats.
  private _statsPromise: IPromise = null;
  private _refresh: boolean = false;

  @property()
  iconClass: string = "esri-icon-dashboard";

  @renderable()
  format: Intl.NumberFormat;

  @property()
  queryStatistics: (layerView: FeatureLayerView, geometry: Extent | Polygon) => Promise<number>;

  @property()
  layer: GroupLayer | FeatureLayer | CSVLayer | GeoJSONLayer;

  @property()
  @renderable()
  title: string;

  @property()
  @renderable()
  value: number;

  @property()
  view: MapView;

  @property()
  geometry: Extent | Polygon;

  postInitialize() {
    const updateCallback = () => this.updateStatistics();
    this.own([
      whenFalse(this, "view.updating", updateCallback),
      watch(this, ["view.extent", "statisticDefinition", "geometry"], updateCallback)
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
