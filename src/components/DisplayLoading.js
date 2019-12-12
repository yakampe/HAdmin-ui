import React, { Component } from 'react';

class DisplayLoading extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }


  render () {
    return <React.Fragment>
      <div   style={{marginLeft: 'auto',
        marginRight: 'auto',
        width: 0}}>
        <img src="../img/loading.gif"/>
      </div>
    </React.Fragment>
  }


}

export default DisplayLoading;