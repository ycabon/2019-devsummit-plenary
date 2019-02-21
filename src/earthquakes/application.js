define([
  "widgets/widget",
  "widgets/header"
], function(widget, header) {

  const application = widget({

  }, `
    <div>
      <${header} title="test">
    </div>
  `);

  const app = application({
    container: document.getElementById("applicationDiv")
  });

});