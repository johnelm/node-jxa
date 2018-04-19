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
- Capture your Safari reading list to your task manager

Since OS X 10.10 (Yosemite), Javascript (called Javascript for Automation, or **JXA**) is also supported for app automation.  This is great news, especially for Javascript developers who want to automate workflows on their Mac.

### What is *node-jxa*?

Based on [this awesome tip](https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts#commonjs--browserify), `node-jxa` allows you to use commonJS modules in your JXA scripts.  You can `require` modules installed from npm, or your own local modules:

```javascript
const _ = require( 'lodash' ); // from npm
const myModule = require( './my-module' );  // local modules too
```

> ES6 module syntax (`import from`) isn't currently supported, so stick with `require()`, and use `module.exports` in your own local modules.

You can also use your **favorite Javascript editor** instead of the OS X Script Editor, and use workflow that is much more familiar to JS developers (vs. compiling .js files to .scpt binary format).

So long as your editor can launch a shebang'd script, you can run or debug JXA while you edit.
 
## Installation and usage

You'll likely want to install node-jxa globally:
```bash
yarn global add node-jxa # or the npm equivalent: npm install -g node-jxa
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

> Note that Browserify won't automatically package modules for which the `require`d path is computed at runtime.  For example, `let myNeededModulePath = './my/needed/module' ;  let myModule = require( myNeededModulePath );` will leave the module out and it won't work.  This can happen within modules you're getting from npm.
> Browserify has techniques for handling this, but node-jxa doesn't currently employ them.

### Using Applescript libraries

You can use your Applescript libraries in your JXA scripts using the `Library` global function, like so:

```javascript
let myAsLib = Library( 'myApplescriptLibary' ) // skip the .scpt suffix
```

All top-level Applescript routines and handlers in the library will be available as functions on the imported object.

Library files must be located in your [Script Libraries folder or in your OSA_LIBRARY_PATH](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-11.html#//apple_ref/doc/uid/TP40014508-CH110-SW11) (the latter as of OS X 10.11) to be used in this way.

This works with JXA libraries too - you can use `Library()` to import .scpt scripts compiled from Javascript.  But since node-jxa allows you to `require()` from your local js files, it's much better to use your js libraries like local node.js modules, using `module.exports`.

> There are several other globals added by the JXA runtime; they are detailed by [Apple, here](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-10.html#//apple_ref/doc/uid/TP40014508-CH109-SW1).

### Scripting Dictionaries

With node-jxa you can use your favorite JS editor for writing and managing your JXA code, but the OS X Script is still useful for viewing the Scripting Dictionaries for your scriptable apps.  Essentially, this is the documentation for the API exposed by the apps' developers.  Look for **Open Dictionary...** on the File Menu, and be sure to select `JavaScript` in the language selector at the top.

### Be prepared for some weirdness

Some things are weird, including but not limited to:

- trying to `console.log` a JXA application object will probably crash the process.
- [Element Arrays](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-10.html#//apple_ref/doc/uid/TP40014508-CH109-SW9) (arrays provided directly by Applications ( or [filtering via `whose()`](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-10.html#//apple_ref/doc/uid/TP40014508-CH109-SW10) ) are weird.  A simple trick like `array.map( el => el )` will give you a real JS array.
- property access for JXA objects is expensive.  If you're doing many reads, your script can take a long time and may even time out.  A caching strategy can help.

### Debugging

You can debug your JXA scripts using Safari dev tools.  To debug, [enable JSContexts support](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-11.html#//apple_ref/doc/uid/TP40014508-CH110-SW3) in Safari, then simply include the `debugger;` command in your script.  When you run the script it'll stop and open at that spot in the Safari debugger (from here, you can add additional breakpoints in Safari's debugger).

If you add the `--debug` (or `-d`) switch to the `node-jxa`, command (including in your shebangs), Browserify will include sourcemaps in the bundled code, for a cleaner debugging experience that is more focused on your own code.

Sourcemaps will also be included if the environment variable `NODE_DEBUG_JXA` is set to `true` or `1`, regardless of whether the `--debug` or `-d` switches are used.

> Depending on your Mac, you might never notice a difference in performance when including sourcemaps.  You'll definitely see more of a performance hit from requiring many large or spurious libraries, regardless of sourcemaps.

### Other JXA resources

- [The JXA Cookbook](https://github.com/JXA-Cookbook/JXA-Cookbook)
- From Apple:
  - [Apple's JXA release notes for OS X 10.10](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-10.html#//apple_ref/doc/uid/TP40014508-CH109-SW1)
  - [Apple's JXA release notes for OS X 10.11](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-11.html#//apple_ref/doc/uid/TP40014508-CH110-SW1)
  - [JXA Resources from Apple's dev groups](https://apple-dev.groups.io/g/jxa/wiki/JXA-Resources)
  - [A Beginners Guide to JXA, JavaScript Application Scripting](https://computers.tutsplus.com/tutorials/a-beginners-guide-to-javascript-application-scripting-jxa--cms-27171), Applescript [Fundamentals](https://developer.apple.com/library/content/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_fundamentals.html), [Class Reference](https://developer.apple.com/library/content/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_classes.html) and [Script Objects](https://developer.apple.com/library/content/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_script_objects.html)
  - [Using Script Libraries](https://developer.apple.com/library/content/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/UseScriptLibraries.html#//apple_ref/doc/uid/TP40016239-CH36-SW1)
- [Example OS X applications written in JavaScript](https://github.com/tylergaw/js-osx-app-examples) and [Building OS X Apps with JavaScript](https://tylergaw.com/articles/building-osx-apps-with-js/) by Tyler Gaw
- [Automation for OS X: the JavaScript way](https://hackmag.com/coding/getting-to-grips-with-javascript-automation-for-os-x/) – HackMag
- [lucaswoj/slick](https://github.com/lucaswoj/slick): A port of React Native to OS X using the "JavaScript for Automation" framework


Note that there are many more resources available for Applescript on the interwebs (or even from Apple) than there is for JXA.  When googling for an example or recipe, you'll probably find much more help by looking an Applescript that does what you want, and then converting to Javascript yourself.  You can temporarily use an Applescript library if the conversion eludes you for a time.


