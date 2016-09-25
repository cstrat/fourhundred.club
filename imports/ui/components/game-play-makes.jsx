import React, { Component } from 'react';


/*
  [Game Makes]
    xxx
*/

export class GamePlayMakesComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      makes:          [null, null, null, null],
      keypad:         false,
      keypad_player:  null,
      keypad_confirm: null,
      throw_selected: false,
      data_loading:   false
    };

    // Bind 'this'
    this.resetState           = this.resetState.bind(this);
    this.toggleKeypad         = this.toggleKeypad.bind(this);
    this.saveMakes            = this.saveMakes.bind(this);
    this.saveMakes_return     = this.saveMakes_return.bind(this);
    this.saveMakesDisabled    = this.saveMakesDisabled.bind(this);
    this.nameClass            = this.nameClass.bind(this);
    this.makeClass            = this.makeClass.bind(this);
    this.keypadEnter          = this.keypadEnter.bind(this);
    this.keypadSelected       = this.keypadSelected.bind(this);
    this.throwRound           = this.throwRound.bind(this);
    this.throwRound_return    = this.throwRound_return.bind(this);
    this.throwRound_selected  = this.throwRound_selected.bind(this);
    this.disableActionBar     = this.disableActionBar.bind(this);
  }

  resetState() {
    this.setState(
      {
        makes:          [null, null, null, null],
        keypad:         false,
        keypad_player:  null,
        keypad_confirm: null,
        throw_selected: false,
        data_loading:   false
      }
    );
  }

  keypadEnter(int) {
    if (this.state.keypad_confirm == int) {
      // User has clicked the same number twice - save this in the state array

      let makes = this.state.makes;
      makes[this.state.keypad_player] = int;

      let nextPlayer        = (this.state.keypad_player == 3) ? 0 : this.state.keypad_player + 1;
      let optimisticSelect  = null;

      if (nextPlayer == this.props.data.currentRound().dealer) {
        optimisticSelect = 13 - this.state.makes.reduce(function(a, b) { return a + b; });
      }

      this.setState(
        {
          makes,
          keypad_player:    nextPlayer,
          keypad_confirm:   optimisticSelect
        }
      );

      // Check if data entry is complete
      if (this.state.keypad_player == this.props.data.currentRound().dealer) {
        this.setState(
          {
            keypad:         false,
            keypad_player:  null
          }
        );
      }

    }else{
      // User clicked the number once, not confirmed yet
      this.setState(
        {
          keypad_confirm: int
        }
      );
    }
  }

  keypadSelected(int) {
    return (this.state.keypad_confirm === int) ? 'selected' : '';
  }

  toggleKeypad() {
    if (!this.state.keypad) {
      this.resetState();
      this.setState(
        {
          keypad:         true,
          keypad_player:  (this.props.data.currentRound().dealer == 3) ? 0 : this.props.data.currentRound().dealer + 1,
        }
      );
    }else{
      this.resetState();
    }
  }

  saveMakes(e) {
    e.preventDefault();

    Meteor.call(
      'app.games.makes',
      {
        scoreCode:  FlowRouter.getParam('ScoreGameCode'),
        makes:      this.state.makes
      },
      this.saveMakes_return
    );
  }

  saveMakes_return(error, result) {
    if (error) {
      alert(error.reason);
    }
  }

  saveMakesDisabled() {
    return (this.state.makes.includes(null) || this.state.makes.reduce(function(a, b) { return a + b; }) != 13) ? true : false;
  }

  throwRound() {

    if (this.state.throw_selected) {

      this.setState({data_loading: true});

      Meteor.call(
        'app.games.throw',
        {
          scoreCode:  FlowRouter.getParam('ScoreGameCode'),
          round:      2
        },
        this.throwRound_return
      );

    }else{
      this.setState(
        {
          throw_selected: true
        }
      );
    }

  }


  throwRound_return(error, result) {

    this.setState({data_loading: false});

    if (error) {
      alert(error.reason);
    }else{
      this.resetState();
    }

  }

  throwRound_selected() {
    return (this.state.throw_selected) ? 'throw selected' : 'throw';
  }

  nameClass(position) {
    var className = (position == this.props.data.currentRound().dealer) ? 'dealer ' : '';

    if (position == this.state.keypad_player) {
      className += 'selected';
    }

    return className;
  }

  makeClass(position) {
    var playerCall  = this.props.data.currentRound().calls[position];
    var playerMake  = this.state.makes[position];
    var className   = (playerMake !== null) ? (playerMake >= playerCall) ? 'made' : 'miss'  : '';

    return className;
  }

  statusNote() {
    /*
      Provide some humerous status notes to go with the number thats been called.
    */

    if (this.state.throw_selected) {
      return('Throwing round will advance the dealer and no change to scores');
    }

    if (this.state.makes.includes(null)) {
      return('Results haven\'t been logged yet.');
    }

    let totalLogged = this.state.makes.reduce(function(a, b) { return a + b; });

    if (totalLogged < 13) { return('Something is wrong, count again! (' + totalLogged + ' entered)'); }

    return ('Save results and ' + this.props.data.players[(this.props.data.currentRound().dealer==3)?0:this.props.data.currentRound().dealer+1].name + ' deals next!');

  }

  disableActionBar() {
    return(this.state.data_loading);
  }

  render() {

    const self = this;

    return (
      <div className="game-play">
        <ul>
          <li className={this.nameClass(0)}>
            <name>{this.props.data.players[0].name}</name>
            <score>{this.props.data.currentRound().scores[0]}</score>
            <make className={this.makeClass(0)}>{this.props.data.currentRound().calls[0]} | {(this.state.makes[0] === null) ? '-' : this.state.makes[0]}</make>
          </li>
          <li className={this.nameClass(1)}>
            <name>{this.props.data.players[1].name}</name>
            <score>{this.props.data.currentRound().scores[1]}</score>
            <make className={this.makeClass(1)}>{this.props.data.currentRound().calls[1]} | {(this.state.makes[1] === null) ? '-' : this.state.makes[1]}</make>
          </li>
          <li className={this.nameClass(2)}>
            <name>{this.props.data.players[2].name}</name>
            <score>{this.props.data.currentRound().scores[2]}</score>
            <make className={this.makeClass(2)}>{this.props.data.currentRound().calls[2]} | {(this.state.makes[2] === null) ? '-' : this.state.makes[2]}</make>
          </li>
          <li className={this.nameClass(3)}>
            <name>{this.props.data.players[3].name}</name>
            <score>{this.props.data.currentRound().scores[3]}</score>
            <make className={this.makeClass(3)}>{this.props.data.currentRound().calls[3]} | {(this.state.makes[3] === null) ? '-' : this.state.makes[3]}</make>
          </li>
        </ul>

        <hr />

        {(!this.state.keypad)?
          <div className="action-bar">
            <h2>{this.statusNote()}</h2>

            { (this.saveMakesDisabled()) ? <button disabled={this.disableActionBar()} ref="throw" className={this.throwRound_selected()} onClick={this.throwRound}>Throw Round</button> : null }
            <button disabled={this.disableActionBar()} ref="enter" onClick={this.toggleKeypad}>{ (this.saveMakesDisabled()) ? 'Enter Results →' : 'Re-enter Results' } </button>
            { (this.saveMakesDisabled()) ? null : <button disabled={this.disableActionBar()} ref="save" onClick={this.saveMakes}>Save Results &rarr;</button> }

          </div>
        :
          <div>
            <h2>Result for {this.props.data.players[this.state.keypad_player].name} who called {this.props.data.currentRound().calls[this.state.keypad_player]}. {this.state.keypad_confirm + this.state.makes.reduce(function(a, b) { return a + b; })}/13</h2>
            <ul className="keypad keypad-makes">
              <li className="top-row">
                <button className={this.keypadSelected(0)} onClick={()=>self.keypadEnter(0)}>0</button>
                <button className={this.keypadSelected(1)} onClick={()=>self.keypadEnter(1)}>1</button>
                <button className={this.keypadSelected(2)} onClick={()=>self.keypadEnter(2)}>2</button>
                <button className={this.keypadSelected(3)} onClick={()=>self.keypadEnter(3)}>3</button>
              </li>
              <li className="middle-row">
                <button className={this.keypadSelected(4)} onClick={()=>self.keypadEnter(4)}>4</button>
                <button className={this.keypadSelected(5)} onClick={()=>self.keypadEnter(5)}>5</button>
                <button className={this.keypadSelected(6)} onClick={()=>self.keypadEnter(6)}>6</button>
                <button className={this.keypadSelected(7)} onClick={()=>self.keypadEnter(7)}>7</button>
                <button className={this.keypadSelected(8)} onClick={()=>self.keypadEnter(8)}>8</button>
              </li>
              <li className="bottom-row">
                <button className={this.keypadSelected(9)} onClick={()=>self.keypadEnter(9)}>9</button>
                <button className={this.keypadSelected(10)} onClick={()=>self.keypadEnter(10)}>10</button>
                <button className={this.keypadSelected(11)} onClick={()=>self.keypadEnter(11)}>11</button>
                <button className={this.keypadSelected(12)} onClick={()=>self.keypadEnter(12)}>12</button>
                <button className={this.keypadSelected(13)} onClick={()=>self.keypadEnter(13)}>13</button>
              </li>
              <li className="special-row">
                <button onClick={this.toggleKeypad}>Cancel Entry</button>
              </li>
            </ul>
          </div>
        }

        <hr />

      </div>
    );
  }
}
