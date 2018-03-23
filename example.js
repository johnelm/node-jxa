ObjC.import( "stdlib" );

const outlookApp = Application( "Microsoft Outlook" );

const _ = require('lodash');

outlookApp.includeStandardAdditions = true

outlookApp.displayAlert('hello!');