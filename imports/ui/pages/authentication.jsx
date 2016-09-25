import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Import Collection
//import { Tasks } from '../api/tasks.js';


/*
  [Authentication]
  Login, Signup, Reset Password

  [Reactive Data]
  ...
*/

class Authentication extends Component {
  render() {
    return (
      <div>
        Authentication Page
      </div>
    );
  }
}


export const AuthenticationContainer = createContainer(({ params }) => {
  /*
  const { id } = params;
  const todosHandle = Meteor.subscribe('todos.inList', id);
  const loading = !todosHandle.ready();
  const list = Lists.findOne(id);
  const listExists = !loading && !!list;
  */
  return {
  };
}, Authentication);
