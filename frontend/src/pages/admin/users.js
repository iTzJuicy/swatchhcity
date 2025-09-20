import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/common/admin/AdminLayout"; 
import "../../styles/pages/users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [editingUser, setEditingUser] = useState(null);

  // ✅ Sidebar menu items
  const menuItems = [
    { id: 1, title: "Dashboard", path: "/admin/dashboard", icon: "fas fa-tachometer-alt" },
    { id: 2, title: "Complaints", path: "/admin/complaints", icon: "fas fa-flag" },
    { id: 3, title: "Recycling Opportunities", path: "/admin/dealer-listings", icon: "fas fa-store" },
    { id: 4, title: "Users", path: "/admin/users", icon: "fas fa-users" },
    { id: 5, title: "Rewards", path: "/admin/rewards", icon: "fas fa-gift" },
    { id: 6, title: "Reports", path: "/admin/reports", icon: "fas fa-file-alt" },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token"); 
      const res = await fetch("http://localhost:5000/api/users/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);

      const data = await res.json();

      const mappedUsers = data.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role === "citizen" ? "Citizen" : u.role === "admin" ? "Admin" : u.role,
        status: "active", // backend doesn’t have a status yet
        joinDate: u.createdAt,
        complaints: 0, // backend doesn’t provide complaints count yet
        points: u.points ?? 0,
        lastActive: u.updatedAt,
        avatar: u.name ? u.name.split(" ").map((w) => w[0]).join("").toUpperCase() : "U",
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig.key) return users;
    return [...users].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [users, sortConfig]);

  const filteredUsers = sortedUsers.filter((user) => {
    const matchesFilter = filter === "all" || user.status === filter;
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map((user) => user.id));
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Citizen": return "fas fa-user";
      case "Dealer": return "fas fa-store";
      case "Municipal Worker": return "fas fa-hard-hat";
      default: return "fas fa-user";
    }
  };

  const handleEditUser = (user) => setEditingUser(user);
  const handleSaveEdit = () => setEditingUser(null);

  const handleDeleteUsers = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
    }
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)));
  };

  if (loading) {
    return (
      <AdminLayout menuItems={menuItems}>
        <div className="users-container">
          <div className="loading-container">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout menuItems={menuItems}>
      <div className="users-container">
        {/* Header */}
        <div className="users-header">
          <div className="header-content">
            <h2>Users Management</h2>
            <p>Manage and monitor all platform users and their activities</p>
          </div>
          <button onClick={fetchUsers} className="refresh-btn">
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="users-statistics">
          <div className="stat-card">
            <div className="stat-icon total"><i className="fas fa-users"></i></div>
            <div className="stat-content"><h3>{users.length}</h3><p>Total Users</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active"><i className="fas fa-check-circle"></i></div>
            <div className="stat-content"><h3>{users.filter((u) => u.status === "active").length}</h3><p>Active Users</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon citizen"><i className="fas fa-user"></i></div>
            <div className="stat-content"><h3>{users.filter((u) => u.role === "Citizen").length}</h3><p>Citizens</p></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon dealer"><i className="fas fa-store"></i></div>
            <div className="stat-content"><h3>{users.filter((u) => u.role === "Dealer").length}</h3><p>Dealers</p></div>
          </div>
        </div>

        {/* Controls */}
        <div className="users-controls">
          <div className="search-box"><i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="controls-right">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            {selectedUsers.length > 0 && (
              <button onClick={handleDeleteUsers} className="delete-btn">
                <i className="fas fa-trash"></i> Delete Selected ({selectedUsers.length})
              </button>
            )}
            <button className="add-user-btn"><i className="fas fa-user-plus"></i> Add User</button>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th onClick={() => handleSort("name")}>
                  User {sortConfig.key === "name" && (<i className={`fas fa-arrow-${sortConfig.direction === "ascending" ? "up" : "down"}`}></i>)}
                </th>
                <th>Role</th>
                <th onClick={() => handleSort("status")}>
                  Status {sortConfig.key === "status" && (<i className={`fas fa-arrow-${sortConfig.direction === "ascending" ? "up" : "down"}`}></i>)}
                </th>
                <th onClick={() => handleSort("joinDate")}>
                  Join Date {sortConfig.key === "joinDate" && (<i className={`fas fa-arrow-${sortConfig.direction === "ascending" ? "up" : "down"}`}></i>)}
                </th>
                <th onClick={() => handleSort("complaints")}>
                  Complaints {sortConfig.key === "complaints" && (<i className={`fas fa-arrow-${sortConfig.direction === "ascending" ? "up" : "down"}`}></i>)}
                </th>
                <th onClick={() => handleSort("points")}>
                  Points {sortConfig.key === "points" && (<i className={`fas fa-arrow-${sortConfig.direction === "ascending" ? "up" : "down"}`}></i>)}
                </th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-state">
                    <i className="fas fa-users"></i>
                    <p>No users found</p>
                    <span>Try adjusting your search or filters</span>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user.id} className={selectedUsers.includes(user.id) ? "selected" : ""}>
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </td>
                    <td className="user-cell">
                      <div className="user-avatar">{user.avatar}</div>
                      <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </td>
                    <td><span className="role-badge"><i className={getRoleIcon(user.role)}></i>{user.role}</span></td>
                    <td>
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        className={`status-select ${user.status}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                    <td><span className="complaints-count">{user.complaints}</span></td>
                    <td><span className="points-badge"><i className="fas fa-star"></i>{user.points}</span></td>
                    <td>{new Date(user.lastActive).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleEditUser(user)} className="edit-btn" title="Edit User"><i className="fas fa-edit"></i></button>
                        <button className="view-btn" title="View Profile"><i className="fas fa-eye"></i></button>
                        <button className="email-btn" title="Send Email"><i className="fas fa-envelope"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="pagination-btn"><i className="fas fa-chevron-left"></i></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`pagination-btn ${currentPage === page ? "active" : ""}`}>{page}</button>
            ))}
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="pagination-btn"><i className="fas fa-chevron-right"></i></button>
          </div>
        )}

        {/* Edit Modal */}
        {editingUser && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Edit User</h3>
              <div className="modal-actions">
                <button onClick={() => setEditingUser(null)} className="cancel-btn">Cancel</button>
                <button onClick={handleSaveEdit} className="save-btn">Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Users;
