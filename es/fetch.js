'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _whatwgFetch = require('whatwg-fetch');

var _whatwgFetch2 = _interopRequireDefault(_whatwgFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assign = Object.assign;

/**
 * Private utils
 */
function isObject(obj) {
  // {} Not null
  return obj && Object.prototype.toString.call(obj) === '[object Object]' && Object.keys(obj).length !== 0;
  // return obj && typeof obj === 'object'
}

function isJsonType(contentType) {
  return contentType && contentType.indexOf('application/json') === 0;
}

function stringify(obj) {
  return Object.keys(obj).map(function (key) {
    return key + ' = ' + obj[key];
  }).join('&');
}

function isNode() {
  return Object.prototype.toString.call(process) === '[object Object]' && process.title === 'node';
}

/**
 * Request
 */

var Request = function () {
  function Request(method, url) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Request);

    if (Object.prototype.toString.call(url) !== '[object String]') {
      throw new TypeError('invalid url');
    }

    this.options = assign({}, {
      method: 'get',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {},
      query: {}
    }, opts);
    var options = this.options;

    var prefix = options.prefix || '';
    this.url = prefix + url;

    options.method = method;

    // fetch will normalize the headers
    var headers = options.headers;
    Object.keys(headers).forEach(function (h, index) {
      if (h !== h.toLowerCase()) {
        headers[h.toLowerCase()] = headers[h];
        delete headers[h];
      }
    });
  }

  /**
   * Set Options
   *
   * Examples:
   *
   *   .config('credentials', 'omit')
   *   .config({ credentials: 'omit' })
   *
   * @param {String|Object} key
   * @param {Any} value
   * @return {Request}
   */


  _createClass(Request, [{
    key: 'config',
    value: function config(key, value) {
      var options = this.options;

      if (Object.prototype.toString.call(key) === '[object Object]') {
        Object.keys(key).forEach(function (k, index) {
          options[k] = key[k];
        });
      } else {
        options[key] = value;
      }

      return this;
    }

    /**
     * Set header
     *
     * Examples:
     *
     *   .header('Accept', 'application/json')
     *   .header({ Accept: 'application/json' })
     *
     * @param {String|Object} key
     * @param {String} value
     * @return {Request}
     */

  }, {
    key: 'header',
    value: function header(key, value) {
      var headers = this.options.headers;

      if (Object.prototype.toString.call(key) === '[object Object]') {
        Object.keys(key).forEach(function (k, index) {
          headers[k.toLowerCase()] = key[k];
        });
      } else {
        headers[key.toLowerCase()] = value;
      }

      return this;
    }

    /**
     * Set Content-Type
     *
     * @param {String} type
     */

  }, {
    key: 'type',
    value: function type(_type) {
      var newType = void 0;
      switch (_type) {
        case 'json':
          newType = 'application/json';
          break;
        case 'form':
        case 'urlencoded':
          newType = 'application/x-www-form-urlencoded';
          break;
        default:
          newType = 'application/json';
          break;
      }

      this.options.headers['content-type'] = newType;

      return this;
    }

    /**
     * Add query string
     *
     * @param {Object} object
     * @return {Request}
     */

  }, {
    key: 'query',
    value: function query(object) {
      var query = this.options.query;

      Object.keys(object).forEach(function (k, index) {
        query[k] = object[k];
      });

      return this;
    }

    /**
     * Send data
     *
     * Examples:
     *
     *   .send('name=hello')
     *   .send({ name: 'hello' })
     *
     * @param {String|Object} data
     * @return {Request}
     */

  }, {
    key: 'send',
    value: function send(data) {
      var _this = this;

      var type = this.options.headers['content-type'];

      if (isObject(data) && isObject(this.sendBody)) {
        // merge body
        Object.keys(data).forEach(function (k, index) {
          _this.sendBody[k] = data[k];
        });
        // for (let key in data) {
        //   this.sendBody[key] = data[key]
        // }
      } else if (Object.prototype.toString.call(data) === '[object String]') {
        if (!type) {
          type = 'application/x-www-form-urlencoded';
          this.options.headers['content-type'] = type;
        }

        if (type.indexOf('x-www-form-urlencoded') !== -1) {
          this.sendBody = this.sendBody ? this.sendBody + '&' + data : data;
        } else {
          this.sendBody = (this.sendBody || '') + data;
        }
      } else {
        this.sendBody = data;
      }

      // default to json
      if (!type) {
        this.options.headers['content-type'] = 'application/json';
      }

      return this;
    }

    /**
     * Append formData
     *
     * Examples:
     *
     *   .append(name, 'hello')
     *
     * @param {String} key
     * @param {String} value
     * @return {Request}
     */

  }, {
    key: 'append',
    value: function append(key, value) {
      if (!(this.sendBody instanceof window.FormData)) {
        this.sendBody = new window.FormData();

        if (isNode()) {
          var headers = this.sendBody.getHeaders();
          if (headers && headers['content-type']) {
            this.options.headers['content-type'] = headers['content-type'];
          }
        }
      }

      this.sendBody.append(key, value);

      return this;
    }
  }, {
    key: 'promise',
    value: function promise() {
      var options = this.options;
      var url = this.url;
      var beforeRequest = options.beforeRequest,
          afterResponse = options.afterResponse;


      try {
        if (['GET', 'HEAD', 'OPTIONS'].indexOf(options.method.toUpperCase()) === -1) {
          if (this.sendBody instanceof FormData) {
            options.body = this.sendBody;
          } else if (isObject(this.sendBody) && isJsonType(options.headers['content-type'])) {
            options.body = JSON.stringify(this.sendBody);
          } else if (isObject(this.sendBody)) {
            options.body = stringify(this.sendBody);
          } else {
            options.body = this.sendBody;
          }
        } else {
          delete options.headers['content-type'];
        }

        if (isObject(options.query)) {
          if (url.indexOf('?') >= 0) {
            url += '&' + stringify(options.query);
          } else {
            url += '?' + stringify(options.query);
          }
        }

        if (beforeRequest) {
          var canceled = beforeRequest(url, options.body);
          if (canceled === false) {
            return Promise.reject(new Error('request canceled by beforeRequest'));
          }
        }
      } catch (e) {
        return Promise.reject(e);
      }

      if (afterResponse) {
        return (0, _whatwgFetch2.default)(url, options).then(function (res) {
          afterResponse(res);
          return res;
        });
      }

      return (0, _whatwgFetch2.default)(url, options);
    }
  }, {
    key: 'then',
    value: function then(resolve, reject) {
      return this.promise().then(resolve, reject);
    }
  }, {
    key: 'catch',
    value: function _catch(reject) {
      return this.promise().catch(reject);
    }
  }, {
    key: 'json',
    value: function json() {
      var _this2 = this;

      var strict = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      return this.promise().then(function (res) {
        return res.json();
      }).then(function (json) {
        if (strict && !isObject(json)) {
          throw new TypeError('response is not strict json');
        }

        if (_this2.options.afterJSON) {
          _this2.options.afterJSON(json);
        }

        return json;
      });
    }
  }, {
    key: 'text',
    value: function text() {
      return this.promise().then(function (res) {
        return res.text();
      });
    }
  }]);

  return Request;
}();

/**
 * Fetch
 */


function Fetch(options) {
  if (!(this instanceof Fetch)) {
    return new Fetch(options);
  }

  this.options = options || {};
}

var methods = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch'];

methods.forEach(function (method) {
  undefined[method] = function (url) {
    var opts = assign({}, undefined.options);
    return new Request(method, url, opts);
  };
});

/**
 * export
 */
module.exports = Fetch;