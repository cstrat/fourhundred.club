import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Import Collection
//import { Tasks } from '../api/tasks.js';


/*
  [Layout]
  This is the main frame for the page components.

  [Reactive Data]
    User account
*/

class Layout extends Component {
  render() {
    return(
      <div id="app">
        <h1>fourhundred<span>.club</span></h1>
        {this.props.content}
      </div>
    )
  }
}


export const LayoutContainer = createContainer(({ params }) => {
  /*
  const { id } = params;
  const todosHandle = Meteor.subscribe('todos.inList', id);
  const loading = !todosHandle.ready();
  const list = Lists.findOne(id);
  const listExists = !loading && !!list;
  */
  return {

  };
}, Layout);
