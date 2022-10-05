import { subclass, property } from "esri/core/accessorSupport/decorators";
import Widget = require("esri/widgets/Widget");
import { tsx } from "esri/widgets/support/widget";

const CSS = {
  base: "widgets-header",
  actionContent: "widgets-header--actionContent",
  label: "widgets-header--label"
};

@subclass("widgets.Header")
export default class Header extends Widget {

  constructor(props: Partial<Pick<Header, "title" | "actionContent">>) {
    super(props as any);
  }

  @property()
  title: string = "";

  @property()
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
