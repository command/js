import axios from "axios";

class Command {
  constructor(apiKey) {
    if (!apiKey) this._throwFormattedError("A valid API key is required.");
    this.apiKey = apiKey;

    this.customers = {
      login: this._loginCustomer.bind(this),
      create: this._createCustomer.bind(this),
      update: this._updateCustomer.bind(this),
      delete: this._deleteCustomer.bind(this)
    };
  }

  _throwFormattedError(error) {
    throw new Error(
      `[Command] ${error} See https://docs.oncommand.io/api/libraries#javascript for usage instructions.`
    );
  }

  _request(method, path, body = {}) {
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
    if (!key) throw new Error("Must pass a key to track.");

    const body = { key };
    if (properties) body.properties = properties;

    return this._request("post", "/behavior", body);
  }

  _loginCustomer(customerId) {
    if (!customerId) throw new Error("Must pass a customerId.");

    return this._request("put", `/customers/${customerId}`, {
      lastSeenAt: new Date().toISOString()
    });
  }

  _createCustomer(customer) {
    if (!customer) throw new Error("Must pass a customer.");

    return this._request("post", "/customers", {
      ...customer
    });
  }

  _updateCustomer(customerId, update) {
    if (!customerId) throw new Error("Must pass a customerId.");
    if (!update) throw new Error("Must pass an update for the customer.");

    return this._request("put", `/customers/${customerId}`, {
      ...update
    });
  }

  _deleteCustomer(customerId) {
    if (!customerId) throw new Error("Must pass a customerId.");
    return this._request("delete", `/customers/${customerId}`);
  }
}

export default Command;
