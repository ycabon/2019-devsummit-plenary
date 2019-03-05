# Esri DevSummit 2019 - Plenary

The following demos were presented at the Esri DevSummit 2019 to demonstrate new client-side capabilities of the [ArcGIS API for JavaScript 4.11](https://js.arcgis.com) (Mars 2019).

### Client-side queries

[View live app](https://ycabon.github.com/2019-devsummit-plenary/1_client-side-queries.html)

This demo showcases an indicator showing the employment percentage in the current view extent. As the user pans and zooms around the indicator updates in real-time. It's built using client-side queries. Instead of going back and forth to a server, the statistical query is running directly in the web browser using [`FeatureLayerView.queryFeatures()`](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-layers-FeatureLayerView.html#queryFeatures)

[![Client-side queries](https://ycabon.github.io/2019-devsummit-plenary/1_client-side-queries.png)](https://ycabon.github.com/2019-devsummit-plenary/1_client-side-queries.html)

### GeoJSONLayer

[View live app](https://ycabon.github.io/2019-devsummit-plenary/2_geojson.html)

This demo showcases the new `GeoJSONLayer` that will be part of the ArcGIS API for JavaScript 4.11 release. Specifically, the demo covers familiar feature layer APIs like `definitionExpression`, `elevationInfo` and `renderer`.

[![GeoJSONLayer](https://ycabon.github.io/2019-devsummit-plenary/2_geojson.png)](https://ycabon.github.io/2019-devsummit-plenary/2_geojson.html)

### Filter & Effect

[View live app](https://ycabon.github.io/2019-devsummit-plenary/3_filter_effect.html)

This demo showcases the new filter and effect APIs for feature layer views.  
`FeatureFilter` allows the developer to quickly hide features using a query like object. It's possible to filter by attributes using `where` SQL clause, by geometry, by geometry and distance or by time. Features that don't pass the filter are hidden.  

```ts
layerView.filter = new FeatureFilter({
  where: `some_attr < 100`,
  geometry: new Point({
    longitude: -100,
    latitude: 40
  }),
  distance: 100,
  unit: "kilometers",
  spatialRelationship: "contains"
});
```

With `FeatureEffect` the developer can define an effect on features passing and not passing a filter. Effects are inspired by the CSS ones, i.e.: `grayscale(100%) opacity(0.5)`.

```ts
layerView.effect = new FeatureEffect({
  // Examples:
  // brightness(0.4);
  // contrast(200%);
  // grayscale(50%);
  // hue-rotate(90deg);
  // invert(75%);
  // opacity(25%);
  // saturate(30%);
  // sepia(60%);
  excludedEffect: "grayscale(100%) opacity(0.5)",

  filter: new FeatureFilter({
    where: `some_attr < 100`,
    geometry: new Point({
      longitude: -100,
      latitude: 40
    }),
    distance: 100,
    unit: "kilometers",
    spatialRelationship: "contains"
  })
});
```

[![Filter And Effect](https://ycabon.github.io/2019-devsummit-plenary/3_filter_effect.png)](https://ycabon.github.io/2019-devsummit-plenary/3_filter_effect.html)
