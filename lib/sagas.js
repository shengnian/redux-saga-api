'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiFetch = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = crudSaga;

var _effects = require('redux-saga/effects');

var _actionTypes = require('./actionTypes');

var _marked = [garbageCollector].map(regeneratorRuntime.mark);
/* global Generator */

// TODO: The `Effect` type is not actually defined. Because 'redux-saga' does
// not use  annotations, flow pretends that this import succeeds.


// Generator type parameters are: Generator<+Yield,+Return,-Next>

var delay = function delay(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};

function garbageCollector() {
  return regeneratorRuntime.wrap(function garbageCollector$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.call)(delay, 10 * 60 * 1000);

        case 2:
          _context.next = 4;
          return (0, _effects.call)(delay, 5 * 60 * 1000);

        case 4:
          _context.next = 6;
          return (0, _effects.put)({ type: _actionTypes.GARBAGE_COLLECT, meta: { now: Date.now() } });

        case 6:
          _context.next = 2;
          break;

        case 8:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

var apiFetch = exports.apiFetch = function apiFetch(fetch) {
  return regeneratorRuntime.mark(function _apiFetch(action) {
    var _action$payload, method, path, params, data, fetchConfig, _action$meta, success, failure, meta, response;

    return regeneratorRuntime.wrap(function _apiFetch$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _action$payload = action.payload, method = _action$payload.method, path = _action$payload.path, params = _action$payload.params, data = _action$payload.data, fetchConfig = _action$payload.fetchConfig;
            _action$meta = action.meta, success = _action$meta.success, failure = _action$meta.failure;
            meta = _extends({}, action.meta, {
              fetchTime: Date.now()
            });
            _context2.prev = 3;
            _context2.next = 6;
            return (0, _effects.call)(fetch[method], path, { params: params, data: data, fetchConfig: fetchConfig });

          case 6:
            response = _context2.sent;
            _context2.next = 9;
            return (0, _effects.put)({ meta: meta, type: success, payload: response });

          case 9:
            _context2.next = 15;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](3);
            _context2.next = 15;
            return (0, _effects.put)({ meta: meta, type: failure, payload: _context2.t0, error: true });

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _apiFetch, this, [[3, 11]]);
  });
};

var watchFetch = function watchFetch(fetch) {
  return regeneratorRuntime.mark(function _watchFetch() {
    var action;
    return regeneratorRuntime.wrap(function _watchFetch$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!true) {
              _context3.next = 8;
              break;
            }

            _context3.next = 3;
            return (0, _effects.take)(_actionTypes.FETCH);

          case 3:
            action = _context3.sent;
            _context3.next = 6;
            return (0, _effects.fork)(apiFetch, fetch)(action);

          case 6:
            _context3.next = 0;
            break;

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _watchFetch, this);
  });
};

var watchFetchOne = function watchFetchOne(fetch) {
  return regeneratorRuntime.mark(function _watchFetchOne() {
    var action;
    return regeneratorRuntime.wrap(function _watchFetchOne$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!true) {
              _context4.next = 8;
              break;
            }

            _context4.next = 3;
            return (0, _effects.take)(_actionTypes.FETCH_ONE);

          case 3:
            action = _context4.sent;
            _context4.next = 6;
            return (0, _effects.fork)(apiFetch, fetch)(action);

          case 6:
            _context4.next = 0;
            break;

          case 8:
          case 'end':
            return _context4.stop();
        }
      }
    }, _watchFetchOne, this);
  });
};

var watchCreate = function watchCreate(fetch) {
  return regeneratorRuntime.mark(function _watchCreate() {
    var action;
    return regeneratorRuntime.wrap(function _watchCreate$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!true) {
              _context5.next = 8;
              break;
            }

            _context5.next = 3;
            return (0, _effects.take)(_actionTypes.CREATE);

          case 3:
            action = _context5.sent;
            _context5.next = 6;
            return (0, _effects.fork)(apiFetch, fetch)(action);

          case 6:
            _context5.next = 0;
            break;

          case 8:
          case 'end':
            return _context5.stop();
        }
      }
    }, _watchCreate, this);
  });
};

var watchUpdate = function watchUpdate(fetch) {
  return regeneratorRuntime.mark(function _watchUpdate() {
    var action;
    return regeneratorRuntime.wrap(function _watchUpdate$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (!true) {
              _context6.next = 8;
              break;
            }

            _context6.next = 3;
            return (0, _effects.take)(_actionTypes.UPDATE);

          case 3:
            action = _context6.sent;
            _context6.next = 6;
            return (0, _effects.fork)(apiFetch, fetch)(action);

          case 6:
            _context6.next = 0;
            break;

          case 8:
          case 'end':
            return _context6.stop();
        }
      }
    }, _watchUpdate, this);
  });
};

var watchDelete = function watchDelete(fetch) {
  return regeneratorRuntime.mark(function _watchDelete() {
    var action;
    return regeneratorRuntime.wrap(function _watchDelete$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (!true) {
              _context7.next = 8;
              break;
            }

            _context7.next = 3;
            return (0, _effects.take)(_actionTypes.DELETE);

          case 3:
            action = _context7.sent;
            _context7.next = 6;
            return (0, _effects.fork)(apiFetch, fetch)(action);

          case 6:
            _context7.next = 0;
            break;

          case 8:
          case 'end':
            return _context7.stop();
        }
      }
    }, _watchDelete, this);
  });
};

var watchApiCall = function watchApiCall(fetch) {
  return regeneratorRuntime.mark(function _watchApiCall() {
    var action;
    return regeneratorRuntime.wrap(function _watchApiCall$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (!true) {
              _context8.next = 8;
              break;
            }

            _context8.next = 3;
            return (0, _effects.take)(_actionTypes.API_CALL);

          case 3:
            action = _context8.sent;
            _context8.next = 6;
            return (0, _effects.fork)(apiFetch, fetch)(action);

          case 6:
            _context8.next = 0;
            break;

          case 8:
          case 'end':
            return _context8.stop();
        }
      }
    }, _watchApiCall, this);
  });
};

function crudSaga(apiClient) {
  return regeneratorRuntime.mark(function _crudSaga() {
    return regeneratorRuntime.wrap(function _crudSaga$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return (0, _effects.all)([(0, _effects.fork)(watchFetch(apiClient)), (0, _effects.fork)(watchFetchOne(apiClient)), (0, _effects.fork)(watchCreate(apiClient)), (0, _effects.fork)(watchUpdate(apiClient)), (0, _effects.fork)(watchDelete(apiClient)), (0, _effects.fork)(watchApiCall(apiClient)), (0, _effects.fork)(garbageCollector)]);

          case 2:
          case 'end':
            return _context9.stop();
        }
      }
    }, _crudSaga, this);
  });
}