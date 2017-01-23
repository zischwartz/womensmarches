// let first = marches[1]
// console.log(marches[0])
// get rid of the header
// marches.shift()
// for debug, just do a couple
// marches = [marches[0], marches[1]]
// return
//do it, create promises and run geocode api call
let get_location_string = m=>{
  let usa = m[0]=="1" ? ', United States' : ''
  let state = usa ? madison.getStateNameSync(m[3]) : m[3]
  return `${m[2]}, ${state} ${usa}`
}
// let march_promises = marches.map(m=>`${m[2]}, ${madison.getStateNameSync(m[3])} ${m[0]=="1" ? ', United States' : ''}`)
// console.log(march_promises)
// return



// let [min, max, city, state, source] = [march[4], march[5], march[2], march[3], march[10] ]
// max = parseInt(max.replace(/,/g,''))
// min = min || 0
// if (min){min = parseInt(min.replace(/,/g, '')) }
// let id = `${city}, ${state}`


function fix_antarctic(a){
  a.properties.lat = -73.92752353031402
  a.properties.lng = -64.56061004287041
  a.geometry.coordinates = [a.properties.lng, a.properties.lat ]
  return a
}

// let a = marches.features.filter( f=>f.properties.id=='Antarctic Peninsula, Antarctic Peninsula')
// a = fix_antarctic(a[0])
