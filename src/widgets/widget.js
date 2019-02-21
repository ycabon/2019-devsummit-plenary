define([
  "htm",
  "maquette",
  "esri/widgets/Widget"
], (htm, maquette, Widget) => {

  const html = htm.bind((type, props, ...children) => maquette.h(type, props, children));

  return function(initialProps, tpl) {
    const properties = !tpl ? {} : Object.keys(initialProps).reduce((properties, key) => ({ ...properties, [key]: {} }), {});
    const Subclass = Widget.createSubclass({
      properties,
      setProps(partial) {
        Object.assign(this, partial);
        this.scheduleRender();
      },
      render() {
        return html(tpl);
      }
    });

    return (props) => {
      new Subclass(props);
    }
  };
});