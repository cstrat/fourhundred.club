import { Meteor } from 'meteor/meteor';

/*

*/

export var throwError = function(error, reason, details) {
  var meteorError = new Meteor.Error(error, reason, details);
  if (Meteor.isClient) {
    return meteorError;
  } else if (Meteor.isServer) {
    throw meteorError;
  }
};
