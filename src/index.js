import axios from "axios";

class Command {
  constructor(apiKey, options) {
    if (!apiKey) this.throwFormattedError("");
    this._validateOptions(options);
  }

  _validateBehaviorKey(behaviorKey) {
    const requiredFormatRegex = new RegExp(/[^_\W]+:[^_\W]+/g);
    const matchedRequiredFormat = requiredFormatRegex.test(behaviorKey);

    if (!matchedRequiredFormat) {
      this.throwFormattedError(
        `${behaviorKey} does not match the required format featureKey:behaviorKey.`
      );
    }
  }

  _validateTrackProperties(properties) {
    if (!properties) return;
    if (properties && typeof properties !== "object") {
      this.throwFormattedError(
        "Properties argument passed to command.track must be an object."
      );
    }
  }

  _throwFormattedError(error) {
    throw new Error(
      `[Command] ${error} See https://docs.oncommand.io/api/libraries#javascript for detailed usage instructions.`
    );
  }

  _request() {
    axios({
      method: "post",
      url: "http://localhost:4000/api/v1"
    });
  }

  track(behaviorKey, properties) {
    this._validateBehaviorKey(behaviorKey);
    this._validateTrackProperties(properties);
  }

  _createCustomer() {
    this.request("");
  }

  _updateCustomer() {}

  _deleteCustomer() {}

  static customers = {
    create: this._createCustomer,
    update: this._updateCustomer,
    delete: this._updateCustomer
  };
}

export default Command;
