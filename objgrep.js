/*global console */
(function () {
  'use strict';
  var mark = 'visited_by_objgrep',
    objgrep = function (root, regex, opts) {
      var ret = [], i, newContext;
      opts.context = opts.context || '';

      if (opts.depth < 1) {
        return [];
      }

      switch (typeof root) {
      case 'string':
      case 'number':
      case 'boolean':
        if (root.toString().match(regex)) {
          return [opts.context];
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
              newContext = [opts.context, i].join('.');
            } else if (i.match(/^[0-9]+$/)) {
              newContext = opts.context + '[' + i + ']';
            } else {
              newContext = opts.context + '[\'' + i + '\']';
            }

            if (opts.keys && i.match(regex)) {
              ret.push(newContext);
            }
            if (opts.dom || !(root[i] && root[i].hasOwnProperty('nodeType'))) {
              try {
                ret = ret.concat(objgrep(
                  root[i], regex,
                  {
                    context: newContext,
                    depth: opts.depth - 1,
                    dom: opts.dom,
                    keys: opts.keys
                  }
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
        dom: true,
        keys: true,
        context: ''
      }, options = {}, opt;
      opts = opts || {};
      if (typeof opts !== 'object') {
        console.log('Unknown options, see usage at https://github.com/begriffs/objgrep');
      }
      for (opt in defaults) {
        options[opt] = (opts[opt] !== undefined) ? opts[opt] : defaults[opt];
      }
      if (typeof opts.depth !== 'number') {
        console.log('Using a default search depth of ' + options.depth);
      }
      return objgrep(this, regex, options);
    }
  });
}());
