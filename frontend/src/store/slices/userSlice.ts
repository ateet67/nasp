import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type User } from "../api/apiSlice";

interface UserState {
  users: User[];
  totalUsers: number;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  selectedRole: string;
  isLoading: boolean;
  error: string | null;
  selectedUser: User | null;
  showAddModal: boolean;
  showDeleteModal: boolean;
  showEditModal: boolean;
}

const initialState: UserState = {
  users: [],
  totalUsers: 0,
  currentPage: 1,
  pageSize: 10,
  searchTerm: "",
  selectedRole: "",
  isLoading: false,
  error: null,
  selectedUser: null,
  showAddModal: false,
  showDeleteModal: false,
  showEditModal: false,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (
      state,
      action: PayloadAction<{ users: User[]; total: number }>
    ) => {
      state.users = action.payload.users;
      state.totalUsers = action.payload.total;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when changing page size
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    setSelectedRole: (state, action: PayloadAction<string>) => {
      state.selectedRole = action.payload;
      state.currentPage = 1; // Reset to first page when filtering by role
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    showAddModal: (state) => {
      state.showAddModal = true;
    },
    hideAddModal: (state) => {
      state.showAddModal = false;
    },
    showDeleteModal: (state) => {
      state.showDeleteModal = true;
    },
    hideDeleteModal: (state) => {
      state.showDeleteModal = false;
    },
    showEditModal: (state) => {
      state.showEditModal = true;
    },
    hideEditModal: (state) => {
      state.showEditModal = false;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.unshift(action.payload);
      state.totalUsers += 1;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user._id === action.payload._id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
      state.totalUsers -= 1;
    },
    resetFilters: (state) => {
      state.searchTerm = "";
      state.selectedRole = "";
      state.currentPage = 1;
    },
  },
});

export const {
  setUsers,
  setCurrentPage,
  setPageSize,
  setSearchTerm,
  setSelectedRole,
  setLoading,
  setError,
  clearError,
  setSelectedUser,
  showAddModal,
  hideAddModal,
  showDeleteModal,
  hideDeleteModal,
  showEditModal,
  hideEditModal,
  addUser,
  updateUser,
  removeUser,
  resetFilters,
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectUsers = (state: { users: UserState }) => state.users.users;
export const selectTotalUsers = (state: { users: UserState }) =>
  state.users.totalUsers;
export const selectCurrentPage = (state: { users: UserState }) =>
  state.users.currentPage;
export const selectPageSize = (state: { users: UserState }) =>
  state.users.pageSize;
export const selectSearchTerm = (state: { users: UserState }) =>
  state.users.searchTerm;
export const selectSelectedRole = (state: { users: UserState }) =>
  state.users.selectedRole;
export const selectUserLoading = (state: { users: UserState }) =>
  state.users.isLoading;
export const selectUserError = (state: { users: UserState }) =>
  state.users.error;
export const selectSelectedUser = (state: { users: UserState }) =>
  state.users.selectedUser;
export const selectShowAddModal = (state: { users: UserState }) =>
  state.users.showAddModal;
export const selectShowDeleteModal = (state: { users: UserState }) =>
  state.users.showDeleteModal;
export const selectShowEditModal = (state: { users: UserState }) =>
  state.users.showEditModal;
