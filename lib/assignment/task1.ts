import { getUsers } from "../common/placeholder";


function main(){
    getUsers().then(users=>{
        console.dir(users,{depth:null});
    }).catch(e=>{
        console.log(e);
    }); 
}
main();
