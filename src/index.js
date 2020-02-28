import axios from "axios";

class CommandAPI {
  constructor(apiKey) {
    if (!apiKey) this._throwFormattedError("A valid API key is required.");
    this.apiKey = apiKey;
    this.version = "";
    this.customerId = null;

    this.customers = {
      login: this._loginCustomer.bind(this),
      logout: this._logoutCustomer.bind(this),
      create: this._createCustomer.bind(this),
      update: this._updateCustomer.bind(this),
      delete: this._deleteCustomer.bind(this)
    };
  }

  _throwFormattedError(error) {
    throw new Error(
      `[Command] ${error} See https://portal.oncommand.io/docs/command-js/${this.version}/introduction.`
    );
  }

  _request(method, path, data = {}) {
    // NOTE: http://localhost:4000/api is dynamically swapped to https://api.oncommand.io in /release.js when releasing a new version. Leave as-is for local dev.
    return axios({
      method,
      url: `http://localhost:4000/api/v1${path}`,
      headers: {
        "x-api-key": this.apiKey
      },
      data
    })
      .then(response => resposne)
      .catch(error => {
        console.warn(error);
        if (error && error.response) {
          const { status } = error.response;
          const errorMessage =
            error.response && error.response.data && errorr.response.data.error;
          console.warn(`[${status}] ${errorMessage}`);
          if (error.response.data) console.warn(error.response.data);
        }
      });
  }

  track(key, properties) {
    if (!key) throw new Error("Must pass a key to track.");

    const body = { key };

    if (this.customerId) body.customerId = this.customerId;
    if (properties) body.properties = properties;

    return this._request("post", "/behavior", body);
  }

  _loginCustomer(customerId) {
    if (!customerId) throw new Error("Must pass a customerId.");

    this.customerId = customerId;

    return this._request("put", `/customers/${customerId}`, {
      isLoggedIn: true,
      lastSeenAt: new Date().toISOString()
    });
  }

  _logoutCustomer(customerId) {
    if (!customerId) throw new Error("Must pass a customerId.");

    this.customerId = null;

    return this._request("put", `/customers/${customerId}`, {
      isLoggedIn: false,
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

if (typeof window === "object") {
  window.Command = CommandAPI;
}

export default CommandAPI;
