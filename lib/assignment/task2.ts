import { getTodos, getUsers } from "../common/placeholder"


const getUsersAndTodos = async ()=>{
    const [users,todos] = await Promise.all([getUsers(),getTodos()]);
    return {
        users: users,
        todos: todos
    }
}


function main(){
    getUsersAndTodos().then(getResp=>{
        console.log("Users");
        console.dir(getResp.users,{depth:null});
        console.log("---------------------------");
        console.log("Todos");
        console.dir(getResp.todos,{depth:null});
    })
}

main();