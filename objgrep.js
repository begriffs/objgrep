/*jslint browser: true, indent: 2, forin: true */
/*global toString */
(function () {
  "use strict";
  var objgrep = function (root, regex, depth, context) {
    var className, ret = [], i, newContext;
    if (typeof depth !== "number") {
      depth = Infinity;
    }
    context = context || '';

    if (depth < 1) {
      return [];
    }

    switch (typeof root) {
    case 'string':
    case 'number':
    case 'boolean':
      if (root.toString().match(regex)) {
        return [context];
      }
      break;
    case 'object':
      if (root instanceof Array) {
        for (i = 0; i < root.length; i += 1) {
          ret = ret.concat(objgrep(
            root[i],
            regex,
            depth - 1,
            context + '[' + i + ']'
          ));
        }
      } else {
        for (i in root) {
          if (i.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
            newContext = [context, i].join('.');
          } else {
            newContext = context + "['" + i + "']";
          }
          ret = ret.concat(objgrep(
            root[i],
            regex,
            depth - 1,
            newContext
          ));
        }
      }
      break;
    default:
      break;
    }
    return ret;
  };

  Object.prototype.grep = function (regex, depth, context) {
    return objgrep(this, regex, depth, context);
  };
})();
