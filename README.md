# node-jxa

Use your favorite node.js modules, or your own local modules in your JXA (OSX Javascript automation) scripts.  Based on [this awesome tip](https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts#commonjs--browserify) from the [JXA Cookbook](https://github.com/JXA-Cookbook/JXA-Cookbook).

### What is JXA?

It's OS X automation, using Javascript.

*Applescript* has long been the scripting language provided by Apple for automating and integrating apps on Mac OS X.  The Internet is replete with Q & A, tips and examples of how to use Applescript to automate various menial tasks, like:

- Playing or managing songs in iTunes
- Setting your iMessage status
- Archiving anything to Evernote
- Capturing an email or Evernote link to your task manager (e.g. OmniFocus)

Since OS X 10.10 (Yosemite), Javascript (called Javascript for Automation, or **JXA**) is also supported for app automation.  This is great news, especially for Javascript developers who want to automate workflows on their Mac.

### What is *node-jxa*?

Based on [this awesome tip](https://github.com/JXA-Cookbook/JXA-Cookbook/wiki/Importing-Scripts#commonjs--browserify), `node-jxa` allows you to use commonJS modules in your JXA scripts.  You can `require` modules installed from npm, or your own local modules:

```javascript
const _ = require( 'lodash' ); // from npm
const myModule = require( './my-module' );  // local modules too
```

> ES6 module syntax (`import from`) aren't currently supported, so stick with `require()`, and use `module.exports` in your own local modules.

You can also use your **favorite Javascript editor** instead of the OS X Script Editor, and use workflow that is much more familiar to JS developers (vs. compiling .js files to .scpt binary format).
 
## Installation and usage

You'll likely want to install node-jxa globally:
```bash
yarn global add node-jxa # or the npm equivalent
```

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

### Node.js engine and JXA runtime

Note that your installed node.js engine is only used by `node-jxa` to bundle up your module dependencies, and to decorate your script with a couple of needed additions (using the Browserify API).  The resulting code is then piped to `osascript`, and your OS X JavaScriptCore (modified for OSA integration) is used to execute it.  Node.js is *not* ultimately used to execute your script.

### ES6+ syntax support

Fortunately the supported ES syntax and features is quite modern (depending on your OS X version).  As long as your installed node.js engine is recent enough for Browserify to bundle your code, you should be able to use just about any modern ES syntax you like (except for ES6 module syntax, i.e. `import from`).  To see what's supported, check what version of Safari you have, then find its column at [the Kangax compatibility site](https://kangax.github.io/compat-table/es6/).

### Project structure and availability of node modules

All modules you `require` in your scripts must be available, so Browserify can bundle them into your script.

I suggest managing your node-jxa scripts like any node.js project, with a package.json specifying the needed module dependencies.  Simply use `yarn` or `npm` to add and remove the libraries you need.

### Using Applescript libraries

You can use your Applescript libraries in your JXA scripts using the `Library` global function, like so:

```javascript
let myAsLib = Library( 'myApplescriptLibary' ) // skip the .scpt suffix
```

All top-level Applescript routines and handlers in the library will be available as functions on the imported object.

Library files must be located in your [Script Libraries folder or in your OSA_LIBRARY_PATH](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-11.html#//apple_ref/doc/uid/TP40014508-CH110-SW11) (the latter as of OS X 10.11) to be used in this way.

This works with JXA libraries too - you can use `Library()` to import .scpt scripts compiled from Javascript.  But since node-jxa allows you to `require()` from your local js files, it's much better to use your js libraries like local node.js modules, using `module.exports`.

### Debugging

You can [debug your JXA scripts](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-11.html#//apple_ref/doc/uid/TP40014508-CH110-SW3) using Safari dev tools.

If you use `node-debug-jxa` (instead of `node-jxa`) to run your script (or in your shebang), Browserify will include sourcemaps in the bundled code, for a cleaner debugging experience, focused on your own code.  This is the only difference between node-jxa and node-debug-jxa.

Sourcemaps will also be included if the environment variable `NODE-DEBUG-JXA` is set to `true` or `1`, regardless of which command is used to run the script.

> Depending on your Mac, you might never notice a difference in performance when including sourcemaps.  You'll definitely see more of a performance hit from requiring many large or spurious libraries.

### Other JXA resources

- [The JXA Cookbook](https://github.com/JXA-Cookbook/JXA-Cookbook)
- [Apple's JXA release notes for OS X 10.10](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-10.html#//apple_ref/doc/uid/TP40014508-CH109-SW1)
- [Apple's JXA release notes for OS X 10.11](https://developer.apple.com/library/content/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/OSX10-11.html#//apple_ref/doc/uid/TP40014508-CH110-SW1)

( I have a few more good JXA resources, I'll add them here shortly )

Unfortunately, there are many more resources available for Applescript on the interwebs (or even from Apple) than there is for JXA.  When googling for an example or recipe, you'll probably find much more help by looking an Applescript that does what you want, and then doing the translation Javascript yourself.  You can also use an Applescript library if the conversion eludes you, I have had to do this.
