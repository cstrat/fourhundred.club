import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';
import { Games } from '../games';
import { throwError } from '../_errors.js';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';


/*
  [Publish Database]
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
  [Helpers] (private)
*/

Games.helpers({

});


/*
  [Methods] (private)

*/

Meteor.methods({
  'app.games.create'(input) {

    // Sanitise the player names
    const player1 = input.players[0].replace(/\W/g, '').substring(0, 12);
    const player2 = input.players[1].replace(/\W/g, '').substring(0, 12);
    const player3 = input.players[2].replace(/\W/g, '').substring(0, 12);
    const player4 = input.players[3].replace(/\W/g, '').substring(0, 12);

    // Simple check of the email, should stop any sort of abuse
    if (input.email) {
      if (!/^\S+@\S+\.\S+$/.test(input.email)) {
        throwError('invalid-email', 'Invalid Email Address Provided!');
      }
    }

    // Set the random score and watch codes
    const scoreCode = Random.id(10);
    const watchCode = Random.id(10);

    // Insert the record
    Games.insert({

      // Private data which is never sent to client, can be queried via methods though
      _private: {
        version:    0,
        public:     false,
        email:      input.email
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

      // Game status. 0=New, 1=Playing, 2=Complete, 3=Abandoned, 4=ForceAbandon
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

    // Send the user an email if they have provided their email address to us
    if (input.email) {
      Email.send({
        to:       input.email,
        from:     'Fourhundred.club Notification <notifications@fourhundred.club>',
        subject:  `New Game @ Fourhundred.club`,
        text:
`
Hi ${player1 || 'Player 1'},
A new game has been setup for you at fourhundred.club.

Please remember that the game will delete itself if you
don't complete it within 18 hours. There is no guarantee
that the games will be kept for any long period of time.


The URL to score this game is:
  http://fourhundred.club/score/${scoreCode}/
** Do not share this URL **


The URL to spectate the game is: (you can share this code)
  http://fourhundred.club/watch/${watchCode}/
^^ You should share this with the other players ^^


Thanks,
Fourhundred.Club

-----------------------------------------------------------
     If you didn't setup a game, then someone else has
       used your email address when creating a game.
  Dont worry we won't send you any further emails anyway.
-----------------------------------------------------------
`
      });
    }

    // Return the scoreCode for the person to continue with the game
    return scoreCode;

  }
});


/*
  [Rate Limit]
    games.create: 5 allowed per 2 minute interval.
    games.dealer: 5 allowed per 2 minute interval.
    games.calls:  5 allowed per 30 second interval.
    games.makes:  5 allowed per 30 second interval.
    games.throw:  5 allowed per 30 second interval.
*/

DDPRateLimiter.addRule(
  {
    type: 'method',
    name: 'app.games.create'
  },
  5,
  10000*60*2
);

DDPRateLimiter.addRule(
  {
    type: 'method',
    name: 'app.games.dealer'
  },
  5,
  10000*60*2
);

DDPRateLimiter.addRule(
  {
    type: 'method',
    name: 'app.games.calls'
  },
  5,
  10000*30
);

DDPRateLimiter.addRule(
  {
    type: 'method',
    name: 'app.games.makes'
  },
  5,
  10000*30
);

DDPRateLimiter.addRule(
  {
    type: 'method',
    name: 'app.games.throw'
  },
  5,
  10000*30
);
