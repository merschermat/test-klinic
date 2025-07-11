import React, { useState } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { deleteToDo, editToDo } from '../../../services';
import ItemCard from '../ItemCard';
import AddItem from '../../AddItem';
const ToDoCard = ({ todo }) => {
    const { authUser, updateToDos } = useAppContext()

    const [editing, setEditing] = useState(false)
    const [name, setName] = useState('');
    const handleRemoveToDo = (id) => {
        deleteToDo(authUser, id).then(data => updateToDos())
    }

    const handleEditToDo = (todo) => {
        setEditing(true)
        setName(todo.name)
    }
    const handleNameChange = (e) => {
        setName(e.target.value)
    }
    const handleCancel = () => {
        setName('')
        setEditing(false)
    }
    const handleSave = (todo) => {
        todo.name = name
        editToDo(authUser, todo).then(data => updateToDos())
        setEditing(false)
    }
    return (
        <li key={todo.id} style={{ marginBottom: '16px' }} >
            <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', height: '40px' }}>
                {/*Editing could be extracted to a reusable component, to make code more clean, but I'm low on time ATM, sorry :/ */}
                {editing && <div>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleNameChange}
                        required
                    />
                    <button onClick={() => handleSave(todo)}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>

                </div>
                }
                {!editing && <h3 style={{ display: "inline-block" }}>{todo.name}</h3>}
                <div>
                    <AddItem todoId={todo.id} />
                    <button onClick={() => handleRemoveToDo(todo.id)}>Remove</button>
                    <button onClick={() => handleEditToDo(todo)}>Edit</button>
                </div>
            </div>
            <ul>
                {todo.items.map(j =>
                    <ItemCard item={j} todoId={todo.id} />)}
            </ul>
        </li>
    )
}

export default ToDoCard 