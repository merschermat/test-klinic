import React, { useState } from 'react';
import { createToDo } from '../../services';
import { useAppContext } from '../../contexts/AppContext';
const AddToDo = () => {
    const [formData, setFormData] = useState({ name: '' });
    const { authUser, updateToDos } = useAppContext()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createToDo(authUser, formData).then(data => updateToDos())
        setFormData({ name: '' });
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <h2 htmlFor="name">Add ToDo list</h2>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="submit"
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    )
}
export default AddToDo 