import React, { useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import AddToDo from '../AddToDo';
import ToDoCard from './ToDoCard';
const ToDoList = () => {
    const { todos, updateToDos } = useAppContext()

    //first call for the API to initialize the 'todos'
    useEffect(() => {
        updateToDos()
    }, [])

    //this component is just a container to keep the editing logic simple(each <ToDoCard/> handle its own editing status)
    return (
        <div style={{ textAlign: "left" }}>
            <AddToDo />
            <div>
                <ul>
                    {todos && todos.map(i =>
                        <ToDoCard todo={i} />
                    )}
                </ul>
            </div>
        </div>
    )

}

export default ToDoList 