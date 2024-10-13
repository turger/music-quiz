# Music quiz

For playing music quiz. Home page for displaying theme and all individual players can use this to save answers and calculate points.

## Setup

Add firebase:  
`npm install -g firebase-tools`

Login to firebase:  
`firebase login`

`firebase init` for a new project.   
Select hosting and no overwrite. Set public directory `build`.

add `.env` file to project root and copy items from `.env.dist` file.

`npm run start`

## Deploy to firebase

`npm run fb-deploy`

## Try it out! 🔥

https://music-quiz-wd.web.app

## TODO:

- Use database instead of local storage.
- Player name and points are saved to DB.
- Admin page where game master can set the correct answers and fix points for users if needed.
- Automatically calculate points based on answers, 80% text correctness is enough.
- Status / info page, where top 5 player's points status can be seen during the game.
