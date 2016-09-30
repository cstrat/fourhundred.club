import React, { Component } from 'react';


/*
  [New Game Component]
    Lets players setup a new game.
    Select rules etc...
    If logged in then there will be some additional options and perhaps some pre-selected fields.
*/

export class GameNewComponent extends Component {

  constructor(props) {
    super(props);

    // Bind this
    this.createGame = this.createGame.bind(this);
    this.createGame_return = this.createGame_return.bind(this);
  }

  createGame(e) {
    e.preventDefault();

    this.refs.p1.disabled = true;
    this.refs.p2.disabled = true;
    this.refs.p3.disabled = true;
    this.refs.p4.disabled = true;
    this.refs.email.disabled = true;
    this.refs.submit.disabled = true;

    Meteor.call(
      'app.games.create',
      {
        players: [
          this.refs.p1.value,
          this.refs.p2.value,
          this.refs.p3.value,
          this.refs.p4.value
        ],
        email: this.refs.email.value
      },
      this.createGame_return
    );
  }

  createGame_return(error, result) {
    this.refs.p1.disabled = false;
    this.refs.p2.disabled = false;
    this.refs.p3.disabled = false;
    this.refs.p4.disabled = false;
    this.refs.email.disabled = false;
    this.refs.submit.disabled = false;

    if (error) {
      alert(error.reason);
    }else{
      FlowRouter.go('/score/' + result);
    }
  }

  render() {
    return (
      <div className="game-new">
        <h2>Setup New Game</h2>

        <p>
          The player order should be in the direction of your play.
          If you play clockwise: Player 1 should be you (person keeping score), Player 2 would be the person on your left, Player 3 would be opposite you (your teammate), and finally Player 4 would be to your right.
        </p>

        <p>
          You don't need to enter your email address, if you do, we will send you the details of this game to your inbox.
          This way you can revisit the scoresheet afterwards (if you lose the URL).
          We will also send you a link for the spectator view.
        </p>

        <form onSubmit={this.createGame}>
          <ul>
            <li className="instruction">Your Email Address (not required)</li>
            <li><input type="text" ref="email" placeholder="joe@blogs.com" /></li>

            <li className="instruction">Choose Player Names</li>
            <li><input type="text" ref="p1" placeholder="Player 1" /></li>
            <li><input type="text" ref="p2" placeholder="Player 2" /></li>
            <li><input type="text" ref="p3" placeholder="Player 3" /></li>
            <li><input type="text" ref="p4" placeholder="Player 4" /></li>
            <li><button ref="submit">Create New Game</button></li>
          </ul>
        </form>
      </div>
    );
  }
}
