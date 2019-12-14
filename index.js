"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Command =
/*#__PURE__*/
function () {
  function Command(apiKey) {
    _classCallCheck(this, Command);

    if (!apiKey) this.throwFormattedError("A valid API key is required.");
    this.apiKey = apiKey;
  }

  _createClass(Command, [{
    key: "_throwFormattedError",
    value: function _throwFormattedError(error) {
      throw new Error("[Command] ".concat(error, " See https://docs.oncommand.io/api/libraries#javascript for usage instructions."));
    }
  }, {
    key: "_request",
    value: function _request(method, path, body) {
      (0, _axios["default"])({
        method: method,
        url: "http://localhost:4000/api/v1".concat(path),
        headers: {
          "x-api-key": this.apiKey
        },
        body: body
      });
    }
  }, {
    key: "track",
    value: function track(key, properties) {
      return this._request("post", "/behavior", {
        key: key,
        properties: properties
      });
    }
  }, {
    key: "_createCustomer",
    value: function _createCustomer(customer) {
      return this._request("post", "/customers", _objectSpread({}, customer));
    }
  }, {
    key: "_updateCustomer",
    value: function _updateCustomer(customer) {
      return this._request("put", "/customers/".concat(customer._id), _objectSpread({}, customer));
    }
  }, {
    key: "_deleteCustomer",
    value: function _deleteCustomer(customerId) {
      return this._request("delete", "/customers/".concat(customerId));
    }
  }]);

  return Command;
}();

_defineProperty(Command, "customers", {
  create: Command._createCustomer,
  update: Command._updateCustomer,
  "delete": Command._updateCustomer
});

var _default = Command;
exports["default"] = _default;