import React, { Component } from 'react';

/*
  [Game Over Component]
    This is what gets hit when a user tries to goto a game which doesn't exist.
    Should show a message about how free games are automatically wiped after x days.
*/

export const GameOverComponent = () => (
  <div className="game-over">
    Game over, this page will show scores and stats.
  </div>
);
