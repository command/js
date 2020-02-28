const Command = require("./index").default;
const axios = require("axios");

jest.mock("axios");

describe("index.js", () => {
  beforeEach(() => {
    axios.mockReset();
    axios.mockImplementation(() => Promise.resolve());

    // NOTE: Mock global Date constructor so all dates match in test.
    global.Date = jest.fn(() => ({
      toISOString: jest.fn(() => "2019-12-15T00:00:00.000Z")
    }));
  });

  test("it creates an instance with the api key", () => {
    const command = new Command("apiKey123");
    expect(command.apiKey).toBe("apiKey123");
  });

  test("it throws an error if api key is not passed", () => {
    expect(() => {
      const command = new Command();
    }).toThrow("A valid API key is required.");
  });

  test("it can track an event", () => {
    const command = new Command("apiKey123");
    command.track("an event");
    expect(axios).toHaveBeenCalledWith({
      method: "post",
      url: `http://localhost:4000/api/v1/behavior`,
      headers: {
        "x-api-key": "apiKey123"
      },
      body: {
        key: "an event"
      }
    });
  });

  test("it throws an error if no key is passed to track", () => {
    expect(() => {
      const command = new Command("apiKey123");
      command.track();
    }).toThrow("Must pass a key to track.");
  });

  test("it can track a customer login", () => {
    const command = new Command("apiKey123");
    command.customers.login("1234");
    expect(axios).toHaveBeenCalledWith({
      method: "put",
      url: `http://localhost:4000/api/v1/customers/1234`,
      headers: {
        "x-api-key": "apiKey123"
      },
      body: {
        isLoggedIn: true,
        lastSeenAt: "2019-12-15T00:00:00.000Z"
      }
    });
  });

  test("it throws an error if no customerId is passed to customers.login", () => {
    expect(() => {
      const command = new Command("apiKey123");
      command.customers.login();
    }).toThrow("Must pass a customerId.");
  });

  test("it can track a customer logout", () => {
    const command = new Command("apiKey123");
    command.customers.logout("1234");
    expect(axios).toHaveBeenCalledWith({
      method: "put",
      url: `http://localhost:4000/api/v1/customers/1234`,
      headers: {
        "x-api-key": "apiKey123"
      },
      body: {
        isLoggedIn: false,
        lastSeenAt: "2019-12-15T00:00:00.000Z"
      }
    });
  });

  test("it throws an error if no customerId is passed to customers.logout", () => {
    expect(() => {
      const command = new Command("apiKey123");
      command.customers.logout();
    }).toThrow("Must pass a customerId.");
  });

  test("it can create a customer", () => {
    const command = new Command("apiKey123");
    command.customers.create({ emailAddress: "test@test.com" });
    expect(axios).toHaveBeenCalledWith({
      method: "post",
      url: `http://localhost:4000/api/v1/customers`,
      headers: {
        "x-api-key": "apiKey123"
      },
      body: {
        emailAddress: "test@test.com"
      }
    });
  });

  test("it throws an error if no customer is passed to customers.create", () => {
    expect(() => {
      const command = new Command("apiKey123");
      command.customers.create();
    }).toThrow("Must pass a customer.");
  });

  test("it can update a customer", () => {
    const command = new Command("apiKey123");
    command.customers.update("customerId123", {
      emailAddress: "test1@test.com"
    });
    expect(axios).toHaveBeenCalledWith({
      method: "put",
      url: `http://localhost:4000/api/v1/customers/customerId123`,
      headers: {
        "x-api-key": "apiKey123"
      },
      body: {
        emailAddress: "test1@test.com"
      }
    });
  });

  test("it throws an error if no customerId is passed to customers.update", () => {
    expect(() => {
      const command = new Command("apiKey123");
      command.customers.update();
    }).toThrow("Must pass a customerId.");
  });

  test("it throws an error if no update is passed to customers.update", () => {
    expect(() => {
      const command = new Command("apiKey123");
      command.customers.update("customerId123");
    }).toThrow("Must pass an update for the customer.");
  });

  test("it can delete a customer", () => {
    const command = new Command("apiKey123");
    command.customers.delete("customerId123");
    expect(axios).toHaveBeenCalledWith({
      method: "delete",
      url: `http://localhost:4000/api/v1/customers/customerId123`,
      headers: {
        "x-api-key": "apiKey123"
      },
      body: {}
    });
  });

  test("it throws an error if no customerId is passed to customers.delete", () => {
    expect(() => {
      const command = new Command("apiKey123");
      command.customers.delete();
    }).toThrow("Must pass a customerId.");
  });
});
