import axios from "axios";
import { main } from "../../lib/assignment/task1";
import { BASE_URL } from "../../lib/common/constants";

jest.mock("axios");

describe("Main function", function () {
  const mockData = [
    {
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz",
      address: {
        street: "Kulas Light",
        suite: "Apt. 556",
        city: "Gwenborough",
        zipcode: "92998-3874",
        geo: {
          lat: "-37.3159",
          lng: "81.1496",
        },
      },
      phone: "1-770-736-8031 x56442",
      website: "hildegard.org",
      company: {
        name: "Romaguera-Crona",
        catchPhrase: "Multi-layered client-server neural-net",
        bs: "harness real-time e-markets",
      },
    },
    {
      id: 2,
      name: "Ervin Howell",
      username: "Antonette",
      email: "Shanna@melissa.tv",
      address: {
        street: "Victor Plains",
        suite: "Suite 879",
        city: "Wisokyburgh",
        zipcode: "90566-7771",
        geo: {
          lat: "-43.9509",
          lng: "-34.4618",
        },
      },
      phone: "010-692-6593 x09125",
      website: "anastasia.net",
      company: {
        name: "Deckow-Crist",
        catchPhrase: "Proactive didactic contingency",
        bs: "synergize scalable supply-chains",
      },
    },
  ];
  it("exists and can be called", async function () {
    expect(main).toBeDefined();
    expect(typeof main).toBe("function");
  });
  it("getUsers are called with correct url", async function () {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });
    await main();
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/users`);
  });
  
  it("returns list of users", async function () {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });
    const result = await main();
    expect(result).toEqual(mockData);
  });

  it("logs error if something goes wrong", async function () {
    (axios.get as jest.Mock).mockRejectedValue("Something went wrong");
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    const result = await main();
    expect(consoleErrorMock).toHaveBeenCalledWith(expect.stringContaining('Error while calling method'));
  });
 
});
