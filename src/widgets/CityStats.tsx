/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import { throttle } from "@dojo/core/util";

import { subclass, declared, property } from "esri/core/accessorSupport/decorators";
import Widget = require("esri/widgets/Widget");
import { renderable, tsx } from "esri/widgets/support/widget";

import Graphic = require("esri/Graphic");
import { whenFalse, watch } from "esri/core/watchUtils";
import { eachAlways } from "esri/core/promiseUtils";
import FeatureLayer = require("esri/layers/FeatureLayer");
import Query = require("esri/tasks/support/Query");
import MapView = require("esri/views/MapView");
import FeatureLayerView = require("esri/views/layers/FeatureLayerView");

const CSS = {
  base: "widgets-citystats",
  cardBlue: "widgets-citystats--cardBlue",
  cardGreen: "widgets-citystats--cardGreen",
  cardOrange: "widgets-citystats--cardOrange",
  cardPurple: "widgets-citystats--cardPurple",
  cardTitle: "widgets-citystats--cardtitle",
  cardValue: "widgets-citystats--cardvalue",
};

@subclass("widgets.CityStats")
export default class CityStats extends declared(Widget) {

  constructor(props: Partial<CityStats>) {
    super(props);
  }

  // was a new demand of stats made
  private _refresh = false;
  // promise to the current stats.
  private _statsPromise: IPromise;

  @property()
  iconClass: string = "esri-icon-dashboard";

  @property()
  layer: FeatureLayer;

  @property()
  @renderable()
  count: number = 0;

  @property()
  @renderable()
  statistics: HashMap<number> = null;

  @property()
  view: MapView;

  /**
   * Filtering construction year
   */
  @property()
  year: number;

  postInitialize() {
    const view = this.view;
    const updateCallback = () => this.updateStatistics();

    whenFalse(this, "view.updating", updateCallback);
    watch(this, "view.extent", updateCallback);
    watch(this, "year", updateCallback);
  }

  updateStatistics() {
    if (this._statsPromise) {
      this._refresh = true;
      return;
    }

    this._refresh = false;
    this._statsPromise = this.view.whenLayerView(this.layer)
      .then((layerView: FeatureLayerView) => this.queryStatistics(layerView));
  }

  queryStatistics(layerView: FeatureLayerView) {
    // Define query parameters
    const where = `CNSTRCT_YR <= ${this.year}`;
    const geometry = this.view.extent;
    const outStatistics = [
      {
        onStatisticField: "HEIGHTROOF",
        outStatisticFieldName: "MAX_HEIGHTROOF",
        statisticType: "max"
      },
      {
        onStatisticField: "CNSTRCT_YR",
        outStatisticFieldName: "AVG_CNSTRCT_YR",
        statisticType: "avg"
      }
    ];

    // Execute the queries on the layerview
    // instead of the layer
    const countPromise = layerView.queryFeatureCount(
      new Query({
        where,
        geometry
      })
    );

    const buildStatsPromise = layerView.queryFeatures(
      new Query({
        where,
        geometry,
        outStatistics
      })
    );

    return eachAlways([
      buildStatsPromise,
      countPromise
    ])
    .then((results: any) => this.displayResults(results));
  }

  displayResults(results: any): any {
    this.statistics = results[0].value && results[0].value[0].attributes;
    this.count = results[1].value;

    this._statsPromise = null;
    // if a stats has been asked, start a new batch
    if (this._refresh) {
      this.updateStatistics();
    }
  }

  render() {
    const classes = {
    };

    const stats = this.statistics || {
      AVG_NUM_FLOORS: 0,
      MAX_HEIGHTROOF: 0,
      AVG_CNSTRCT_YR: 0
    }

    return (
      <div bind={this}
        class={CSS.base}
        classes={classes}>
        <div class={CSS.cardBlue}>
          <div class={CSS.cardTitle}>Buildings Count</div>
          <div class={CSS.cardValue}>{this.count}</div>
        </div>
        <div class={CSS.cardGreen}>
          <div class={CSS.cardTitle}>Max Height</div>
          <div class={CSS.cardValue}>{Math.round(stats.MAX_HEIGHTROOF)} ft</div>
        </div>
        <div class={CSS.cardOrange}>
          <div class={CSS.cardTitle}>Avg Construction Year</div>
          <div class={CSS.cardValue}>{Math.round(stats.AVG_CNSTRCT_YR)}</div>
        </div>
      </div>
    );
  }

}
