import React, { createContext, useContext, useState } from 'react';
import Login from '../components/Login';
import { getUserToDos } from '../services';
const AppContext = createContext();

//I created this provider to share login status and todo data with all components, could also be done by prop drilling 
//I opted for this since redux is to complex for this project, Context also reduces problems with props for new components
export const AppProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState({ userId: '', token: '' });
    const [todos, setTodos] = useState([]);

    //this function is called after all API calls to refresh data and make sure data is up to date
    const updateToDos = () => getUserToDos(authUser).then(data => setTodos(data));

    //Auth User could be retrieved from cache, or local storage in production build to prevent logout when page is reloaded
    //But for quick testing and due to not having a logout button I opted to use it this way, the page shouldn't reload too
    const login = (user) => {
        setAuthUser({ userId: user.user_id, token: user.access_token })
    };

    return (
        //Simple login control, unless the user is logged in, he cannot access protected components
        //Should be done with react router for bigger projects and proper route access control
        <AppContext.Provider value={{ authUser, todos, login, updateToDos }}>
            {!authUser.userId && <Login />}
            {authUser.userId !== '' && children}
        </AppContext.Provider>
    );
};
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within a AppProvider');
    }
    return context;
};