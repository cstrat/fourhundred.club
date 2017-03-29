/*
  Setup Database & SyncedCron
*/

import { Meteor } from 'meteor/meteor';
import '../../api/games';
import '../../api/server/games';
import '../../api/server/cron';
import '../../api/server/accounts';


/*
  Report Server Startup
*/

console.log(
`
****************************************
**      FOURHUNDRED.CLUB STARTED      **
****************************************
`);


// Add comment to alert if settings not correclty loaded
if (Meteor.settings.config.adminEmail) {
  console.log(`Alert: ${Meteor.settings.config.adminEmail}`);
}else{
  console.log(`* Missing Settings: config.adminEmail  *`);
}


console.log(
`
****************************************
`);
