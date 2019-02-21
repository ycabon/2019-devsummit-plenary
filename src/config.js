const href = location.href;
var appName = href.substring(href.lastIndexOf('/') + 1, href.indexOf(".html"));
var path = href.substring(0, href.lastIndexOf('/'));

var api = `https://jsdev.arcgis.com/4.11/dojo/dojo.js`;

var loaderConfig = {
  has: {
    // This flag moves data processing of client feature layer classes
    // to workers. We are still figuring out how to make this the default
    "esri-workers-for-memory-layers": 1,
  },
  paths: {
    app: `${path}/src/${appName}`
  },
  packages: [
    {
      name: "widgets",
      location: `${path}/src/widgets/`
    },
    {
      name: "htm",
      location: "https://unpkg.com/htm@2.0.0/",
      main: "dist/htm.umd"
    }
  ],
  deps: [`app/application`]
};

window.dojoConfig = loaderConfig;