import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import { throwError } from './_errors.js';

/*
  Define Game Database
*/

export const Games = new Mongo.Collection('games');



/*
  Define Game Helpers
*/

Games.helpers({

  setupRound(dealer) {

    var roundNumber = 1;
    var dealerPos   = dealer;
    var scoreData   = [0,0,0,0];

    // If nothing input to this helper, then need to load the last round data
    if (typeof dealer == 'undefined') {
      var lastRoundDealer = this.currentRound().dealer;
      dealerPos   = (lastRoundDealer==3) ? 0 : lastRoundDealer+1 ;
      roundNumber = this.currentRound().number + 1;
      scoreData   = this.currentRound().scores;
    }

    let roundData = {
      number:   roundNumber,            // Counter
      dealer:   dealerPos,              // Dealer of the round
      scores:   scoreData,              // Everyone starts on zero
      calls:    [null,null,null,null],  // If == null, means hasn't been called
      makes:    [null,null,null,null],  // ^^
      status:   0,                      // 0=Nothing, 1=Calls, 2=Makes, 3=Complete
      dates: {
        started:  new Date(),           // Time the round began
        finished: null                  // Time the round finished
      }
    }

    Games.update(
      this._id,
      {
        $set: {
          // Game status to 1
          status: 1
        },
        $push: {
          // Inject the first data
          rounds: roundData
        }
      }
    );

  },

  currentRound() {
    return(this.rounds.slice(-1)[0]);
  },

  getRound(roundNumber) {
    return(this.rounds[roundNumber-1]);
  },

  saveCalls(calls) {

    let currentRound    = this.currentRound();
    let minimumNeeded   = this.minimumCall();
    let totalCalled     = calls.reduce(function(a, b) { return a + b; });
    let roundStatus     = (totalCalled < minimumNeeded) ? 4 : 1;

    Games.update(
      {
        _id: this._id,
        'rounds.number': currentRound.number
      },
      {
        $set: {
          'rounds.$.status':  roundStatus,
          'rounds.$.calls':   calls
        }
      }
    );

    return roundStatus;

  },


  saveMakes(makes) {

    const self = this;
    const currentRound = this.currentRound();
    const scores = makes.map(function(make, num) {
      var modifier = (make >= currentRound.calls[num]) ? 1 : -1;

      if (currentRound.calls[num] >= 10) {
        modifier = modifier * 4
      }else if (currentRound.calls[num] >= 9) {
        modifier = modifier * 3
      }else if (currentRound.calls[num] >= 5) {
        modifier = modifier * 2
      }

      return (currentRound.scores[num] + (modifier * currentRound.calls[num]));

    });


    Games.update(
      {
        _id: this._id,
        'rounds.number': currentRound.number
      },
      {
        $set: {
          'rounds.$.status':          2,
          'rounds.$.makes':           makes,
          'rounds.$.scores':          scores,
          'rounds.$.dates.finished':  new Date()
        }
      }
    );

  },

  throwRound(round) {

    if (round > 2 || round < 1) round = 3;

    const currentRound = this.currentRound();
    Games.update(
      {
        _id: this._id,
        'rounds.number': currentRound.number
      },
      {
        $set: {
          'rounds.$.status':          (4+round), // 4 = thrown, low calls. 5 = thrown at call stage, 6 = thrown at make stage, 7 = unknown
          'rounds.$.dates.finished':  new Date()
        }
      }
    );

  },

  gameComplete() {

    Games.update(
      this._id,
      {
        $set: {
          'dates.finished': new Date(),
          'status': 2
        }
      }
    );

  },


  minimumCall() {

    const currentRoundScores = this.currentRound().scores;
    var minimumCall = 11;

    if (Math.max(...currentRoundScores) >= 40) { return 13; }
    if (Math.max(...currentRoundScores) >= 30) { return 12; }
    return 11;

  }


});


/*
  [Game Methods]
    All of the important logic needs to happen in these methods.
    The calls to the database helpers should only take place once the inputs and data have been completely confirmed.
    All errors need to be handled between the UI and the Method - not in the database helper.
    The database helpers will (mostly) only output false in the event of a major stuff up.
*/

Meteor.methods({
  'app.games.dealer': function(input) {

    if (Meteor.isServer) {
      check(input.scoreCode, String);
      check(input.dealer, Number);
    }

    let setupGameResult = Games.findOne({ '_access.score': input.scoreCode }).setupRound(input.dealer);

    if (!setupGameResult) {
      // Fatal error on setup
    }

  },

  'app.games.calls': function(input) {

    if (Meteor.isServer) {
      check(input.scoreCode, String);
      check(input.calls, [Number]);
    }

    let saveCallsResult = Games.findOne({ '_access.score': input.scoreCode }).saveCalls(input.calls);

    // If calls were low, new game needs to be started
    if (saveCallsResult == 4) {
      // If not, setup new round.
      let newGameSetup = Games.findOne({ '_access.score': input.scoreCode }).setupRound();

      if (!newGameSetup) {
        // Fatal error on setup
      }
    }


    if (!saveCallsResult) {
      // Fatal error on saving calls
    }else{
      return saveCallsResult;
    }

  },

  'app.games.makes': function(input) {

    if (Meteor.isServer) {
      check(input.scoreCode, String);
      check(input.makes, [Number]);
    }

    let saveMakesResult = Games.findOne({ '_access.score': input.scoreCode }).saveMakes(input.makes);

    if (!saveMakesResult) {
      // Fatal error on saving makes
    }

    // Check outcome of that round... does it finish the game?
    let scores    = Games.findOne({ '_access.score': input.scoreCode }).currentRound().scores;
    let gameOver  = false;

    if (scores[0] >= 41 && scores[2] >= 0) {
      // Game over, player 1 won with team mate
      gameOver = true;
    }
    if (scores[1] >= 41 && scores[3] >= 0) {
      // Game over, player 2 won with team mate
      gameOver = true;
    }
    if (scores[2] >= 41 && scores[0] >= 0) {
      // Game over, player 3 won with team mate
      gameOver = true;
    }
    if (scores[3] >= 41 && scores[1] >= 0) {
      // Game over, player 4 won with team mate
      gameOver = true;
    }

    if (gameOver) {
      Games.findOne({ '_access.score': input.scoreCode }).gameComplete();

    }else{
      // If not, setup new round.
      let newGameSetup = Games.findOne({ '_access.score': input.scoreCode }).setupRound();

      if (!newGameSetup) {
        // Fatal error on setup
      }
    }

  },


  'app.games.throw': function(input) {
    if (Meteor.isServer) {
      check(input.scoreCode, String);
      check(input.round, Number);
    }

    let saveThrow = Games.findOne({ '_access.score': input.scoreCode }).throwRound(input.round);

    if (!saveThrow) {
      // Fatal error on setup
    }

    let newGameSetup = Games.findOne({ '_access.score': input.scoreCode }).setupRound();

    if (!newGameSetup) {
      // Fatal error on setup
    }

  }


});
