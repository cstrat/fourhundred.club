# fourhundred.club

> A scoring app for the card game 400 or arba3meyeh.

So I have got this mate who recons he is the best at 400 ever... He recounts stories of calling 10 and making it multiple times when no one else can remember. Anyway, this will be our place to keep our games logged. Stats will be collated and games can be reported on. I am working on building all this functionality into the app. I am happy for anyone else to score their games using the app too.

Once I get the app up and running completely, I will post a proper `readme` here with information and help.


# To Do Actions

- [x] build the ui to show a runsheet of the game scores
- [x] include email notification for starting a game
- [ ] refactor the call & make/results jsx files into one
- [ ] include toggles to allow for alternate scoring rules to be played
- [ ] build a dedicated ui to spectate (for other players to load on their device)
- [ ] build the functionality to report on game stats at the end (who called the highest etc...)
- [ ] build a way to email those stats to players
- [ ] setup an account system to let players login and keep their games together
- [ ] update the cron to only delete games setup by unregistered users


# Warnings

Please note that while in development, don't expect games to stay around.
It is possible that the database will need to be flushed.
Right now all games which are abandoned will be deleted automatically - you have 18 hours to complete a game.
