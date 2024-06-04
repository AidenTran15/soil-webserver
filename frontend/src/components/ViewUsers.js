import React from 'react';


const ViewUsers = () => {
    const userPrefix = 'user_';
    const users = Object.keys(localStorage)
        .filter(key => key.startsWith(userPrefix))
        .map(key => JSON.parse(localStorage.getItem(key)));

    // Log the name and password of each user to the console
    console.log("Users: ", users.map(user => ({ name: user.name, password: user.password })));

    return (
        <div>
            <h1>User List</h1>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>
                        Name: {user.name || 'No name provided'}, Password: {user.password}
                    </li>
                ))}
            </ul>
        </div>
    );
};
  
export default ViewUsers;
