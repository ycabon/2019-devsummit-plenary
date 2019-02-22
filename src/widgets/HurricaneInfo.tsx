/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import { subclass, declared, property } from "esri/core/accessorSupport/decorators";
import Widget = require("esri/widgets/Widget");
import { renderable, tsx } from "esri/widgets/support/widget";

const CSS = {
  base: "widgets-hurricaneinfo",
  background: "widgets-hurricaneinfo--background",
  modal: "widgets-hurricaneinfo--modal",
  visible: "widgets-hurricaneinfo--visible",

  hurricaneName: "widgets-hurricaneinfo--hurricane-name",
  hurricaneSeason: "widgets-hurricaneinfo--hurricane-season",
  hurricaneMaxWind: "widgets-hurricaneinfo--hurricane-maxwind",
  hurricaneInfo: "widgets-hurricaneinfo--info",
};

interface HurricaneInfo<T> {
  on(name: "drop", eventHandler: (event: { item: T }) => void): IHandle;
}

@subclass("widgets.HurricaneInfo")
class HurricaneInfo<T = any> extends declared(Widget) {

  // constructor(props: Partial<Pick<HurricaneInfo<T>, "drop" | "view">>) {
  //   super(props as any);
  // }
  @property()
  @renderable()
  hurricane: HashMap<any>;

  render() {
    const classes = {
      [CSS.visible]: this.hurricane != null
    };

    const hurricane = this.hurricane;
    const renderedHurricanes = !hurricane ? null : (
      <div class={CSS.modal}>
        <div class={CSS.hurricaneInfo}>
          <div class={CSS.hurricaneSeason}>{hurricane.season}</div>
          <div class={CSS.hurricaneMaxWind}>{Math.round(hurricane.maxWind * 1.852) +" km/h"}</div>
        </div>
        <div class={CSS.hurricaneName}>{hurricane.name}</div>
      </div>
    );

    return (
      <div bind={this}
        classes={classes}
        class={CSS.base}>
        <div class={CSS.background}>
          {renderedHurricanes}
        </div>
      </div>
    );
  }
}

export default HurricaneInfo;
