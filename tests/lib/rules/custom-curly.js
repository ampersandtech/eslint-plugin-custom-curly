/**
 * @fileoverview custom curly rule
 * @author Conor
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/custom-curly');
var RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('custom-curly', rule, {

  valid: [
    'var err = null; while (1) { if (err) continue; }',
    'function foo(err, cb) { if (err) return cb(err); }',
    'var err = null; while(1) { if (err) break; }',
    'function foo(err, cb) { if (err) return; }',
    'if (foo) { bar = 12; }',
  ],

  invalid: [
    {
      code: 'if (foo) bar = 12;',
      errors: ['Expected { after \'if\' condition.']
    }
  ]
});
