import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Import Collection
import { Games } from '../../api/games';

// Import Components
import { GameLoadingComponent } from '../components/game-loading';
import { GameNotFoundComponent } from '../components/game-not-found';
import { GameScoresComponent } from '../components/game-scores';


/*
  [Watch Game]
    Scoreboard for an active game.

  [Reactive Data]
    Game Collection Only

*/

class WatchGame extends Component {
  render() {

    if (this.props.loading) {
      return (<GameLoadingComponent />);
    }

    if (!this.props.exists) {
      return (<GameNotFoundComponent />);
    }

    return (
      <div className="container">
        <GameScoresComponent {...this.props} />
      </div>
    );
  }
}


export const WatchGameContainer = createContainer((params) => {
  const watchCode = params.watchCode;
  const handle    = Meteor.subscribe('games', { watchCode });
  const loading   = !handle.ready();
  const data      = Games.findOne();
  const exists    = !loading && !!data;

  return { watchCode, loading, data, exists };
}, WatchGame);
