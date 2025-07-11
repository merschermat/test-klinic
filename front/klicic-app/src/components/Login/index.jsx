import React, { useState } from 'react';
import { userLogin } from '../../services';
import { useAppContext } from '../../contexts/AppContext';
const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const { login } = useAppContext()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const encodedData = new URLSearchParams();
        encodedData.append('username', formData.username);
        encodedData.append('password', formData.password);
        userLogin(encodedData).then(data => login(data))
        setFormData({ username: '', password: '' });
    };
    return (
        <div>
            <h2>Please login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="description">username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="description">password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="submit"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    )
}
export default Login 