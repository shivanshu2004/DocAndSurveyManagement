import React from "react";
import Navbar from "../Components/Navbar";
import "./AdminPanel.css";

const dummyUsers = [
  { id: 1, name: "John Doe", role: "User" },
  { id: 2, name: "Admin Smith", role: "Admin" },
  { id: 3, name: "Jane Roe", role: "User" },
];

const AdminPanel = () => {
  return (
    <>
      <Navbar />
      <div className="admin-container">
      <h2>⚙️ Admin Panel</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {dummyUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default AdminPanel;
