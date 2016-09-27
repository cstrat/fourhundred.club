/*
  Setup Database & SyncedCron
*/

import { Meteor } from 'meteor/meteor';
import '../../api/games';
import '../../api/server/games';
import '../../api/server/cron';


/*
  Report Server Startup
*/

console.log(
`
****************************************
**      FOURHUNDRED.CLUB STARTED      **
****************************************

 Alert: ${Meteor.settings.config.adminEmail}

****************************************
`);
