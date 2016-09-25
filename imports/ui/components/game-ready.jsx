import React, { Component } from 'react';


/*
  [Ready Game]
    This is where the game has been setup - but the first round hasn't begun yet.
    At this point the player should be able to change the rules and the players around.
    Right now though, I think the player just selects the dealer and off we go.
*/

export class GameReadyComponent extends Component {

  constructor(props) {
    super(props);

    // Bind this
    this.selectDealer = this.selectDealer.bind(this);
  }

  selectDealer() {

    Meteor.call(
      'app.games.dealer',
      {
        scoreCode:  FlowRouter.getParam('ScoreGameCode'),
        dealer:     +this.refs.dealer.value
      },
      this.selectDealer_return
    )

  }

  selectDealer_return(error, result) {
    if (error) {
      alert(error.reason);
    }else{
      // Wait for data to sync...
    }
  }

  render() {
    return (
      <div className="game-ready">
        <h2>Setup New Game</h2>
        <ul>
          <li className="instruction">Choose Starting Dealer</li>
          <li><select ref="dealer">
            <option value="0">{this.props.data.players[0].name}</option>
            <option value="1">{this.props.data.players[1].name}</option>
            <option value="2">{this.props.data.players[2].name}</option>
            <option value="3">{this.props.data.players[3].name}</option>
          </select></li>
          <li><button onClick={this.selectDealer}>Select Dealer</button></li>
        </ul>
      </div>
    );
  }
}
