import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:8080/api/users')
      .then((response) => {
        setUsers(response.data);
        
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = (user) => {
    setEditUser(user);
    setFormData({ username: user.username, email: user.email });
  };

  const handleDelete = (user) => {
    axios
      .delete(`http://localhost:8080/api/users/${user._id}`)
      .then(() => {
        const updatedUsers = users.filter((u) => u._id !== user._id);
        setUsers(updatedUsers);
        alert('Deleted');
      })
      .catch((err) => {
        console.error(err);
        alert('Not Deleted');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editUser) {
      axios
        .put(`http://localhost:8080/api/users/${editUser._id}`, formData)
        .then((response) => {
          const updatedUsers = users.map((u) => (u._id === editUser._id ? response.data : u));
          setUsers(updatedUsers);
        })
        .catch((err) => {
          console.error(err);
        });
      setEditUser(null);
    } else {
      axios.post('http://localhost:8080/api/users', formData)
        .then((response) => {
          setUsers([...users, response.data]);
          alert('Saved');
        })
        .catch((err) => {
          console.error(err);
          alert('Not Saved');
        });
    }

    setFormData({ username: '', email: '' });
  };

  const handleSearch = () => {
    const results = users.filter(
      (user) => user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className='container mt-5'>
      <div className='row'>
        <div className='col-md-6'>
          <div className='mb-3'>
            <h1 className='mb-3'>Search Users</h1>
            <div className='input-group mb-3'>
              <input
                type='text'
                className='form-control'
                placeholder='Search by username'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className='btn btn-primary' onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <h1 className='mb-3'>User Form</h1>
            <div className='mb-3'>
              <label htmlFor='username' className='form-label'>Username</label>
              <input
                className='form-control'
                type='text'
                name='username'
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='email' className='form-label'>Email</label>
              <input
                className='form-control'
                type='text'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <button type='submit' className='btn btn-primary'>
              {editUser ? 'Update' : 'Submit'}
            </button>
          </form>
        </div>
        <div className='col-md-6'>
          <h1 className='mb-3'>User Details</h1>
          <table className='table'>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => handleUpdate(user)} className='btn btn-sm btn-primary mx-2'>
                      Update
                    </button>
                    <button onClick={() => handleDelete(user)} className='btn btn-sm btn-danger mx-2'>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <h1 className='mb-3'>Searched Results</h1>
            <table className='table'>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
