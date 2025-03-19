import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "../common/constants";
import { User } from "../common/types";

interface UserResponse extends AxiosResponse {
  data: User[];
}

const getUsers = async (): Promise<User[]> => {
  try {
    const usersResponse: UserResponse = await axios.get(`${BASE_URL}/users`);
    const users = usersResponse.data;
    return users;
  } catch (e) {
    throw new Error(`Fetch users returned error:${e}`);
  }
};

function main(){
    getUsers().then(users=>{
        console.dir(users,{depth:null});
    }).catch(e=>{
        console.log(e);
    }); 
}
main();
