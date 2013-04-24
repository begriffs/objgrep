/*jslint browser: true, indent: 2, forin: true */
/*global toString, console */
(function () {
  "use strict";
  var mark = 'visited_by_objgrep',
    objgrep = function (root, regex, depth, allow_dom, context) {
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
            if (allow_dom || !(root[i].nodeType)) {
              try {
                ret = ret.concat(objgrep(
                  root[i],
                  regex,
                  depth - 1,
                  allow_dom,
                  newContext
                ));
              } catch (e) {
                // if we cannot access a property, then so be it
              }
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

  Object.defineProperty(Object.prototype, 'grep', {
    enumerable: false,
    value: function (regex, opts) {
      var defaults = {
        depth: 5,
        allow_dom: true,
        context: ''
      }, options = {}, opt;
      for (opt in defaults) {
        options[opt] = opts[opt] || defaults[opt];
      }
      if (typeof opts.depth !== "number") {
        console.log('Using a default search depth of ' + options.depth);
      }
      return objgrep(this, regex, options.depth, options.allow_dom, options.context);
    }
  });
})();
