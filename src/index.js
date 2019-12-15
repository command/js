import axios from "axios";

class Command {
  constructor(apiKey) {
    if (!apiKey) this.throwFormattedError("A valid API key is required.");
    this.apiKey = apiKey;
  }

  _throwFormattedError(error) {
    throw new Error(
      `[Command] ${error} See https://docs.oncommand.io/api/libraries#javascript for usage instructions.`
    );
  }

  _request(method, path, body) {
    axios({
      method,
      url: `http://localhost:4000/api/v1${path}`,
      headers: {
        "x-api-key": this.apiKey
      },
      body
    });
  }

  track(key, properties) {
    return this._request("post", "/behavior", {
      key,
      properties
    });
  }

  _loginCustomer(customerId) {
    return this._request("put", `/customers/${customerId}`, {
      lastSeenAt: new Date().toISOString()
    });
  }

  _createCustomer(customer) {
    return this._request("post", "/customers", {
      ...customer
    });
  }

  _updateCustomer(customerId, update) {
    return this._request("put", `/customers/${customerId}`, {
      ...update
    });
  }

  _deleteCustomer(customerId) {
    return this._request("delete", `/customers/${customerId}`);
  }

  static customers = {
    login: this._loginCustomer,
    create: this._createCustomer,
    update: this._updateCustomer,
    delete: this._updateCustomer
  };
}

export default Command;
