/**
 * @fileoverview custom curly rule
 * @author Conor
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var astUtils = require('eslint/lib/ast-utils');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  // variables should be defined here

  //--------------------------------------------------------------------------
  // Helpers
  //--------------------------------------------------------------------------


  /**
   * Determines if a given node is a one-liner that's on the same line as it's preceding code.
   * @param {ASTNode} node The node to check.
   * @returns {boolean} True if the node is a one-liner that's on the same line as it's preceding code.
   * @private
   */
  function isCollapsedOneLiner(node) {
    var before = context.getTokenBefore(node);
    var last = context.getLastToken(node);

    return before.loc.start.line === last.loc.end.line;
  }

  /**
   * Reports "Expected { after ..." error
   * @param {ASTNode} node The node to report.
   * @param {string} name The name to report.
   * @param {string} suffix Additional string to add to the end of a report.
   * @returns {void}
   * @private
   */
  function reportExpectedBraceError(node, name, suffix) {
    context.report({
      node: node,
      loc: (name !== 'else' ? node : getElseKeyword(node)).loc.start,
      message: 'Expected { after \'{{name}}\'{{suffix}}.',
      data: {
        name: name,
        suffix: (suffix ? ' ' + suffix : '')
      }
    });
  }

  /**
   * Prepares to check the body of a node to see if it's a block statement.
   * @param {ASTNode} node The node to report if there's a problem.
   * @param {ASTNode} body The body node to check for blocks.
   * @param {string} name The name to report if there's a problem.
   * @param {string} suffix Additional string to add to the end of a report.
   * @returns {object} a prepared check object, with 'actual', 'expected', 'check' properties.
   *   'actual' will be `true` or `false` whether the body is already a block statement.
   *   'expected' will be `true` or `false` if the body should be a block statement or not, or
   *   `null` if it doesn't matter, depending on the rule options. It can be modified to change
   *   the final behavior of 'check'.
   *   'check' will be a function reporting appropriate problems depending on the other
   *   properties.
   */
  function prepareCheck(node, body, name, suffix) {
    var hasBlock = (body.type === 'BlockStatement');
    var expected = null;

    if (!hasBlock && isCollapsedOneLiner(body)) {
      if (body.type === 'BreakStatement' || body.type === 'ReturnStatement' || body.type === 'ContinueStatement') {
        expected = null;
      } else {
        expected = true;
      }
    }

    return {
      expected: expected,
      check: function() {
        if (this.expected) {
          reportExpectedBraceError(node, name, suffix);
        }
      }
    };
  }

  /**
   * Prepares to check the bodies of a 'if', 'else if' and 'else' chain.
   * @param {ASTNode} node The first IfStatement node of the chain.
   * @returns {object[]} prepared checks for each body of the chain. See `prepareCheck` for more
   *   information.
   */
  function prepareIfChecks(node) {
    var preparedChecks = [];

    do {
      preparedChecks.push(prepareCheck(node, node.consequent, 'if', 'condition'));
      if (node.alternate && node.alternate.type !== 'IfStatement') {
        preparedChecks.push(prepareCheck(node, node.alternate, 'else'));
        break;
      }
      node = node.alternate;
    } while (node);

    return preparedChecks;
  }


  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {
    'IfStatement': function(node) {
      if (node.parent.type !== 'IfStatement') {
        prepareIfChecks(node).forEach(function(preparedCheck) {
          preparedCheck.check();
        });
      }
    },
  };

};

module.exports.schema = [
  // fill in your schema
];
