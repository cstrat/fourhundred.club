import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Import Collection
import { Games } from '../../api/games';

// Import Components
import { GameNewComponent } from '../components/game-new';
import { GameLoadingComponent } from '../components/game-loading';
import { GameNotFoundComponent } from '../components/game-not-found';
import { GameReadyComponent } from '../components/game-ready';
import { GameOverComponent } from '../components/game-over';

import { GamePlayComponent } from '../components/game-play';
import { GameScoresComponent } from '../components/game-scores';


/*
  [Score Game]
    Go through the score game process.
    Needs a game ID and then components are active based on the game status.
    Whoever is on this page, has full rights to score the game.

  [Reactive Data]
    Game Collection
    User Account Collection
*/

class ScoreGame extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    if (this.props.newGame) {
      return (<GameNewComponent />);
    }

    if (this.props.loading) {
      return (<GameLoadingComponent />);
    }

    if (!this.props.exists) {
      return (<GameNotFoundComponent />);
    }

    // Game is over or abandoned
    if (this.props.data.status > 1) {
      return (<GameOverComponent {...this.props} />);
    }

    // Game is on - but hasn't been kicked off yet.
    if (this.props.data.status <= 0) {
      return (<GameReadyComponent {...this.props} />);
    }

    // Game is in flight!
    if (this.props.data.status == 1) {

      return (<GamePlayComponent {...this.props} />);

      switch (this.props.data.currentRound().status) {

        // Players are yet to make their calls
        case 0:
          return (<GamePlayCallsComponent {...this.props} />);
        break;

        // Players have made their calls, and haven't logged the results
        case 1:
          return (<GamePlayMakesComponent {...this.props} />);
        break;

        // Players have logged results, awaiting confirmation (if required)
        case 2:
          return (<GameScoresComponent {...this.props} />);
        break;

        // If for whatever reason the status change doesn't trigger a new round, here is an override
        default:
          return (<GameScoresComponent {...this.props} />);
        break;
      }

    }

  }
}






/*
  [Score Game Container]
    This is the primary container where all the reactive data is fetched.
    This information is passed into the ScoreGame container.
*/

export const ScoreGameContainer = createContainer((params) => {
  const newGame   = params.newGame;
  const scoreCode = (newGame) ? null  : params.scoreCode;
  const handle    = (newGame) ? null  : Meteor.subscribe('games', { scoreCode });
  const loading   = (newGame) ? false : !handle.ready();
  const data      = (newGame) ? null  : Games.findOne();
  const exists    = !loading && !!data;

  return { newGame, scoreCode, loading, data, exists };
}, ScoreGame);
