$.deparam = function (string, coerce) {
  var queryString = /^\?(.*)/,
    rplus = /\+/g,
    rrightbracket = /\]$/,
    number = /^[0-9]+$/,

  // coerces a value into its intended value
  coerceValue = function (value) {
    return value && number.test(value) ? +value // number
      : value === 'undefined' ? undefined // undefined
      : value === 'true' ? true // true
      : value === 'false' ? false // false
      : value === 'null' ? null // null
      : value; // string
  },

  // parses encoded key/value pairs
  // will extend the key/value pairs onto the optional object argument
  parseParams = function (key, value, coerce, obj) {
    var keys = key.split('['),
      value = coerce ? coerceValue(decodeURIComponent(value)) : decodeURIComponent(value),
      obj = obj || {},
      current = obj;

    $.each(keys, function (i, k) {
      k = decodeURIComponent(k.replace(rrightbracket, ''));
      var v = (i == (keys.length - 1)) ? value : (!k || (!keys[i + 1].replace(rrightbracket, '')) ? [] : {});

      if (k) {
        if ($.isArray(current)) {
          if (!current.length || k in current[current.length - 1]) {
            var term = {};
            term[k] = v;
            current.push(term);
          } else {
            current[current.length - 1][k] = v;
          }
        } else {
          if (!(k in current)) {
            current[k] = v;
          }
          current = current[k];
        }
      } else {
        current = $.isArray(current) ? current.push(v) : v;
      }
    });
  };

  // extract the query params if string is a url
  var extracted = string.match(queryString);
  string = extracted ? extracted[1] || extracted[0] : string;

  // extract the key/value pairs
  var items = string.replace(rplus, ' ').split('&'),
    obj = {};

  // loop through and parse the key/value pairs
  $.each(items, function (i, v) {
    var param = v.split('=');
    parseParams(param[0], param[1], coerce, obj);
  });

  return obj;
};
