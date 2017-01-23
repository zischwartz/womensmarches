import React from 'react';
import mapboxgl from 'mapbox-gl'
import LegendControl from './legend.js'
import {getDistance} from '../utils.js'


mapboxgl.accessToken = 'pk.eyJ1IjoiemlzY2h3YXJ0eiIsImEiOiJjaXhxOXp5eGIwOHJqMzNubnI2Zjh2a2RjIn0.CMKNggl2Se8uH0GEKEJcJw'
window.mapboxgl = mapboxgl
// image markers example, possibly useful
// https://www.mapbox.com/mapbox-gl-js/example/geojson-markers/

class Map extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount(){
    if (!mapboxgl.supported()) {
      alert('Your browser does not support Mapbox GL');
      return
    } else { console.log('supported!')}
    make_map(this.refs.mapboxMap).then(load_data).then(([geojson, map])=> {
      window.map = map //debug
      map.addSource('data', {
        type: 'geojson',
        data: geojson,
        // cluster: true, // https://www.mapbox.com/mapbox-gl-js/example/cluster/
        // clusterRadius: 25 // default is 50
      })
      // console.log('done adding data')
      map.addLayer(point_layer_obj()); // end add layer
      // same as above, just need a different one for hover/click
      let hover_layer = point_layer_obj()
      hover_layer['paint']['circle-color']= 'rgba(100, 180, 200, 0.9)'
      hover_layer['id'] =  'point-hover'
      hover_layer['filter'] =  ["==", 'full_place', "NONE"]
      map.addLayer(hover_layer)
      // map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100,  unit: 'imperial'  }))
      // map.addControl(new LegendControl({scale:scale_for_legend, value:1e5}))
      map.addControl(new mapboxgl.NavigationControl());
      // map.addControl(new mapboxgl.GeolocateControl({  positionOptions: {   enableHighAccuracy: true }}))
      // finally setup our popups
      setup_popups(map)
      // for funsies
      setTimeout(()=> map.zoomIn() , 500)
    })
  }
  render() {
    return (<div ref="mapboxMap" id="map"/>);
  }
}

export default Map;


// Helpers !
// -------------------

function general_scale(value, zoomdiff){
  let rad = Math.sqrt(value)/3 // sure why not
  rad*=zoomdiff
  return Math.round(rad)
}

// uses the above
function scale_for_legend(value, map){
  let zd = map.getZoom()-map.getMinZoom()
  zd = Math.max(zd, 1) // make sure it's at least 1
  let rad = general_scale(value, zd)
  let width = rad*2
  width-=2 // to make up for the white border sorta
  return width
}


function load_data(map) {
  return new Promise(function(resolve, reject){
        require.ensure([], function() {
          let marches = require("../../data/marches.json")
          var geojson = {features: [],  type: 'FeatureCollection'}
          for (let [index, march] of marches.entries()) {
            let f = create_feature(march.lng, march.lat, march)
            geojson.features.push(f)
          }
          resolve([geojson, map])


      }) // end ensure
  }) // end promise, which is returned
} // end load data



var bounds = [
    [-201.21943658896294, -82.53867022120976], // Southwest coordinates
    [186.5540009109581, 80.0606203667802]  // Northeast coordinates
];

function make_map(container){
  // console.log('make map called, about to promise')
  // console.log(mapboxgl.version)
  return new Promise(function(resolve, reject){
    let map = new mapboxgl.Map({
          container: container, // can be element or element id
          // style: 'mapbox://styles/mapbox/streets-v9',
          zoom: 2,
          minZoom: 1,
          maxZoom: 16,
          center:[-99, 40],
          maxBounds: bounds, // Sets bounds as max
          style: 'mapbox://styles/mapbox/dark-v9', //hosted style id
      })
    map.on('load', ()=> resolve(map) )
  })
}

export function create_feature(lng, lat, properties={}){
  return {
    type: 'Feature',
    properties: properties,
    geometry: {
      type: 'Point',
      coordinates: [lng, lat]
    }
  }
}

// map.on('mouseover', function(e) {
//   var features = map.queryRenderedFeatures(e.point, { layers: ['point'] });
//  // Change the cursor style as a UI indicator.
//   map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
// })

function setup_popups(map){

  var popup = new mapboxgl.Popup({closeButton: false,  closeOnClick: false })
  map.on('mousedown', function(e) {
    if (!e.point){return}
    // console.log(e.lngLat)
    var features = map.queryRenderedFeatures(e.point, { layers: ['point'] });
    if (!features.length) {
        popup.remove();
        return;
    }
    // XXX
    // this is a hack because queryRenderedFeatures returns too many results when data driven circle radius
    // see https://github.com/mapbox/mapbox-gl-js/issues/3604
    // not performant enough for on mousemove, had to add lat lng because of this
    features.sort( (a, b)=>{
      return getDistance(e.lngLat, {lat:a.properties.lat, lng:a.properties.lng})-getDistance(e.lngLat, {lat:b.properties.lat, lng:b.properties.lng})
    })
    // console.log(features)
    var feature = features[0];
    if (feature){
      map.setFilter('point-hover', ["==", 'full_place', feature.properties.full_place])
    }
    // console.log(feature)
    // Populate the popup and set its coordinates
    // based on the feature found.
    let props = feature.properties
    let min = props.estimate_low ? `Low Estimate: ${props.estimate_low.toLocaleString()}<br/>` : ''
    let source = props.source && props.source.indexOf('http:') ==0 ? `<a href="${props.source}">Source</a><br/>`:''
    popup.setLngLat(feature.geometry.coordinates)
        .setHTML(`<strong>${props.place}</strong><br/>High Estimate: ${props.estimate_high.toLocaleString()}<br/>${min}${source}`
        ).addTo(map);
    }) // end on mousedown
}



// don't actually include min zoom in our zoom stops, as that would  cause the difference to be 0
// also, I don't totally understand how the stops work. like how does it interpolate? wish it oculd juse use d3-scale
function create_stops(zooms=[2,4,6,8,10,12,14,16], values=[1e2, 1e7], min_zoom=1){
  let stops = []
  for (let zoom of zooms){
    for (let value of values){
      let rad = general_scale(value, zoom-min_zoom)
      let s = [{zoom, value}, rad]
      stops.push(s)
    }
  }
  return stops
}

// console.log( create_stops() )

function point_layer_obj(){
  return {
    id: 'point',
    type: 'circle',
    source: 'data',
    paint: {
      'circle-color': 'rgba(100, 150, 150, 0.2)',
      // 'circle-stroke-color': 'rgba(10, 70, 70, 0.5)',
      'circle-stroke-color': 'rgba(0, 150, 150, 0.5)',
      'circle-stroke-width': 1,
      // 'circle-color': 'red',
      // 'circle-radius': 4,
      'circle-radius': {
        // property: 'max',
        property: 'estimate_high',
        stops: create_stops()

      }
    }
  }
}
