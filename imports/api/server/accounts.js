import { Meteor } from 'meteor/meteor';

Meteor.users.deny({update: function () { return true; }});
