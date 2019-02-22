/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

// esri.core.accessorSupport
import { subclass, declared, property } from "esri/core/accessorSupport/decorators";

// esri.widgets
import Widget = require("esri/widgets/Widget");

// esri.widgets.support
import { accessibleHandler, tsx, renderable } from "esri/widgets/support/widget";

const CSS = {
  button: "esri-widget-button esri-widget widgets-iconbutton",
  disabled: "esri-disabled",
  interactive: "esri-interactive",
  icon: "esri-icon"
};

@subclass("widgets.IconButton")
export default class IconButton extends declared(Widget) {

  constructor(props: Partial<Pick<IconButton, "iconClass" | "title" | "action">>) {
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
  action: Function;

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
      [CSS.interactive]: this.enabled
    };
    const iconClasses = {
      [this.iconClass]: !!this.iconClass
    };

    const iconRendered = !this.iconClass ?
      null :
      <span aria-hidden="true"
        role="presentation"
        class={CSS.icon}
        classes={iconClasses} />;


    const titleRendered = !this.title ?
      null :
      <span>{this.title}</span>;

    return (
      <div bind={this}
        class={CSS.button}
        classes={rootClasses}
        onclick={this._triggerAction}
        onkeydown={this._triggerAction}
        role="button"
        tabIndex={tabIndex}
        title={this.title}>
        {iconRendered}
        {titleRendered}
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
      this.action.call(this);
    }
  }

}

