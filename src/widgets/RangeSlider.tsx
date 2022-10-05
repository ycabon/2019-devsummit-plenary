// esri.core.accessorSupport
import { subclass, property } from "esri/core/accessorSupport/decorators";

// esri.widgets
import Widget = require("esri/widgets/Widget");

// esri.widgets.support
import { accessibleHandler, tsx } from "esri/widgets/support/widget";

const CSS = {
  base: "esri-widget widgets-slider",
  title: "widgets-slider--title",
  value: "widgets-slider--value"
};

@subclass("widgets.Slider")
export default class Slider extends Widget {

  constructor(props: Partial<Pick<Slider, "min" | "max" | "step" | "value" | "title" | "action">>) {
    super(props as any);
  }

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  action
  //----------------------------------

  @property()
  action: (value: number) => void;

  //----------------------------------
  //  title
  //----------------------------------

  @property()
  min: number;

  //----------------------------------
  //  title
  //----------------------------------

  @property()
  max: number;

  //----------------------------------
  //  title
  //----------------------------------

  @property()
  step: number;

  //----------------------------------
  //  title
  //----------------------------------

  @property()
  value: number;

  //----------------------------------
  //  title
  //----------------------------------

  @property()
  title = "";

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  render() {
    return (
      <div bind={this}
        class={CSS.base}>
        <span class={CSS.title}>{this.title}</span>
        <div class="aria-widget-slider">
          <div class="rail-label min">
            0
          </div>
          <div class="rail" style="width: 300px;">
            <img id="minPriceHotel"
                src="images/min-arrow.png"
                role="slider"
                tabindex="0"
                class="min thumb"
                aria-valuemin="0"
                aria-valuenow="100"
                aria-valuetext="$100"
                aria-valuemax="400"
                aria-label="Hotel Minimum Price"></img>
            <img id="maxPriceHotel"
                src="images/max-arrow.png"
                role="slider"
                tabindex="0"
                class="max thumb"
                aria-valuemin="0"
                aria-valuenow="250"
                aria-valuetext="$250"
                aria-valuemax="400"
                aria-label="Hotel Maximum Price"></img>
          </div>
          <div class="rail-label max">
            0
          </div>
        </div>
      </div>
    );
  }

  @accessibleHandler()
  private _changeHandler(event: Event): void {
    this.value = parseFloat((event.target as HTMLInputElement).value);
    if (this.action) {
      this.action(this.value);
    }
  }
}

