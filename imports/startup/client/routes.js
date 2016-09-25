import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

/*
  Layouts
*/
import { LayoutContainer } from '../../ui/layouts/main-layout';



/*
  Pages
*/
import { LandingContainer }         from '../../ui/pages/landing';
import { AuthenticationContainer }  from '../../ui/pages/authentication';
import { ScoreGameContainer }       from '../../ui/pages/score-game';
import { WatchGameContainer }       from '../../ui/pages/watch-game';


const WelcomeComponent = ({name}) => (<p>Hello, {name}</p>);


/*
  Routes
*/

FlowRouter.route('/', {
  name: 'app.landing',
  action() {
    mount(LayoutContainer, { content: <LandingContainer /> });
  },
});

FlowRouter.route('/auth', {
  name: 'app.auth',
  action() {
    mount(LayoutContainer, { content: <AuthenticationContainer /> });
  },
});

FlowRouter.route('/score', {
  name: 'app.score-new',
  action() {
    mount(LayoutContainer, { content: <ScoreGameContainer newGame={true} scoreCode={null} /> });
  },
});

FlowRouter.route('/score/:ScoreGameCode', {
  name: 'app.score',
  action(params) {
    mount(LayoutContainer, { content: <ScoreGameContainer newGame={false} scoreCode={params.ScoreGameCode} /> });
  },
});

FlowRouter.route('/watch/:WatchGameCode', {
  name: 'app.watch',
  action(params) {
    mount(LayoutContainer, { content: <WatchGameContainer watchCode={params.WatchGameCode} /> });
  },
});
