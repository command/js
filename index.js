"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CommandAPI =
/*#__PURE__*/
function () {
  function CommandAPI(apiKey) {
    var customerId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, CommandAPI);

    if (!apiKey) this._throwFormattedError("A valid API key is required.");
    this.apiKey = apiKey;
    this.version = "";
    this.customerId = customerId; // NOTE: Enables manually passing a customerId in server environments.

    this.customers = {
      login: this._loginCustomer.bind(this),
      logout: this._logoutCustomer.bind(this),
      create: this._createCustomer.bind(this),
      update: this._updateCustomer.bind(this),
      "delete": this._deleteCustomer.bind(this)
    };
  }

  _createClass(CommandAPI, [{
    key: "_throwFormattedError",
    value: function _throwFormattedError(error) {
      throw new Error("[Command] ".concat(error, " See https://portal.oncommand.io/docs/command-js/").concat(this.version, "/introduction."));
    }
  }, {
    key: "_request",
    value: function _request(method, path) {
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      // NOTE: http://localhost:4000/api is dynamically swapped to https://api.oncommand.io in /release.js when releasing a new version. Leave as-is for local dev.
      console.log({
        method: method,
        url: "http://localhost:4000/api/v1".concat(path),
        headers: {
          "x-api-key": this.apiKey
        },
        data: data
      });
      return (0, _axios["default"])({
        method: method,
        url: "http://localhost:4000/api/v1".concat(path),
        headers: {
          "x-api-key": this.apiKey
        },
        data: data
      }).then(function (response) {
        if (callbak) callback(response);
        return response;
      })["catch"](function (error) {
        if (error && error.response) {
          var status = error.response.status;
          var errorMessage = error.response && error.response.data && error.response.data && error.response.data.data && error.response.data.data.error;
          console.warn("[".concat(status, "] ").concat(errorMessage));

          if (error.response.data) {
            console.warn(error.response.data);
          }

          if (error.response.data && error.response.data.data) {
            console.warn(error.response.data.data.error);
            console.warn(error.response.data.data.validationErrors);
          }
        }
      });
    }
  }, {
    key: "track",
    value: function track(key, properties) {
      if (!key) throw new Error("Must pass a key to track.");
      var body = {
        key: key
      };
      if (this.customerId) body.customerId = this.customerId;
      if (properties) body.properties = properties;
      return this._request("post", "/behavior", body);
    }
  }, {
    key: "_loginCustomer",
    value: function _loginCustomer(customerId) {
      if (!customerId) throw new Error("Must pass a customerId.");
      this.customerId = customerId;
      return this._request("put", "/customers/login", {
        customerId: customerId
      });
    }
  }, {
    key: "_logoutCustomer",
    value: function _logoutCustomer() {
      var _this = this;

      if (!this.customerId) throw new Error("Must have a customerId to logout.");
      return this._request("put", "/customers/logout", {
        customerId: this.customerId
      }, function () {
        _this.customerId = null;
      });
    }
  }, {
    key: "_createCustomer",
    value: function _createCustomer(customer) {
      if (!customer) throw new Error("Must pass a customer.");
      return this._request("post", "/customers", _objectSpread({}, customer));
    }
  }, {
    key: "_updateCustomer",
    value: function _updateCustomer(customerId, update) {
      if (!customerId) throw new Error("Must pass a customerId.");
      if (!update) throw new Error("Must pass an update for the customer.");
      return this._request("put", "/customers/".concat(customerId), _objectSpread({}, update));
    }
  }, {
    key: "_deleteCustomer",
    value: function _deleteCustomer(customerId) {
      if (!customerId) throw new Error("Must pass a customerId.");
      return this._request("delete", "/customers/".concat(customerId));
    }
  }]);

  return CommandAPI;
}();

if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") {
  window.Command = CommandAPI;
}

var _default = CommandAPI;
exports["default"] = _default;