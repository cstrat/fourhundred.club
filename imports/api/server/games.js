import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Games } from '../games';


/*
  Publish Game Database
*/

Meteor.publish('games', function({ scoreCode, watchCode }) {

  // TODO: Sanisise input paramaters
  // TODO: Restrict the actual output of the publication based on the type of subscription

  if (scoreCode) {
    // User subscribing to score a game
    if (typeof(scoreCode) !== 'string') {
      return null;
    }

    // Return the game data for that private code
    return Games.find({ '_access.score': scoreCode }, { fields: { _private: 0 } });
  }

  if (watchCode) {
    // Return the game data for that private code
    return Games.find({ '_access.watch': watchCode }, { fields: { _private: 0, '_access.score': 0 } });
  }

});


/*
  Define Game Helpers (private)
*/

Games.helpers({

});


/*
  Game Methods (private)
*/

Meteor.methods({
  'app.games.create'(input) {

    // Sanitise the player names
    const player1 = input.players[0].replace(/\W/g, '');
    const player2 = input.players[1].replace(/\W/g, '');
    const player3 = input.players[2].replace(/\W/g, '');
    const player4 = input.players[3].replace(/\W/g, '');

    // Set the random score and watch codes
    const scoreCode = Random.id(10);
    const watchCode = Random.id(10);

    // Insert the record
    Games.insert({

      // Private data which is never sent to client, can be queried via methods though
      _private: {
        version:    0,
        public:     false
      },

      // Access codes to score and watch the games
      _access: {
        score:      scoreCode,
        watch:      watchCode
      },

      // Dates which are set
      dates: {
        created:    new Date(),
        finished:   null
      },

      // Custom math title
      title:        null,

      // Competition Info
      competition: {
        _id:        null,
        title:      null
      },

      // Location object
      location:     null,

      // Game status. 0=New,1=Playing,2=Complete,3=Abandoned
      status: 0,

      // Rules. This will be an array of flags where default rules can be overridden.
      rules: [],

      // Player information. Name and _id.
      players: [
        {
          id:       null,
          name:     (player1.length > 0) ? player1 : 'Player 1'
        },
        {
          id:       null,
          name:     (player2.length > 0) ? player2 : 'Player 2'
        },
        {
          id:       null,
          name:     (player3.length > 0) ? player3 : 'Player 3'
        },
        {
          id:       null,
          name:     (player4.length > 0) ? player4 : 'Player 4'
        }
      ],

      // Round data. Contains: score[], calls[], makes[], dealer, status
      rounds: []

    });

    // Return the scoreCode for the person to continue with the game
    return scoreCode;

  }
});