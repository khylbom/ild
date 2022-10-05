import axios, { AxiosRequestConfig } from "axios";
import MockAdapter from "axios-mock-adapter";

export type LoginValues = {
  username: string;
  password: string;
};

export type User = {
  username: string;
  email: string;
  name: string;
};

const instance = axios.create({
  baseURL: "/api"
});

export type Launch = {
  id: number;
  launchVehicle: string;
  country: string;
  family: string;
};

type LaunchResponse = Record<string, Record<string, Launch[]>>;

const mock = new MockAdapter(instance, {
  delayResponse: 2000
});

mock.onPost("/login").reply<User>((config: AxiosRequestConfig<LoginValues>) => {
  const { username, password } = config.data;
  if (username === "user" && password === "user") {
    return [
      200,
      {
        username,
        name: "User",
        email: "user@example.com"
      }
    ];
  }
  return [500];
});

mock.onGet("/launches").reply<Launch[]>(200, [
  { id: 1, country: "US", family: "Falcon 9", launchVehicle: "F9-1" },
  { id: 2, country: "US", family: "Atlas V", launchVehicle: "AV-1" },
  { id: 3, country: "CA", family: "Atlas V", launchVehicle: "AV-2" },
  { id: 4, country: "CA", family: "Falcon 9", launchVehicle: "F9-2" },
  { id: 5, country: "US", family: "Delta IV", launchVehicle: "DIV-1" },
  { id: 6, country: "RU", family: "Souez", launchVehicle: "SZ-1" }
]);

const fetchLaunches = () => instance.get<Launch[]>("/launches");
const login = (data: LoginValues) => instance.post<User>("/login", data);

export default {
  fetchLaunches,
  login
};
