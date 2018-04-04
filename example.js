#! /usr/bin/env node-jxa

// say we need lodash for our script  ( remember to `yarn` or `npm install` before running this example! )
const _ = require( 'lodash' ); 

const app = Application.currentApplication(); // or Application( "Microsoft Outlook" ), or whatever scriptable application you desire
app.includeStandardAdditions = true

console.log( Date(), 'about to show a notification!' );

let input = 'My,^%)awesome,. @*`JXA".%script. (&)&is,! * running!';  // this ugly string needs cleaning up

// show an OSX notification
// DND must be off, and the current Application allowed to show notifications in OS X preferences
app.displayNotification( "notification details go here", {
  withTitle: "An OS X notification courtesy of JXA",
  subtitle: _.join( _.words( input ), ' ' ) + '!',  // let's use lodash to clean up the input string
  soundName: "Frog"
})

console.log( Date(), 'done showing the notification' );