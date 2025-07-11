import React, { useState } from 'react';
import { deleteToDoItem, editToDoItem } from '../../../services';
import { useAppContext } from '../../../contexts/AppContext';

const ItemCard = ({ todoId, item }) => {
    const { authUser, updateToDos } = useAppContext()

    const [editing, setEditing] = useState(false)
    const [description, setDescription] = useState('')
    const handleRemoveItem = (todoId, itemID) => {
        deleteToDoItem(authUser, todoId, itemID).then(data => updateToDos())
    }
    const handleEditItem = (item) => {
        setEditing(true)
        setDescription(item.description)
    }
    const handleNameChange = (e) => {
        setDescription(e.target.value)
    }
    const handleCancel = () => {
        setDescription('')
        setEditing(false)
    }
    const handleSave = (item) => {
        item.description = description
        editToDoItem(authUser, todoId, item).then(data => updateToDos())
        setEditing(false)
    }
    return (
        <li key={item.id} style={{ height: '32px' }}>
            <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
                {/*Could share a component with the other 'card' component for editing :/ */}
                {editing && <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                    <input
                        type="text"
                        name="description"
                        value={description}
                        onChange={handleNameChange}
                        required
                    />
                    <button onClick={() => handleSave(item)}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>

                </div>}
                {!editing && <p style={{ display: "inline-block" }}>{item.description}</p>}
                <div>
                    <button onClick={() => handleRemoveItem(todoId, item.id)}>Remove</button>
                    <button onClick={() => handleEditItem(item)}>Edit</button>
                </div>
            </div>
        </li>
    )
}

export default ItemCard 