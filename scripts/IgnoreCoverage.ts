///<reference path="../typings/tsd.d.ts"/>

import fs = require('fs');

let utils: string = fs.readFileSync('./dist/utils.js', 'utf8');

utils = utils.replace(/(\((\w+)?(\s\|\|)\s\(\w+\s=\s\{\}\)\))/g, '/* istanbul ignore next */$1');
utils = utils.replace(/(\(\w+\s=\s\w+\.\w+\s\|\|\s\(\w+\.\w+\s\=\s\{\}\)\))/g, '/* istanbul ignore next */$1');

fs.writeFileSync('./dist/utils.coverage.js', utils);