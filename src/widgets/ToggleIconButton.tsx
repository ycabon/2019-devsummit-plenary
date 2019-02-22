/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import { subclass, declared, property } from "esri/core/accessorSupport/decorators";

import Widget = require("esri/widgets/Widget");
import { accessibleHandler, tsx, renderable } from "esri/widgets/support/widget";

const CSS = {
  button: "esri-widget-button esri-widget widgets-toggleiconbutton",
  disabled: "esri-disabled",
  interactive: "esri-interactive",
  icon: "esri-icon",
  toggled: "widgets-toggleiconbutton--toggled",
  content: "widgets-toggleiconbutton--content",
  indicator: "widgets-toggleiconbutton--indicator"
};

@subclass("widgets.ToggleIconButton")
export default class ToggleIconButton extends declared(Widget) {

  constructor(props: Partial<Pick<ToggleIconButton, "toggled" | "iconClass" | "title" | "toggle" | "enabled">>) {
    super(props as any);
  }

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  toggled
  //----------------------------------

  @property()
  @renderable()
  toggled: boolean = false;

  //----------------------------------
  //  action
  //----------------------------------

  @property()
  toggle: () => void;

  //----------------------------------
  //  enabled
  //----------------------------------

  @property()
  @renderable()
  enabled = true;

  //----------------------------------
  //  iconClass
  //----------------------------------

  @property({
    readOnly: false
  })
  @renderable()
  iconClass = "";

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
    const tabIndex = this.enabled ? 0 : -1;
    const rootClasses = {
      [CSS.disabled]: !this.enabled,
      [CSS.interactive]: this.enabled,
      [CSS.toggled]: this.toggled
    };

    const iconClasses = {
      [this.iconClass]: !!this.iconClass
    };

    const titleRendered = this.title ? <span>{this.title}</span> : null;

    return (
      <div bind={this}
        class={CSS.button}
        classes={rootClasses}
        onclick={this._triggerAction}
        onkeydown={this._triggerAction}
        role="button"
        tabIndex={tabIndex}
        title={this.title}>
        <div class={CSS.content}>
          <span aria-hidden="true"
            role="presentation"
            class={CSS.icon}
            classes={iconClasses} />
          {titleRendered}
        </div>
        <div class={CSS.indicator}></div>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  @accessibleHandler()
  private _triggerAction(): void {
    if (this.enabled) {
      this.toggled = !this.toggled;
      this.toggle.call(this);
    }
  }

}

