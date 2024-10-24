import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, deleteItem, getTasksFromServer, updateItem } from '../Features/itemSlice';
import styles from './itemList.module.css';
import { AppDispatch, RootState } from '../app/store'

interface Item {
  id: number;
  name: string;
  age: number;
  phoneNumber: number;
  jobRole: string;
  email: string;
}

const ItemList: React.FC = () => {
  const { items, isLoading, error } = useSelector((state: RootState) => state.items);
  const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch for dispatch

  const [newItem, setNewItem] = useState<Item>({
    id: 0,
    name: '',
    age: 0,
    phoneNumber: 0,
    jobRole: '',
    email: '',
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatedItem, setUpdatedItem] = useState<Item | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getTasksFromServer());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (updatedItem) {
      setUpdatedItem({ ...updatedItem, [name]: value });
    }
  };

  const checkForDuplicates = (phoneNumber: number, email: string, id: number | null) => {
    return items.some(
      (item) => (item.phoneNumber === phoneNumber || item.email === email) && item.id !== id
    );
  };

  const handleAdd = () => {
    if (newItem.name && newItem.email && newItem.phoneNumber && newItem.age > 0 && newItem.jobRole) {
      if (checkForDuplicates(newItem.phoneNumber, newItem.email, null)) {
        setErrorMessage('Phone number or email already exists.');
      } else {
        dispatch(addItem({ ...newItem, id: Date.now(), isLoading: false, error: null }));
        setNewItem({
          id: 0,
          name: '',
          age: 0,
          phoneNumber: 0,
          jobRole: '',
          email: '',
        });
        setErrorMessage(null);
      }
    }
  };

  const handleUpdate = (id: number) => {
    if (updatedItem) {
      if (checkForDuplicates(updatedItem.phoneNumber, updatedItem.email, id)) {
        setErrorMessage('Phone number or email already exists.');
      } else {
        dispatch(updateItem({ ...updatedItem, id, isLoading: false, error: null }));
        setEditingId(null);
        setUpdatedItem(null);
        setErrorMessage(null);
      }
    }
  };

  const handleDelete = (id: number) => {
    dispatch(deleteItem(id));
  };

  return (
    <div className={styles.container}>
      <h2>User Information</h2>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      <div className={styles.inputGroup}>
        <input
          type="text"
          name="name"
          value={newItem.name}
          onChange={handleInputChange}
          placeholder="Name"
          className={styles.input}
        />
        <input
          type="number"
          name="age"
          value={newItem.age || ''}
          onChange={handleInputChange}
          placeholder="Age"
          className={styles.input}
        />
        <input
          type="text"
          name="phoneNumber"
          value={newItem.phoneNumber || ''}
          onChange={handleInputChange}
          placeholder="Phone Number"
          className={styles.input}
        />
        <input
          type="text"
          name="jobRole"
          value={newItem.jobRole}
          onChange={handleInputChange}
          placeholder="Job Role"
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          value={newItem.email}
          onChange={handleInputChange}
          placeholder="Email"
          className={styles.input}
        />
      </div>

      <button onClick={handleAdd} className={styles.addButton}>Add</button>

      {items.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Phone Number</th>
              <th>Job Role</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                {editingId === item.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={updatedItem?.name || ''}
                        onChange={handleEditInputChange}
                        className={styles.input}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="age"
                        value={updatedItem?.age || ''}
                        onChange={handleEditInputChange}
                        className={styles.input}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={updatedItem?.phoneNumber || ''}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="jobRole"
                        value={updatedItem?.jobRole || ''}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={updatedItem?.email || ''}
                        onChange={handleEditInputChange}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleUpdate(item.id)} className={styles.updateButton}>Save</button>
                      <button onClick={() => setEditingId(null)} className={styles.cancelButton}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.name}</td>
                    <td>{item.age}</td>
                    <td>{item.phoneNumber}</td>
                    <td>{item.jobRole}</td>
                    <td>{item.email}</td>
                    <td>
                      <button onClick={() => { setEditingId(item.id); setUpdatedItem(item); }} className={styles.editButton}>Edit</button>
                      <button onClick={() => handleDelete(item.id)} className={styles.deleteButton}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isLoading && <p>Loading...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}
    </div>
  );
};

export default ItemList;
