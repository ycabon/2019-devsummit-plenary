/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

// esri.core.accessorSupport
import { subclass, declared, property } from "esri/core/accessorSupport/decorators";

// esri.widgets
import Widget = require("esri/widgets/Widget");

// esri.widgets.support
import { accessibleHandler, tsx, renderable } from "esri/widgets/support/widget";

const CSS = {
  base: "esri-widget widgets-slider",
  title: "widgets-slider--title",
  value: "widgets-slider--value"
};

@subclass("widgets.Slider")
export default class Slider extends declared(Widget) {

  constructor(props: Partial<Pick<Slider, "min" | "max" | "step" | "value" | "title" | "action" | "container">>) {
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
  @renderable()
  min: number;

  //----------------------------------
  //  title
  //----------------------------------

  @property()
  @renderable()
  max: number;

  //----------------------------------
  //  title
  //----------------------------------

  @property()
  @renderable()
  step: number;

  //----------------------------------
  //  title
  //----------------------------------

  @property()
  @renderable()
  value: number;

  //----------------------------------
  //  title
  //----------------------------------

  @property()
  @renderable()
  title = "";

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  render() {
    const titleNode = this.title ? <span class={CSS.title}>{this.title}</span> : null;
    return (
      <div bind={this}
        class={CSS.base}>
        {titleNode}
        <input
          bind={this}
          class={CSS.value}
          onchange={this._changeHandler}
          oninput={this._changeHandler}
          type="range"
          min={this.min}
          max={this.max}
          step={this.step}
          value={this.value}>
        </input>
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

