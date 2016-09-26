import React, { Component } from 'react';

/*
  [Game Scores]
    This is a reusable component which just needs the game data as a prop.
    It will display the running sheet of the game.
    This is the same display used for spectators and the score page under the player controlling the match.
*/

export class GameScoresComponent extends Component {

  constructor(props) {
    super(props);

    // Bind this
  }

  showRound(round) {

    switch (round.status) {
      case 0:
        return (
          <tr key={round.number}>
            {round.number} - 
            <td>
              <score>{round.scores[0]}</score>
            </td>
            <td>
              <score>{round.scores[1]}</score>
            </td>
            <td>
              <score>{round.scores[2]}</score>
            </td>
            <td>
              <score>{round.scores[3]}</score>
            </td>
          </tr>
        );
      break;
      case 1:
        return (
          <tr key={round.number}>
            <td>
              {round.number} -
              <call>{round.calls[0]}</call> / <make>-</make>
              <score>{round.scores[0]}</score>
            </td>
            <td>
              <call>{round.calls[1]}</call> / <make>-</make>
              <score>{round.scores[1]}</score>
            </td>
            <td>
              <call>{round.calls[2]}</call> / <make>-</make>
              <score>{round.scores[2]}</score>
            </td>
            <td>
              <call>{round.calls[3]}</call> / <make>-</make>
              <score>{round.scores[3]}</score>
            </td>
          </tr>
        );
      break;
      case 2:
        return (
          <tr key={round.number}>
            <td>
              {round.number} -
              <call>{round.calls[0]}</call> / <make>{round.makes[0]}</make>
              <score>{round.scores[0]}</score>
            </td>
            <td>
              <call>{round.calls[1]}</call> / <make>{round.makes[1]}</make>
              <score>{round.scores[1]}</score>
            </td>
            <td>
              <call>{round.calls[2]}</call> / <make>{round.makes[2]}</make>
              <score>{round.scores[2]}</score>
            </td>
            <td>
              <call>{round.calls[3]}</call> / <make>{round.makes[3]}</make>
              <score>{round.scores[3]}</score>
            </td>
          </tr>
        );
      break;
      default:
        return(
          <tr key={round.number}>
            <td>
              {round.number} - Round Thrown
            </td>
          </tr>
        );
      break;
    }


  }

  render() {
    return (
      <div className="game-scores">

        <table>
          <thead>
            <tr>
              <td>{this.props.data.players[0].name}</td>
              <td>{this.props.data.players[1].name}</td>
              <td>{this.props.data.players[2].name}</td>
              <td>{this.props.data.players[3].name}</td>
            </tr>
          </thead>
          <tbody>
            {this.props.data.rounds.map(this.showRound)}
          </tbody>
        </table>

      </div>
    );
  }
}
