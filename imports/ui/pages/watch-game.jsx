import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Import Collection
//import { Tasks } from '../api/tasks.js';



/*
  [Watch Game]
    Scoreboard for an active game.

  [Reactive Data]
    Game Collection Only

*/

class WatchGame extends Component {
  render() {
    return (
      <div className="container">
        Watch Page!
      </div>
    );
  }
}


export const WatchGameContainer = createContainer(({ params }) => {
  /*
  const { id } = params;
  const todosHandle = Meteor.subscribe('todos.inList', id);
  const loading = !todosHandle.ready();
  const list = Lists.findOne(id);
  const listExists = !loading && !!list;
  */
  return {
  };
}, WatchGame);
