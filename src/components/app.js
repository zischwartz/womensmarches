import React from 'react';

require('./app.css')

import Map from './map.js'

console.log("👹 TRUMP STINKS")

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
        <a className='close' href="#" onClick={()=> this.setState({show_info:false})}>X</a>
        <div className='title'><strong>Worldwide <a href="https://twitter.com/womensmarch">Women's Marches</a> on January 21 2017</strong></div>
        <p>This map shows the high estimate for the size of each crowd based on <a href="https://docs.google.com/spreadsheets/d/1xa0iLqYKz8x9Yc_rfhtmSOJQ2EGgeUVjvV4A8LsIaxY/edit#gid=0">this spreadsheet</a> which is being collected by Professors <a href="https://twitter.com/djpressman">Jeremy Pressman</a>, <a href="https://twitter.com/EricaChenoweth">Erica Chenoweth</a>, and others</p>
        <p>By <a href="https://twitter.com/zischwartz">Zach Schwartz</a> | <a href="https://github.com/zischwartz/womensmarches">Source Code</a></p>
      </div>
      <Map/>
    </div>
  }
}

export default App;
