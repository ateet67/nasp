import { useEffect } from "react";
import Sidebar from "./Sidebar";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useGetUsersQuery, useDeleteUserMutation } from "../store/api/apiSlice";
import {
  setCurrentPage,
  setPageSize,
  setSearchTerm,
  setSelectedUser,
  showDeleteModal,
  hideDeleteModal,
  removeUser,
  setError,
} from "../store/slices/userSlice";
import {
  selectUsers,
  selectTotalUsers,
  selectCurrentPage,
  selectPageSize,
  selectSearchTerm,
  selectSelectedUser,
  selectShowDeleteModal,
  selectUserError,
} from "../store/slices/userSlice";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  regionId?: string;
  schoolId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserManagement() {
  const dispatch = useAppDispatch();

  // Redux state
  const users = useAppSelector(selectUsers);
  const totalUsers = useAppSelector(selectTotalUsers);
  const currentPage = useAppSelector(selectCurrentPage);
  const pageSize = useAppSelector(selectPageSize);
  const searchTerm = useAppSelector(selectSearchTerm);
  const selectedUser = useAppSelector(selectSelectedUser);
  const showDeleteModal = useAppSelector(selectShowDeleteModal);
  const error = useAppSelector(selectUserError);

  // RTK Query hooks
  const {
    data: usersData,
    isLoading,
    error: queryError,
  } = useGetUsersQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
  });

  const [deleteUserMutation, { isLoading: isDeleting }] =
    useDeleteUserMutation();

  // Update Redux state when API data changes
  useEffect(() => {
    if (usersData) {
      // The RTK Query automatically handles the data, but we can dispatch actions if needed
      if (queryError) {
        dispatch(setError("Failed to fetch users"));
      } else {
        dispatch(setError(null));
      }
    }
  }, [usersData, queryError, dispatch]);

  // Users are already filtered by the API based on searchTerm
  const filteredUsers = usersData?.items || [];

  const handleDeleteUser = (user: User) => {
    dispatch(setSelectedUser(user));
    dispatch(showDeleteModal());
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await deleteUserMutation(selectedUser._id).unwrap();
        dispatch(removeUser(selectedUser._id));
        dispatch(hideDeleteModal());
        dispatch(setSelectedUser(null));
      } catch (err: any) {
        dispatch(setError(err.message || "Failed to delete user"));
      }
    }
  };

  const AddUserModal = () => (
    <div className="modal-overlay">
      <div className="modal add-user-modal">
        <div className="modal-header">
          <h2>Add New User</h2>
          <p>Super Admin</p>
          <button className="close-btn" onClick={() => setShowAddModal(false)}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="profile-image-section">
            <div className="profile-image">
              <div className="profile-placeholder">👤</div>
              <button className="edit-profile-btn">✏️</button>
            </div>
          </div>

          <form className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="Enter name" />
              </div>
              <div className="form-group">
                <label>Contact No</label>
                <input type="tel" placeholder="Enter contact number" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Enter email" />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select>
                  <option>Regional Admin</option>
                  <option>BA/PE Teachers</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>School</label>
                <input type="text" placeholder="Enter school" />
              </div>
              <div className="form-group">
                <label>Region</label>
                <select>
                  <option>North Region</option>
                  <option>South Region</option>
                  <option>East Region</option>
                  <option>West Region</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </button>
          <button className="btn btn-primary">Add User</button>
        </div>
      </div>
    </div>
  );

  const DeleteModal = () => (
    <div className="modal-overlay">
      <div className="modal delete-modal">
        <div className="modal-header">
          <h2>Action</h2>
          <button
            className="close-btn"
            onClick={() => setShowDeleteModal(false)}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="delete-confirmation">
            <div className="warning-icon">⚠️</div>
            <p>
              Are you sure you want to delete the user '{selectedUser?.fullName}
              '
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => dispatch(hideDeleteModal())}
          >
            No
          </button>
          <button
            className="btn btn-danger"
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-layout">
      <Sidebar userRole="SUPER_ADMIN" />

      <div className="main-content">
        <div className="content-header">
          <h1>User Management</h1>
          <p>User List ({usersData?.total || 0}) records</p>
        </div>

        <div className="action-bar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search Here"
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
          </div>

          <div className="action-buttons">
            <button className="btn btn-outline">
              <span>📥</span> Import
            </button>
            <button className="btn btn-outline">
              <span>📤</span> Export
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              + Add User
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="table-container">
          {isLoading ? (
            <div className="loading-message">Loading users...</div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email address</th>
                  <th>Role</th>
                  <th>School</th>
                  <th>Region</th>
                  <th>Date Added</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={index === 2 ? "highlighted" : ""}
                  >
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">👤</div>
                        <span>{user.fullName}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.schoolId || "N/A"}</td>
                    <td>{user.regionId || "N/A"}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="status active">Active</span>
                    </td>
                    <td>
                      <div className="action-icons">
                        <button className="action-btn view">👁️</button>
                        <button className="action-btn edit">✏️</button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteUser(user)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="pagination">
          <div className="records-per-page">
            <select
              value={pageSize}
              onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
            >
              <option value={10}>10 Records Per Page</option>
              <option value={20}>20 Records Per Page</option>
              <option value={50}>50 Records Per Page</option>
            </select>
          </div>

          <div className="pagination-controls">
            <span>
              Showing {filteredUsers.length} of {usersData?.total || 0}
            </span>
            <div className="page-numbers">
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">4</button>
              <button className="page-btn">{">"}</button>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && <AddUserModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
}
