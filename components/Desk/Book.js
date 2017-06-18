import React from 'react'

import Textmore from './Textmore/Item';

const Book = React.createClass({

  render() {
    return <Textmore id={this.props.params.id}/>
  }
})

module.exports = Book
