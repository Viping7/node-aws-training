import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "./constants";
import { Todo, User } from "./types";

interface UserResponse extends AxiosResponse {
    data: User[] | Todo[];
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const usersResponse: UserResponse = await axios.get(`${BASE_URL}/users`);
    const users = usersResponse.data as User[];
    return users;
  } catch (e) {
    throw new Error(`Fetch users returned error:${e}`);
  }
};

export const getTodos = async (): Promise<Todo[]> => {
  try {
    const usersResponse: UserResponse = await axios.get(`${BASE_URL}/todos`);
    const users = usersResponse.data as Todo[];
    return users;
  } catch (e) {
    throw new Error(`Fetch todos returned error:${e}`);
  }
};
