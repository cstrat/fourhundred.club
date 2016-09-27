import { Meteor } from 'meteor/meteor';
import { Games } from '../../api/games';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { Email } from 'meteor/email';
import moment from 'moment';

/*
  [Purge Abandoned Games]
    Get the timed services running, to automatically flush the database.
    Every 6 hours, deletes games older than 6 hours which haven't finished.
    Emails a report to the contact setup in the
*/

SyncedCron.add({
  name: 'Purge Abandoned Game Data',

  schedule: function(parser) {
    return parser.text('every 6 hours');
  },

  job: function() {

    let removedGames = Games.remove(
      {
        'dates.created': {
          $lt: new moment().subtract(6, 'h').toDate()
        },
        'status': {
          $ne: 2
        }
      }
    );

    let totalGamesRemaining = Games.find().count();

    if (removedGames > 0) {
      if (Meteor.settings.config.adminEmail) {
        Email.send({
          to:       Meteor.settings.config.adminEmail,
          from:     'alerts@fourhundred.club',
          subject:  `fourhundred.club alert: removed ${removedGames} games.`,
          text:     `There are still ${totalGamesRemaining} games on the server.`
        });
      }
    }
  }
});


// Start SyncedCron!
SyncedCron.start();
