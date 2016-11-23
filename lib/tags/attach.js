var ignore = 'ignore',
    missing = 'missing';


/**
 * Attach a file in place. Forces the content to not be auto-escaped. All swig instructions will be ignored and the content will be rendered exactly as it was given.
 *
 *
 * @example
 * // var foobar = '<p>'
 * // {{ foobar }}
 * {% attach './foobar.txt' %}
 * // => {{ foobar }}
 *
 * @param {string|var}  file      The path, relative to the template root, to render into the current context.
 * @param {literal}     [ignore missing] Will output empty string if not found instead of throwing an error.
 */

exports.compile = function (compiler, args, content, parents, options, blockName) {
  var file = args.shift(),
    parentFile = (args.pop() || '').replace(/\\/g, '\\\\'),
    ignore = args[args.length - 1] === missing ? (args.pop()) : false;

  return (ignore ? ' try {\n' : '') +
    '_output += _swig.options.loader.load(_swig.options.loader.resolve(' + file + ', "' + parentFile + '"));\n' +
    (ignore ? '} catch (e) {}\n' : '');
};


exports.parse = function (str, line, parser, types, stack, opts) {
  var file;
  parser.on(types.STRING, function (token) {
    if (!file) {
      file = token.match;
      this.out.push(file);
      return;
    }

    return true;
  });

  parser.on(types.VAR, function (token) {
    if (!file) {
      file = token.match;
      return true;
    }

    if (token.match === ignore) {
      return false;
    }

    if (token.match === missing) {
      if (this.prevToken.match !== ignore) {
        throw new Error('Unexpected token "' + missing + '" on line ' + line + '.');
      }
      this.out.push(token.match);
      return false;
    }

    if (this.prevToken.match === ignore) {
      throw new Error('Expected "' + missing + '" on line ' + line + ' but found "' + token.match + '".');
    }

    return true;
  });

  parser.on('end', function () {
    this.out.push(opts.filename || null);
  });

  return true;
};