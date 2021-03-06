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
            <td className="round-number">
              {round.number}
            </td>
            <td>
              <call>-</call> | <make>-</make>
              <score>...</score>
            </td>
            <td>
              <call>-</call> | <make>-</make>
              <score>...</score>
            </td>
            <td>
              <call>-</call> | <make>-</make>
              <score>...</score>
            </td>
            <td>
              <call>-</call> | <make>-</make>
              <score>...</score>
            </td>
          </tr>
        );
      break;
      case 1:
        return (
          <tr key={round.number}>
            <td className="round-number">
              {round.number}
            </td>
            <td>
              <call>{round.calls[0]}</call> | <make>-</make>
              <score>...</score>
            </td>
            <td>
              <call>{round.calls[1]}</call> | <make>-</make>
              <score>...</score>
            </td>
            <td>
              <call>{round.calls[2]}</call> | <make>-</make>
              <score>...</score>
            </td>
            <td>
              <call>{round.calls[3]}</call> | <make>-</make>
              <score>...</score>
            </td>
          </tr>
        );
      break;
      case 2:
        return (
          <tr key={round.number}>
            <td className="round-number">
              {round.number}
            </td>
            <td className={(round.calls[0] <= round.makes[0]) ? 'made' : 'miss'}>
              <call>{round.calls[0]}</call> | <make>{round.makes[0]}</make>
              <score>{round.scores[0]}</score>
            </td>
            <td className={(round.calls[1] <= round.makes[1]) ? 'made' : 'miss'}>
              <call>{round.calls[1]}</call> | <make>{round.makes[1]}</make>
              <score>{round.scores[1]}</score>
            </td>
            <td className={(round.calls[2] <= round.makes[2]) ? 'made' : 'miss'}>
              <call>{round.calls[2]}</call> | <make>{round.makes[2]}</make>
              <score>{round.scores[2]}</score>
            </td>
            <td className={(round.calls[3] <= round.makes[3]) ? 'made' : 'miss'}>
              <call>{round.calls[3]}</call> | <make>{round.makes[3]}</make>
              <score>{round.scores[3]}</score>
            </td>
          </tr>
        );
      break;
      default:
        return(
          <tr key={round.number}>
            <td className="round-number">
              {round.number}
            </td>
            <td colSpan="4" className="single-row">
              Round Thrown ({round.status})
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
              <td className="round-number">#</td>
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
