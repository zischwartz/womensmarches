import React from 'react';

require('./app.css')

import Map from './map.js'

console.log("Trump Stinks!")

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {show_info: true}
  }
  componentDidMount(){

  }
  render(){
    let info_style = this.state.show_info ? {display:"block"} : {display:"none"}
    return <div id="app">
      <div id="info" style={info_style}>
        <p><strong>Women's Marches on January 21 2017</strong></p>
        <p><a href="https://twitter.com/womensmarch">Get Involved!</a></p>
        <p>This map shows the high estimate for the size of each crowd based on <a href="https://docs.google.com/spreadsheets/d/1xa0iLqYKz8x9Yc_rfhtmSOJQ2EGgeUVjvV4A8LsIaxY/edit#gid=0">this spreadsheet</a> which is being collected by Prof <a href="https://twitter.com/djpressman">Jeremy Pressman</a> and others. </p>
        <p>By <a href="https://twitter.com/zischwartz">Zach Schwartz</a> | <a href="https://github.com/zischwartz/womensmarches">Source Code</a></p>
        <p className="right"><a href="#" onClick={()=> this.setState({show_info:false})}>❌ Close This</a></p>
      </div>
      <Map/>
    </div>
  }
}

export default App;
