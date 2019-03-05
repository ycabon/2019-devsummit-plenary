/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import { subclass, declared, property } from "esri/core/accessorSupport/decorators";
import Widget = require("esri/widgets/Widget");
import { renderable, tsx } from "esri/widgets/support/widget";

const CSS = {
  base: "widgets-header",
  actionContent: "widgets-header--actionContent",
  label: "widgets-header--label"
};

@subclass("widgets.Header")
export default class Header extends declared(Widget) {

  constructor(props: Partial<Pick<Header, "title" | "actionContent">>) {
    super(props as any);
  }

  @property()
  @renderable()
  title: string = "";

  @property()
  @renderable()
  actionContent: Widget[];

  render() {
    const classes = {
    };

    return (
      <div bind={this}
        class={CSS.base}
        classes={classes}>
        <div class={CSS.label}>{this.title}</div>
        <div class={CSS.actionContent}>{
          this.actionContent && this.actionContent.map(content => content.render())
        }</div>
      </div>
    );
  }

}
