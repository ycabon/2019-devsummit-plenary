define(["widgets/widget"], function(widget) {
  return widget({ title: "" }, `
    <div>${this.title}</div>
  `);
});