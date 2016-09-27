import React, { Component } from 'react';
import { GameScoresComponent } from '../components/game-scores';

/*
  [Game Over Component]
    This is what gets hit when a user tries to goto a game which doesn't exist.
    Should show a message about how free games are automatically wiped after x days.
*/

export class GameOverComponent extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="game-over">
        <h2>Game Over &mdash; Scoresheet Below</h2>

        <GameScoresComponent {...this.props}  />
      </div>
    );
  }
}
