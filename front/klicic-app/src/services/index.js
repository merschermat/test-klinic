//All the API calls are made in here, not too optmized, could be better using axios and middlwares 
//Services could be divided in different files by the endpoint they provide (ToDo/Item)
//There's a lot of copy/paste here, could be cleaned up with more time
const userLogin = (user) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: user
    };
    return fetch('http://localhost:8000/token', requestOptions)
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}

const getUserToDos = async (authUser) => {
    let data = []
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authUser.token },
    };
    try {
        const response = await fetch(`http://localhost:8000/userTodos/${authUser.userId}`, requestOptions)
        const todos = await response.json()
        if (response.status === 200) {
            data = todos
        }
    } catch (error) {
        console.error("Something went wrong while getting the data:", error);
    }
    return data
}

const createToDo = (authUser, todo) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authUser.token },
        body: JSON.stringify({ user_id: authUser.userId, ...todo })
    };
    return fetch('http://localhost:8000/todo', requestOptions)
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}

const editToDo = (authUser, todo) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authUser.token },
        body: JSON.stringify(todo)
    };
    return fetch(`http://localhost:8000/todo/${todo.id}`, requestOptions)
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}

const deleteToDo = (authUser, todoId) => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authUser.token },
    };
    return fetch(`http://localhost:8000/todo/${todoId}`, requestOptions)
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}

const addToDoItem = (authUser, todoId, body) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authUser.token },
        body: JSON.stringify(body)
    };
    return fetch(`http://localhost:8000/todoItem/${todoId}`, requestOptions)
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}

const editToDoItem = (authUser, todoId, body) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authUser.token },
        body: JSON.stringify({ ...body })
    };
    return fetch(`http://localhost:8000/todoItem/${todoId}/${body.id}`, requestOptions)
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}

const deleteToDoItem = (authUser, todoId, itemId) => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authUser.token },
    };
    return fetch(`http://localhost:8000/todoItem/${todoId}/${itemId}`, requestOptions)
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}

export { userLogin, createToDo, getUserToDos, addToDoItem, deleteToDo, deleteToDoItem, editToDoItem, editToDo }