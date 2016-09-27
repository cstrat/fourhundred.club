import React, { Component } from 'react';

/*
  [Not Found Component]
    This is what gets hit when a user tries to goto a game which doesn't exist.
    Should show a message about how free games are automatically wiped after x days.
*/

export const GameNotFoundComponent = () => (
  <div className="game-not-found">
    <h2 className="error">Game Data Not Found!</h2>
  </div>
);
