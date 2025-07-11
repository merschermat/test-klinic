import React, { useState } from 'react';
import { addToDoItem } from '../../services';
import { useAppContext } from '../../contexts/AppContext';
const AddItem = ({ todoId }) => {
    const [formData, setFormData] = useState({ description: '' });
    const { authUser, updateToDos } = useAppContext()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addToDoItem(authUser, todoId, formData).then(data => updateToDos())
        setFormData({ description: '' });
    };
    return (
        <div style={{ display: "inline-block" }}>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="submit"
                    >
                        Add Item
                    </button>
                </div>
            </form>
        </div>
    )
}
export default AddItem 