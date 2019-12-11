"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Command = function () {
  function Command(apiKey, options) {
    _classCallCheck(this, Command);

    if (!apiKey) this.throwFormattedError("");
    this._validateOptions();
  }

  _createClass(Command, [{
    key: "throwFormattedError",
    value: function throwFormattedError(error) {
      throw new Error("[Command] " + error + " See https://docs.oncommand.io/api/libraries#javascript for detailed usage instructions.");
    }
  }, {
    key: "_validateBehaviorKey",
    value: function _validateBehaviorKey(behaviorKey) {
      var requiredFormatRegex = new RegExp(/[^_\W]+:[^_\W]+/g);
      var matchedRequiredFormat = requiredFormatRegex.test(behaviorKey);

      if (!matchedRequiredFormat) {
        this.throwFormattedError(behaviorKey + " does not match the required format featureKey:behaviorKey.");
      }
    }
  }, {
    key: "track",
    value: function track(behaviorKey) {
      // command.track();
      // command.customers.create()

      this._validateBehaviorKey(behaviorKey);
    }
  }]);

  return Command;
}();

exports.default = Command;