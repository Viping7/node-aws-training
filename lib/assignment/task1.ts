import { getUsers } from "../common/placeholder";


export function main(){
    return getUsers().then(users=>{
        console.dir(users,{depth:null});
        return users;
    }).catch(e=>{
        console.error(`Error while calling method: ${e}`);
    }); 
}
