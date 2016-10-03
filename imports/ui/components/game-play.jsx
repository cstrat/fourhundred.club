import React, { Component } from 'react';
import { GameScoresComponent } from './game-scores';

/*
  [Game Calls & Makes]
    This component takes care of calls and makes.
    Right now this is being refactored. This file is not being used anywhere yet.
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

    this.returnPlayerScore    = this.returnPlayerScore.bind(this);
    this.returnCallKeypad     = this.returnCallKeypad.bind(this);
    this.returnMakeKeypad     = this.returnMakeKeypad.bind(this);

    this.saveCalls            = this.saveCalls.bind(this);
    this.saveCalls_return     = this.saveCalls_return.bind(this);
    this.saveCallsDisabled    = this.saveCallsDisabled.bind(this);

    this.saveMakes            = this.saveMakes.bind(this);
    this.saveMakes_return     = this.saveMakes_return.bind(this);
    this.saveMakesDisabled    = this.saveMakesDisabled.bind(this);

    this.nameClass            = this.nameClass.bind(this);
    this.makeClass            = this.makeClass.bind(this);
    this.statusNote           = this.statusNote.bind(this);

    this.throwRound           = this.throwRound.bind(this);
    this.throwRound_return    = this.throwRound_return.bind(this);
    this.throwRound_selected  = this.throwRound_selected.bind(this);
    this.throwRound_timeout   = this.throwRound_timeout.bind(this);

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

      var calls = this.state.calls;
      var makes = this.state.makes;

      switch (this.props.data.currentRound().status) {
        case 0:
          calls[this.state.keypad_player] = int;
        break;
        case 1:
          makes[this.state.keypad_player] = int;
        break;
      }

      this.setState(
        {
          calls,
          makes,
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
    // When making calls
    if (this.props.data.currentRound().status == 0) {
      // If users score is >= 40 min call is 4, >=30 min call is 3
      var playerScore = this.props.data.currentRound().scores[this.state.keypad_player];
      if ((playerScore >= 40) && (int == 2 || int == 3)) { return true; }
      if ((playerScore >= 30) && int == 2) { return true; }
      return false;
    }

    // When saving results
    if (this.props.data.currentRound().status == 1) {
      if ((this.state.makes.reduce(function(a, b) { return a + b; }) + int) > 13) {
        return true;
      }
    }
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



  /*
    [saveMakes]
      Method call to save the round results to the database.
  */
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



  /*
    [saveMakes_return]
      Return function for the save makes method call.
  */
  saveMakes_return(error, result) {
    this.setState({data_loading: false});

    if (error) {
      alert(error.reason);

    }else{
      // Round completed, no error
      this.resetState();
    }
  }

  saveMakesDisabled() {
    return (this.state.makes.includes(null) || this.state.makes.reduce(function(a, b) { return a + b; }) != 13) ? true : false;
  }



  /*
    [throwRound]
      Method call to throw the round, requires confirmation click.
  */
  throwRound() {
    if (this.state.throw_selected) {

      this.setState(
        {
          throw_selected: false,
          data_loading:   true
        }
      );

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
      setTimeout(this.throwRound_timeout, 1500);
    }
  }



  /*
    [throwRound_timeout]
      After 1.5 seconds de-select the throw-round button.
  */
  throwRound_timeout() {
    this.setState(
      {
        throw_selected: false
      }
    );
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


  /*
    [statusNote]
      Provide status notes to go with the current status of the game.
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

    if (totalCalled < minimumNeeded) { return(`Round will be thrown. ${totalCalled} called.`); }

    if (totalCalled > 14) { return(`This will be fun!! ${totalCalled} called.`); }
    if (totalCalled > 13) { return(`Somebody won\'t make it... ${totalCalled} called.`); }
    if (totalCalled > 12) { return(`Going to be a close one. ${totalCalled} called.`); }

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
          {this.returnPlayerScore(0)}
          {this.returnPlayerScore(1)}
          {this.returnPlayerScore(2)}
          {this.returnPlayerScore(3)}
        </ul>

        <hr />

        {(!this.state.keypad)?
          <div className="action-bar">
            <h2>{this.statusNote()}</h2>

            {(this.props.data.currentRound().status==0)?
              <div>
                { (this.saveCallsDisabled()) ? <button disabled={this.disableActionBar()} ref="throw" className={this.throwRound_selected()} onClick={this.throwRound}>Throw Round</button> : null }
                <button disabled={this.disableActionBar()} ref="enter" onClick={this.keypadToggle}>{ (this.saveCallsDisabled()) ? 'Enter Calls →' : 'Re-enter Calls' } </button>
                { (this.saveCallsDisabled()) ? null : <button disabled={this.disableActionBar()} ref="save" onClick={this.saveCalls}>Save Calls &rarr;</button> }
              </div>
            :
              <div>
                { (this.saveMakesDisabled()) ? <button disabled={this.disableActionBar()} ref="throw" className={this.throwRound_selected()} onClick={this.throwRound}>Throw Round</button> : null }
                <button disabled={this.disableActionBar()} ref="enter" onClick={this.keypadToggle}>{ (this.saveMakesDisabled()) ? 'Enter Results →' : 'Re-enter Results' } </button>
                { (this.saveMakesDisabled()) ? null : <button disabled={this.disableActionBar()} ref="save" onClick={this.saveMakes}>Save Results &rarr;</button> }
              </div>
            }

          </div>
        :
          <div>
            {(this.props.data.currentRound().status==0)? this.returnCallKeypad() : this.returnMakeKeypad() }
          </div>
        }

        <hr />

        <GameScoresComponent {...this.props}  />

      </div>
    );
  }

  /*
    [returnPlayerScore]
      Returns the list element for the scoring sheet.
  */
  returnPlayerScore(playerPos) {

    //var showCall  = (this.props.data.currentRound().calls[playerPos] === null && this.state.calls[playerPos] === null) ? '-' : (this.props.data.currentRound().calls[playerPos] === null);
    //var showMake  = 0;



    return(
      <li className={this.nameClass(playerPos)}>
        <name>
          {this.props.data.players[playerPos].name}
        </name>
        <score>
          {this.props.data.currentRound().scores[playerPos] || 0}
        </score>
        {(this.props.data.currentRound().status == 0)
        ? // Saving Calls (no make data)
          <activity className={this.makeClass(playerPos)}>
            {(this.state.calls[playerPos] === null) ? '-' : this.state.calls[playerPos]} | -
          </activity>
        : // Saving Results (call data should come from database)
          <activity className={this.makeClass(playerPos)}>
            {this.props.data.currentRound().calls[playerPos]} | {(this.state.makes[playerPos] === null) ? '-' : this.state.makes[playerPos]}
          </activity>
        }
      </li>
    );
  }


  returnCallKeypad() {

    var self = this;
    var keypadNote = 'Call for ' + this.props.data.players[this.state.keypad_player].name;
    var keypadCount = ' [Called: ' + (+this.state.keypad_confirm + this.state.calls.reduce(function(a, b) { return a + b; })) + '/' + this.props.data.minimumCall() + ']';

    return(
      <ul className="keypad keypad-calls">
        <li className="note">
          {keypadNote}
          {keypadCount}
        </li>
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
        <li className="special-action">
          <button onClick={this.keypadToggle}>Cancel Entry</button>
        </li>
      </ul>
    );
  }


  returnMakeKeypad() {

    var self = this;
    var keypadNote = 'Result for ' + this.props.data.players[this.state.keypad_player].name + ' (Called ' + this.props.data.currentRound().calls[this.state.keypad_player] + ') ';
    var keypadCount = ' [' + (+this.state.keypad_confirm + this.state.makes.reduce(function(a, b) { return a + b; })) + '/13]';

    return(
      <ul className="keypad keypad-makes">
        <li className="note">
          {keypadNote}
          {keypadCount}
        </li>
        <li className="top-row">
          <button className={this.keypadSelected(0)} onClick={()=>self.keypadEnter(0)}>0</button>
          <button disabled={this.keypadDisable(1)} className={this.keypadSelected(1)} onClick={()=>self.keypadEnter(1)}>1</button>
          <button disabled={this.keypadDisable(2)} className={this.keypadSelected(2)} onClick={()=>self.keypadEnter(2)}>2</button>
          <button disabled={this.keypadDisable(3)} className={this.keypadSelected(3)} onClick={()=>self.keypadEnter(3)}>3</button>
        </li>
        <li className="middle-row">
          <button disabled={this.keypadDisable(4)} className={this.keypadSelected(4)} onClick={()=>self.keypadEnter(4)}>4</button>
          <button disabled={this.keypadDisable(5)} className={this.keypadSelected(5)} onClick={()=>self.keypadEnter(5)}>5</button>
          <button disabled={this.keypadDisable(6)} className={this.keypadSelected(6)} onClick={()=>self.keypadEnter(6)}>6</button>
          <button disabled={this.keypadDisable(7)} className={this.keypadSelected(7)} onClick={()=>self.keypadEnter(7)}>7</button>
          <button disabled={this.keypadDisable(8)} className={this.keypadSelected(8)} onClick={()=>self.keypadEnter(8)}>8</button>
        </li>
        <li className="bottom-row">
          <button disabled={this.keypadDisable(9)} className={this.keypadSelected(9)} onClick={()=>self.keypadEnter(9)}>9</button>
          <button disabled={this.keypadDisable(10)} className={this.keypadSelected(10)} onClick={()=>self.keypadEnter(10)}>10</button>
          <button disabled={this.keypadDisable(11)} className={this.keypadSelected(11)} onClick={()=>self.keypadEnter(11)}>11</button>
          <button disabled={this.keypadDisable(12)} className={this.keypadSelected(12)} onClick={()=>self.keypadEnter(12)}>12</button>
          <button disabled={this.keypadDisable(13)} className={this.keypadSelected(13)} onClick={()=>self.keypadEnter(13)}>13</button>
        </li>
        <li className="special-action">
          <button onClick={this.keypadToggle}>Cancel Entry</button>
        </li>
      </ul>
    );
  }



}
