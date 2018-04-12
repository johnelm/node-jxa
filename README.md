# node-jxa

[![Build Status](https://travis-ci.org/johnelm/node-jxa.svg?branch=master)](https://travis-ci.org/johnelm/node-jxa)
[![npm version](https://img.shields.io/npm/v/node-jxa.svg?maxAge=60)](https://www.npmjs.com/package/node-jxa)
[![downloads](https://img.shields.io/npm/dt/node-jxa.svg?maxAge=60)](https://www.npmjs.com/package/node-jxa)
[![github](https://img.shields.io/github/package-json/v/johnelm/node-jxa.svg?label=github&maxAge=60)](https://github.com/johnelm/node-jxa)

Use your favorite node.js modules, or your own local modules, in your JXA (OSX Javascript automation) scripts.  Based on [this awesome tip](https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts#commonjs--browserify) from the [JXA Cookbook](https://github.com/JXA-Cookbook/JXA-Cookbook).

### What is JXA?

It's OS X automation, using Javascript.

*Applescript* has long been the scripting language provided by Apple for automating and integrating apps on Mac OS X.  The Internet is replete with Q & A, tips and examples of how to use Applescript to automate various menial tasks, like:

- Archiving anything to Evernote
- Capturing an email or Evernote link to your task manager (e.g. OmniFocus)
- Capture your Safari reading list to 

Since OS X 10.10 (Yosemite), Javascript (called Javascript for Automation, or **JXA**) is also supported for app automation.  This is great news, especially for Javascript developers who want to automate workflows on their Mac.

### What is *node-jxa*?

Based on [this awesome tip](https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts#commonjs--browserify), `node-jxa` allows you to use commonJS modules in your JXA scripts.  You can `require` modules installed from npm, or your own local modules:

```javascript
const _ = require( 'lodash' ); // from npm
const myModule = require( './my-module' );  // local modules too
```

> ES6 module syntax (`import from`) isn't currently supported, so stick with `require()`, and use `module.exports` in your own local modules.

You can also use your **favorite Javascript editor** instead of the OS X Script Editor, and use workflow that is much more familiar to JS developers (vs. compiling .js files to .scpt binary format).
 
## Installation and usage

You'll likely want to install node-jxa globally:
```bash
yarn global add node-jxa # or the npm equivalent
```

This will install `node-jxa` and make it available in your `PATH` env var.

.. then you can (optionally) use a shebang at the top of your JXA script:

```javascript
#! /usr/bin/env node-jxa

// ... rest of script
```

and make your script executable:

```bash
chmod u+x my-jxa-script.js
```

.. so you can run it from the command line (**or**, using your favorite script launcher, keyboard shortcuts, etc).

```bash
./my-jxa-script.js
```

You can of course use the `node-jxa` command on the command line; simply provide the jxa script as the first argument:

```bash
node-jxa ./my-jxa-script.js
```

### Node.js engine and JXA runtime

Note that your installed node.js engine is only used by `node-jxa` to bundle up your module dependencies, and to decorate your script with a couple of needed additions (using the Browserify API).  The resulting code is then piped to `osascript`, and your OS X JavaScriptCore (modified for OSA integration) is used to execute it.  Node.js is *not* ultimately used to execute your script.

### ES6+ syntax support

Fortunately the supported ES syntax and features is quite modern (depending on your OS X version).  As long as your installed node.js engine is recent enough for Browserify to bundle your code, you should be able to use just about any modern ES syntax you like (except for ES6 module syntax, i.e. `import from`).  To see what's supported, check what version of Safari you have, then find its column at [the Kangax compatibility site](https://kangax.github.io/compat-table/es6/).

### Project structure and availability of node modules

All modules you `require` in your scripts must be installed (i.e. in the `node_modules` dir) to be available, so Browserify can bundle them into your script.

I suggest managing your node-jxa scripts like any node.js project, with a package.json specifying the needed module dependencies.  Simply use `yarn` or `npm` to add and remove the libraries you need.

### Using Applescript libraries

You can use your Applescript libraries in your JXA scripts using the `Library` global function, like so:

```javascript
let myAsLib = Library( 'myApplescriptLibary' ) // skip the .scpt suffix
```

All top-level Applescript routines and handlers in the library will be available as functions on the imported object.

Library files must be located in your [Script Libraries folder or in your OSA_LIBRARY_PATH](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-11.html#//apple_ref/doc/uid/TP40014508-CH110-SW11) (the latter as of OS X 10.11) to be used in this way.

This works with JXA libraries too - you can use `Library()` to import .scpt scripts compiled from Javascript.  But since node-jxa allows you to `require()` from your local js files, it's much better to use your js libraries like local node.js modules, using `module.exports`.

> There are other global functions and objects added by the JXA runtime; they are detailed by [Apple, here](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-10.html#//apple_ref/doc/uid/TP40014508-CH109-SW1).

### Scripting Dictionaries

While node-jxa obviates the use of the OS X Script Editor for your JXA scripts, it's still needed for viewing the Scripting 
Disctionary for your scriptable apps.  This is the documentation for the API exposed by the apps' vendors.

### Be prepared for some weirdness

Some things are weird:

- trying to `console.log` a JXA application object will probably crash the process.
- arrays returned by Applications are weird.  `array.map( el => el );` can give you a real JS array.
- property access for JXA objects is expensive.  A caching strategy can help.

### Debugging

You can [debug your JXA scripts](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-11.html#//apple_ref/doc/uid/TP40014508-CH110-SW3) using Safari dev tools.

If you add the `--debug` (or `-d`) switch to the `node-jxa`, command (including in your shebangs), Browserify will include sourcemaps in the bundled code, for a cleaner debugging experience that is more focused on your own code.

Sourcemaps will also be included if the environment variable `NODE_DEBUG_JXA` is set to `true` or `1`, regardless of whether the `--debug` or `-d` switches are used.

> Depending on your Mac, you might never notice a difference in performance when including sourcemaps.  You'll definitely see more of a performance hit from requiring many large or spurious libraries, regardless of sourcemaps.

### Other JXA resources

- [The JXA Cookbook](https://github.com/JXA-Cookbook/JXA-Cookbook)
- [Apple's JXA release notes for OS X 10.10](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-10.html#//apple_ref/doc/uid/TP40014508-CH109-SW1)
- [Apple's JXA release notes for OS X 10.11](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-11.html#//apple_ref/doc/uid/TP40014508-CH110-SW1)

( I have a few more good JXA resources, I'll add them here shortly )

Unfortunately, there are many more resources available for Applescript on the interwebs (or even from Apple) than there is for JXA.  When googling for an example or recipe, you'll probably find much more help by looking an Applescript that does what you want, and then converting to Javascript yourself.  You can temporarily use an Applescript library if the conversion eludes you (I have had to do this).


### roundup of JXA links:
```
JXA resources for README
	OS X 10.10 Release Notes
		notes
			https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-10.html#//apple_ref/doc/uid/TP40014508-CH109-SW1
	OS X 10.11 Release Notes
		notes
			https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-11.html#//apple_ref/doc/uid/TP40014508-CH110-SW1
	jxa@apple-dev.groups.io | Wiki
		notes
			https://apple-dev.groups.io/g/jxa/wiki/JXA-Resources
	AppleScript Fundamentals
		notes
			https://developer.apple.com/library/content/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_fundamentals.html#//apple_ref/doc/uid/TP40000983-CH218-SW7
	@microsoft/rush - npm
		notes
			https://www.npmjs.com/package/@microsoft/rush
	tylergaw/js-osx-app-examples: Example OS X applications written in JavaScript.
		notes
			https://github.com/tylergaw/js-osx-app-examples
	Building OS X Apps with JavaScript by Tyler Gaw
		notes
			https://tylergaw.com/articles/building-osx-apps-with-js/
	A Beginners Guide to JXA, JavaScript Application Scripting
		notes
			https://computers.tutsplus.com/tutorials/a-beginners-guide-to-javascript-application-scripting-jxa--cms-27171
	jxa - npm
		notes
			https://www.npmjs.com/package/jxa
	osa2 - npm
		notes
			https://www.npmjs.com/package/osa2
	Home · JXA-Cookbook/JXA-Cookbook Wiki
		notes
			https://github.com/JXA-Cookbook/JXA-Cookbook/wiki
	Class Reference
		notes
			https://developer.apple.com/library/content/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_classes.html
	wtfaremyinitials/jxa: Access macOS JavaScript for Automation APIs directly in node
		notes
			https://github.com/wtfaremyinitials/jxa
	JXA script for toggling "Considered" tasks in OmniFocus
		notes
			https://gist.github.com/brandonpittman/adf8e572a3c5bc75649a
	Where is OmniFocus JavaScript for Automation (JXA) Library? · Issue #12 · brandonpittman/OmniFocus
		notes
			https://github.com/brandonpittman/OmniFocus/issues/12
	Script Objects
		notes
			https://developer.apple.com/library/content/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_script_objects.html
	Variables and Properties
		notes
			https://developer.apple.com/library/content/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_variables.html
	javascript - How can I find out all the methods on a JXA object? - Stack Overflow
		notes
			https://stackoverflow.com/questions/41903800/how-can-i-find-out-all-the-methods-on-a-jxa-object
	omnigroup/OmniGroup: Source for many of The Omni Group's frameworks
		notes
			https://github.com/omnigroup/OmniGroup
	language-javascript-jxa
		notes
			https://atom.io/packages/language-javascript-jxa
	Learning & Using AppleScript & JavaScript for Automation (JXA) - Questions & Suggestions - Keyboard Maestro Discourse
		notes
			https://forum.keyboardmaestro.com/t/learning-using-applescript-javascript-for-automation-jxa/1545/80
	Introduction to JavaScript for Automation Release Notes
		notes
			https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/Introduction.html
	dagware/DanThomas: Dan Thomas' stuff
		notes
			https://github.com/dagware/DanThomas
	JavaScript for Automation [Keyboard Maestro Wiki]
		notes
			https://wiki.keyboardmaestro.com/JavaScript_for_Automation
	JavaScript for Automation - WWDC 2014 - Videos - Apple Developer
		notes
			https://developer.apple.com/videos/play/wwdc2014/306/
	Ramda Documentation
		notes
			http://ramdajs.com/
	AppleScript Fundamentals
		notes
			https://developer.apple.com/library/content/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_fundamentals.html
	Failed to open page
		notes
			safari-resource:/ErrorPage.html
	Listing all commands and shortcuts (JXA and Applescript versions) - FoldingText - Hog Bay Software Support
		notes
			http://support.hogbaysoftware.com/t/listing-all-commands-and-shortcuts-jxa-and-applescript-versions/618
	Toggling OS X Sound Output Devices with JXA Javascript for Automation (OS X 10.10)
		notes
			https://gist.github.com/RobTrew/2a57cd45fae7162ddf40
	Persistent 'properties' for OS X JavaScript for Applications (JXA)
		notes
			https://gist.github.com/RobTrew/6bc1fcc997844faec3cf
	wtfaremyinitials/osa-contacts: Access contact information on OSX with Node.JS
		notes
			https://github.com/wtfaremyinitials/osa-contacts
	sindresorhus/run-jxa: Run JXA code and get the result
		notes
			https://github.com/sindresorhus/run-jxa
	wtfaremyinitials/osa-omnifocus
		notes
			https://github.com/wtfaremyinitials/osa-omnifocus
	osa - npm
		notes
			https://www.npmjs.com/package/osa
	OS X 10.10 (Yosemite) definitions of the basic script editing functions used in iOS Drafts 4
		notes
			https://gist.github.com/RobTrew/ca48a04b491449209385
	Automation for OS X: the JavaScript way – HackMag
		notes
			https://hackmag.com/coding/getting-to-grips-with-javascript-automation-for-os-x/
	AS:  How to Install AppleScripts or JXA Scripts
		notes
			https://www.evernote.com/shard/s27/sh/d7efdf2b-d07b-4fc3-a1bb-0fbfa8a5908f/0b1cc4ebf8a50a0b
	Extensibility and Automation Changes in OS X Yosemite – MacStories
		notes
			https://www.macstories.net/mac/extensibility-and-automation-changes-in-os-x-yosemite/
	Getting Started with JavaScript for Automation on Yosemite – MacStories
		notes
			https://www.macstories.net/tutorials/getting-started-with-javascript-for-automation-on-yosemite/
	Mac Automation Scripting Guide: Using Script Libraries
		notes
			https://developer.apple.com/library/content/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/UseScriptLibraries.html#//apple_ref/doc/uid/TP40016239-CH36-SW1
	Javascript for Automation in macOS – Hacker Noon
		notes
			https://hackernoon.com/javascript-for-automation-in-macos-3b499da40da1
	dtinth/jxapp
		notes
			https://github.com/dtinth/jxapp
	Commands Reference
		notes
			https://developer.apple.com/library/content/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_cmds.html
	idleberg/atom-build-osa: Atom Build provider for Apple's Open Scripting Architecture, runs or compiles AppleScript and JavaScript for Automation (JXA)
		notes
			https://github.com/idleberg/atom-build-osa
	lucaswoj/slick: A port of React Native to OS X using the "JavaScript for Automation" framework
		notes
			https://github.com/lucaswoj/slick
	slick/package.json at master · lucaswoj/slick
		notes
			https://github.com/lucaswoj/slick/blob/master/package.json

```
