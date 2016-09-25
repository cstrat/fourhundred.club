import React, { Component } from 'react';


/*
  [Game Calls & Makes]
    This component takes care of calls and makes.
*/

export class GamePlayComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      calls:          [null, null, null, null], // Local storage for calls
      makes:          [null, null, null, null], // Local storage for makes
      keypad:         false,                    // Keypad displayed
      keypad_player:  null,                     // Which player data is being entered for
      keypad_confirm: null,                     // Which number was selected (for confirmation)
      throw_selected: false,                    // Has the user clicked 'throw round'
      data_loading:   false                     // Is data being loaded?
    };

    /*
      Bind 'this' to functions within class.
    */
    this.resetState           = this.resetState.bind(this);

    this.keypadToggle         = this.keypadToggle.bind(this);
    this.keypadEnter          = this.keypadEnter.bind(this);
    this.keypadDisable        = this.keypadDisable.bind(this);
    this.keypadSelected       = this.keypadSelected.bind(this);

    this.saveCalls            = this.saveCalls.bind(this);
    this.saveCalls_return     = this.saveCalls_return.bind(this);
    this.saveCallsDisabled    = this.saveCallsDisabled.bind(this);

    this.saveMakes            = this.saveMakes.bind(this);
    this.saveMakes_return     = this.saveMakes_return.bind(this);
    this.saveMakesDisabled    = this.saveMakesDisabled.bind(this);

    this.nameClass            = this.nameClass.bind(this);
    this.statusNote           = this.statusNote.bind(this);

    this.throwRound           = this.throwRound.bind(this);
    this.throwRound_return    = this.throwRound_return.bind(this);
    this.throwRound_selected  = this.throwRound_selected.bind(this);

    this.disableActionBar     = this.disableActionBar.bind(this);
  }

  /*
    [resetState]
      This function resets the state to default.
  */
  resetState() {
    this.setState(
      {
        calls:          [null, null, null, null],
        makes:          [null, null, null, null],
        keypad:         false,
        keypad_player:  null,
        keypad_confirm: null,
        throw_selected: false,
        data_loading:   false
      }
    );
  }



  /*
    [keypadEnter]
      User has input a value in the keypad.
      Needs to be clicked twice to confirm.
  */
  keypadEnter(int) {
    if (this.state.keypad_confirm == int) {
      // User has clicked the same number twice - save this in the state array

      let calls = this.state.calls;
      calls[this.state.keypad_player] = int;

      this.setState(
        {
          calls,
          keypad_player:    (this.state.keypad_player == 3) ? 0 : this.state.keypad_player + 1,
          keypad_confirm:   null
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



  /*
    [keypadToggle]
      Toggles the keypad being shown.
      When it toggles it resets the state.
  */
  keypadToggle() {
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



  /*
    [keypadSelected]
      Returns the classname for the keypad buttons.
  */
  keypadSelected(int) {
    return (this.state.keypad_confirm === int) ? 'selected' : '';
  }

  /*
    Returns the attribute value for whether the buttons on the keypad are disabled or not
  */
  keypadDisable(int) {
    // If users score is >= 40 min call is 4, >=30 min call is 3
    var playerScore = this.props.data.currentRound().scores[this.state.keypad_player];
    if ((playerScore >= 40) && (int == 2 || int == 3)) { return true; }
    if ((playerScore >= 30) && int == 2) { return true; }
    return false;
  }



  /*
    [saveCalls]
      Method call to save the calls to the database.
  */
  saveCalls(e) {
    e.preventDefault();

    this.setState({data_loading: true});

    Meteor.call(
      'app.games.calls',
      {
        scoreCode:  FlowRouter.getParam('ScoreGameCode'),
        calls:      this.state.calls
      },
      this.saveCalls_return
    );
  }



  /*
    [saveCalls_return]
      Return function for the save calls method call.
  */
  saveCalls_return(error, result) {
    this.setState({data_loading: false});

    if (error) {
      alert(error.reason);

    }else if (result == 4) {
      // This means the round was likely thrown. Need to reset the data
      this.resetState();
    }
  }



  /*
    [saveCallsDisabled]
      Returns the attribute value for whether the save calls button is disabled or not
  */
  saveCallsDisabled() {
    return (this.state.calls.includes(null)) ? true : false;
  }

  nameClass(position) {
    var className = (position == this.props.data.currentRound().dealer) ? 'dealer ' : '';

    if (position == this.state.keypad_player) {
      className += 'selected';
    }
    return className;
  }



  /*
    [throwRound]
      Method call to throw the round, requires confirmation click.
  */
  throwRound() {
    if (this.state.throw_selected) {

      this.setState({data_loading: true});

      Meteor.call(
        'app.games.throw',
        {
          scoreCode:  FlowRouter.getParam('ScoreGameCode'),
          round:      1
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



  /*
    [throwRound_return]
      Return function for the throw round method call.
  */
  throwRound_return(error, result) {
    this.setState({data_loading: false});

    if (error) {
      alert(error.reason);
    }else{
      this.resetState();
    }
  }



  /*
    [throwRound_selected]
      Returns the classname for the throw round buttons
  */
  throwRound_selected() {
    return (this.state.throw_selected) ? 'throw selected' : 'throw';
  }



  /*
    [statusNote]
      Provide some humerous status notes to go with the number thats been called.
  */
  statusNote() {
    if (this.state.throw_selected) {
      return('Throwing round will advance the dealer and no change to scores');
    }

    if (this.state.calls.includes(null)) {
      return('Players yet to make their calls');
    }

    let minimumNeeded = this.props.data.minimumCall();
    let totalCalled = this.state.calls.reduce(function(a, b) { return a + b; });

    if (totalCalled < minimumNeeded) { return('Round will be thrown. ' + totalCalled + ' called.'); }

    if (totalCalled > 14) { return('This will be fun!! ' + totalCalled + ' called.'); }
    if (totalCalled > 13) { return('Somebody won\'t make it... ' + totalCalled + ' called.'); }
    if (totalCalled > 12) { return('Going to be a close one. ' + totalCalled + ' called.'); }

    return ('Game on! (' + totalCalled + ' called)');
  }

  disableActionBar() {
    return(this.state.data_loading);
  }



  /*
    [render]
      Standard react render function
  */
  render() {
    const self = this;
    return (
      <div className="game-play">
        <ul>
          <li className={this.nameClass(0)}>
            <name>{this.props.data.players[0].name}</name>
            <score>{this.props.data.currentRound().scores[0]}</score>
            <call>{this.state.calls[0] || '-'}</call>
          </li>
          <li className={this.nameClass(1)}>
            <name>{this.props.data.players[1].name}</name>
            <score>{this.props.data.currentRound().scores[1]}</score>
            <call>{this.state.calls[1] || '-'}</call>
          </li>
          <li className={this.nameClass(2)}>
            <name>{this.props.data.players[2].name}</name>
            <score>{this.props.data.currentRound().scores[2]}</score>
            <call>{this.state.calls[2] || '-'}</call>
          </li>
          <li className={this.nameClass(3)}>
            <name>{this.props.data.players[3].name}</name>
            <score>{this.props.data.currentRound().scores[3]}</score>
            <call>{this.state.calls[3] || '-'}</call>
          </li>
        </ul>

        <hr />

        {(!this.state.keypad)?
          <div className="action-bar">
            <h2>{this.statusNote()}</h2>

            { (this.saveCallsDisabled()) ? <button disabled={this.disableActionBar()} ref="throw" className={this.throwRound_selected()} onClick={this.throwRound}>Throw Round</button> : null }
            <button disabled={this.disableActionBar()} ref="enter" onClick={this.keypadToggle}>{ (this.saveCallsDisabled()) ? 'Enter Calls →' : 'Re-enter Calls' } </button>
            { (this.saveCallsDisabled()) ? null : <button disabled={this.disableActionBar()} ref="save" onClick={this.saveCalls}>Save Calls &rarr;</button> }
          </div>
        :
          <div>
            <h2>Call for {this.props.data.players[this.state.keypad_player].name}. {this.state.keypad_confirm + this.state.calls.reduce(function(a, b) { return a + b; })}/{this.props.data.minimumCall()}</h2>
            <ul className="keypad keypad-calls">
              <li className="top-row">
                <button disabled={this.keypadDisable(2)} className={this.keypadSelected(2)} onClick={()=>self.keypadEnter(2)}>2</button>
                <button disabled={this.keypadDisable(3)} className={this.keypadSelected(3)} onClick={()=>self.keypadEnter(3)}>3</button>
                <button className={this.keypadSelected(4)} onClick={()=>self.keypadEnter(4)}>4</button>
              </li>
              <li className="middle-row">
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
                <button onClick={this.keypadToggle}>Cancel Entry</button>
              </li>
            </ul>
          </div>
        }

        <hr />

      </div>
    );
  }
}
