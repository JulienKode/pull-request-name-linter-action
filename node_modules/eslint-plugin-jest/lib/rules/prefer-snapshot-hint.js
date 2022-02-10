"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

const snapshotMatchers = ['toMatchSnapshot', 'toThrowErrorMatchingSnapshot'];

const isSnapshotMatcher = matcher => {
  return snapshotMatchers.includes(matcher.name);
};

const isSnapshotMatcherWithoutHint = matcher => {
  var _matcher$arguments;

  const expectedNumberOfArgumentsWithHint = 1 + Number(matcher.name === 'toMatchSnapshot');
  return ((_matcher$arguments = matcher.arguments) === null || _matcher$arguments === void 0 ? void 0 : _matcher$arguments.length) !== expectedNumberOfArgumentsWithHint;
};

const messages = {
  missingHint: 'You should provide a hint for this snapshot'
};

var _default = (0, _utils.createRule)({
  name: __filename,
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Prefer including a hint with external snapshots',
      recommended: false
    },
    messages,
    type: 'suggestion',
    schema: [{
      type: 'string',
      enum: ['always', 'multi']
    }]
  },
  defaultOptions: ['multi'],

  create(context, [mode]) {
    const snapshotMatchers = [];
    let expressionDepth = 0;

    const reportSnapshotMatchersWithoutHints = () => {
      for (const snapshotMatcher of snapshotMatchers) {
        if (isSnapshotMatcherWithoutHint(snapshotMatcher)) {
          context.report({
            messageId: 'missingHint',
            node: snapshotMatcher.node.property
          });
        }
      }
    };

    const enterExpression = () => {
      expressionDepth++;
    };

    const exitExpression = () => {
      expressionDepth--;

      if (mode === 'always') {
        reportSnapshotMatchersWithoutHints();
        snapshotMatchers.length = 0;
      }

      if (mode === 'multi' && expressionDepth === 0) {
        if (snapshotMatchers.length > 1) {
          reportSnapshotMatchersWithoutHints();
        }

        snapshotMatchers.length = 0;
      }
    };

    return {
      'Program:exit'() {
        enterExpression();
        exitExpression();
      },

      FunctionExpression: enterExpression,
      'FunctionExpression:exit': exitExpression,
      ArrowFunctionExpression: enterExpression,
      'ArrowFunctionExpression:exit': exitExpression,

      CallExpression(node) {
        if (!(0, _utils.isExpectCall)(node)) {
          return;
        }

        const {
          matcher
        } = (0, _utils.parseExpectCall)(node);

        if (!matcher || !isSnapshotMatcher(matcher)) {
          return;
        }

        snapshotMatchers.push(matcher);
      }

    };
  }

});

exports.default = _default;