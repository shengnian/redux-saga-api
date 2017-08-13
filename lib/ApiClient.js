'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ApiClient = function () {
  function ApiClient(passedConfig) {
    var _this = this;

    (0, _classCallCheck3.default)(this, ApiClient);

    var baseConfig = {
      mode: 'cors',
      cache: 'no-cache',
      bodyEncoder: _stringify2.default,
      credentials: 'include',
      format: 'json',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      methods: ['get', 'post', 'put', 'patch', 'delete', 'options', 'head']
    };

    if (!passedConfig.basePath) {
      // e.g. 'https://example.com/api/v3'
      throw new Error('You must pass a base path to the ApiClient');
    }

    var methods = passedConfig.methods || baseConfig.methods;
    methods.forEach(function (method) {
      _this[method] = function (path) {
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            params = _ref.params,
            data = _ref.data,
            fetchConfig = _ref.fetchConfig;

        var config = (0, _extends3.default)({}, baseConfig, passedConfig, fetchConfig, {
          headers: (0, _extends3.default)({}, baseConfig.headers, passedConfig ? passedConfig.headers : {}, fetchConfig ? fetchConfig.headers : {})
        });
        var _methods = config.methods,
            basePath = config.basePath,
            headers = config.headers,
            format = config.format,
            bodyEncoder = config.bodyEncoder,
            otherConfig = (0, _objectWithoutProperties3.default)(config, ['methods', 'basePath', 'headers', 'format', 'bodyEncoder']);

        var queryString = _this.serialize(params).indexOf('&') > 0 ? '?' + _this.serialize(params) : '';

        var requestPath = basePath + path + queryString;
        var body = data ? bodyEncoder(data) : undefined;

        return fetch(requestPath, (0, _extends3.default)({}, otherConfig, {
          method: method,
          headers: headers,
          body: body
        })).then(function (response) {
          return { response: response, format: format };
        }).then(_this.handleErrors).then(function (response) {
          return response[format]();
        }).catch(function (err) {
          var errStr = err.toString();
          if (errStr.indexOf('TypeError') >= 0) {
            var dateTime = +new Date();
            var errMsg = {
              status: -1,
              message: err.toString(),
              error: false,
              timestamp: Math.floor(dateTime / 1000)
            };
            throw (0, _stringify2.default)(errMsg);
          } else {
            throw err;
          }
        });
      };
    });
  }

  (0, _createClass3.default)(ApiClient, [{
    key: 'serialize',
    value: function serialize(obj, prefix) {
      var _this2 = this;

      return (0, _keys2.default)(obj).map(function (key) {
        var k = !prefix ? key : prefix;
        var v = obj[key];
        return v !== null && (typeof v === 'undefined' ? 'undefined' : (0, _typeof3.default)(v)) === 'object' ? _this2.serialize(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v);
      }).join('&');
    }

    /* eslint-disable class-methods-use-this */

  }, {
    key: 'handleErrors',
    value: function handleErrors(_ref2) {
      var response = _ref2.response,
          format = _ref2.format;

      if (!response.ok) {
        return response[format]()
        // if response parsing failed send back the entire response object
        //   .catch(() => {
        //     throw response
        //   })
        // else send back the parsed error
        .then(function (parsedErr) {
          throw (0, _stringify2.default)(parsedErr);
        });
      }
      return response;
    }
  }]);
  return ApiClient;
}();

exports.default = ApiClient;