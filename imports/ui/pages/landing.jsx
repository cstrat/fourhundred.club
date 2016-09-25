import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Import Collection
//import { Tasks } from '../api/tasks.js';


/*
  [Landing]
    Quick Start & Information

  [Reactive Data]
    ...
*/

class Landing extends Component {
  render() {
    return (
      <div className="landing-page">

        <h2>whats this about</h2>

        <p>
          I've got a mate who recons he is the best at 400 ever... He recounts stories of calling 10 and making it multiple times when no one else can remember.
          Anyway, this will be our place to keep our games logged. Stats will be collated and games can be reported on. I am working on building all this functionality into the app.
        </p>

        <h2>will it work with my rules?</h2>

        <p>
          I am still working on the app, right now it only really supports our scoring.
        </p>
        <ul>
          <li>Calls of 5,6,7,8 will double.</li>
          <li>Calls of 9,10,11,12 triple.</li>
        </ul>

        <h2>how can I use this?</h2>
        <p>
          Right now you just need to <a href="/score/">setup your match</a> on that page and the game will play.
          Whoever has the URL to the game will be able to score, so I advise only one person load it on their phone at the moment.
          I am building a spectator view so the others playing can load a screen up with the scoreboard (and not intefere with scoring).
        </p>

      </div>
    );
  }
}


export const LandingContainer = createContainer(({ params }) => {
  /*
  const { id } = params;
  const todosHandle = Meteor.subscribe('todos.inList', id);
  const loading = !todosHandle.ready();
  const list = Lists.findOne(id);
  const listExists = !loading && !!list;
  */
  return {
  };
}, Landing);
