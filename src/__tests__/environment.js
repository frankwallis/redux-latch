require('ts-node').register({
   project: __dirname,     // use a different config which outputs es6
   ignoreWarnings: [2341], // access private members
   disableWarnings: false
});
 