/*jslint browser: true, indent: 2, forin: true */
/*global toString, console */
(function () {
  "use strict";
  var mark = 'visited_by_objgrep',
    objgrep = function (root, regex, depth, context) {
      var className, ret = [], i, newContext;
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
        if (!root || root.hasOwnProperty(mark)) {
          return [];  // cyclic
        }
        root[mark] = true;
        for (i in root) {
          if (i !== mark) {
            if (i.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
              newContext = [context, i].join('.');
            } else if (i.match(/^[0-9]+$/)) {
              newContext = context + "[" + i + "]";
            } else {
              newContext = context + "['" + i + "']";
            }

            if (i.match(regex)) {
              ret.push(newContext);
            }
            try {
              ret = ret.concat(objgrep(
                root[i],
                regex,
                depth - 1,
                newContext
              ));
            } catch (e) {
              // if we cannot access a property, then so be it
            }
          }
        }
        delete root[mark];
        break;
      default:
        break;
      }
      return ret;
    };

  Object.prototype.grep = function (regex, depth, context) {
    if (typeof depth !== "number") {
      depth = 5;
      console.log('Using a default search depth of ' + depth);
    }
    return objgrep(this, regex, depth, context);
  };
})();
