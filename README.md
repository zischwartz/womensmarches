## Women's Marches on January 21 2017 Bubble Map
This map shows the high estimate for the size of each crowd based on [this spreadsheet](https://docs.google.com/spreadsheets/d/1xa0iLqYKz8x9Yc_rfhtmSOJQ2EGgeUVjvV4A8LsIaxY/edit#gid=0) which is being collected by Prof [Jeremy Pressman](https://twitter.com/djpressman) and others.

### Code/Tech Notes
After downloading the spreadsheet as a `csv`(ok, after unsuccessfully trying to use google's sheet "feeds" to load it dynamically as json), I used [jupyter notebook](http://jupyter.org/) for data processing (see [`wmcrowds.ipynb`](https://github.com/zischwartz/womensmarches/blob/master/wmcrowds.ipynb)) and then [`mapbox-gl-js`](https://github.com/mapbox/mapbox-gl-js) to actually create the map.

#### Mapbox-gl-js
`mapbox-gl-js` uses the WebGL so it's crazy fast. It also makes it relatively simple to do things like scale the displayed data by both the current zoom level and the sqrt of it's magnitude.

#### Clicking
Less simple was allowing the user to click on circles to display the county name and population. `queryRenderedFeatures` is meant for this, but as [this issue](https://github.com/mapbox/mapbox-gl-js/issues/3604) notes, it's broken for "data-driven circles" and other similar cases.

To fix this, I wrote a quick kludge that computes the distances of all the features returned by `queryRenderedFeatures` to the click, and picks the closest one.

#### Mobile/ iOS
The map wouldn't load at all on my iPhone. The safari dev console threw no errors, until I tried to manually create a map in the console, which threw `Error: Map canvas (1960x2922) is larger than half of gl.MAX_RENDERBUFFER_SIZE (2048)`.  [These](https://github.com/mapbox/mapbox-gl-js/issues/3935)  [issues](https://github.com/mapbox/mapbox-gl-js/issues/2893) explain some, but the simplest fix was to simply rollback mapboxgl a few versions to [`0.29.0`](https://github.com/mapbox/mapbox-gl-js/releases/tag/v0.29.0) which was before this bug was introduced.

`http-server` and xip.io were super helpful for debugging this.


## Development
I was working on a larger project and extracted this. Because I'm lazy, I left the project structure, build system, and react/jsx rendering as they were, though they are largely unnecessary here.

To get started, install the dependencies and start the dev server

```bash
npm install
npm start

``


Created by [Zach Schwartz](https://twitter.com/zischwartz)
