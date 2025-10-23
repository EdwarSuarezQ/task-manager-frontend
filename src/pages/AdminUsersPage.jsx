import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuhtContext";
import {
  getUsersRequest,
  toggleUserStatusRequest,
  deleteUserRequest,
  changeUserRoleRequest,
} from "../api/auth";
import {
  MoreVertical,
  UserX,
  UserCheck,
  Trash2,
  Shield,
  User,
  ChevronDown,
} from "lucide-react";

function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "super_admin")) {
      loadUsers();
    } else {
      showMessage("error", "No tienes permisos de administrador");
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const filtered = users.filter(
      (userItem) =>
        userItem.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userItem.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userItem.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideAll = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target)
      );

      if (isOutsideAll) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsersRequest();
      setUsers(response.data);
    } catch (error) {
      showMessage(
        "error",
        error.response?.data?.message || "Error al cargar usuarios"
      );
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const response = await toggleUserStatusRequest(userId, !currentStatus);
      showMessage("success", response.data.message);

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId ? { ...u, isActive: !currentStatus } : u
        )
      );

      setFilteredUsers((prevFiltered) =>
        prevFiltered.map((u) =>
          u._id === userId ? { ...u, isActive: !currentStatus } : u
        )
      );
    } catch (error) {
      showMessage(
        "error",
        error.response?.data?.message || "Error al cambiar estado del usuario"
      );
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres eliminar al usuario "${username}"? Esta acción es irreversible.`
      )
    )
      return;

    try {
      await deleteUserRequest(userId);
      showMessage("success", "Usuario eliminado exitosamente");

      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));
      setFilteredUsers((prevFiltered) =>
        prevFiltered.filter((u) => u._id !== userId)
      );
    } catch (error) {
      showMessage(
        "error",
        error.response?.data?.message || "Error al eliminar usuario"
      );
    }
  };

  const handleChangeRole = async (userId, currentRole, newRole) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres cambiar el rol de este usuario de "${currentRole}" a "${newRole}"?`
      )
    )
      return;

    try {
      const response = await changeUserRoleRequest(userId, newRole);
      showMessage("success", response.data.message);

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );

      setFilteredUsers((prevFiltered) =>
        prevFiltered.map((u) =>
          u._id === userId ? { ...u, role: newRole } : u
        )
      );
    } catch (error) {
      showMessage(
        "error",
        error.response?.data?.message || "Error al cambiar rol del usuario"
      );
    }
  };

  const getAvailableActions = (userItem) => {
    const actions = [];

    if (userItem._id === user.id) {
      return actions;
    }

    if (userItem.role !== "super_admin") {
      actions.push({
        id: "toggle-status",
        label: userItem.isActive ? "Bloquear Usuario" : "Desbloquear Usuario",
        icon: userItem.isActive ? UserX : UserCheck,
        action: () => handleToggleStatus(userItem._id, userItem.isActive),
        color: userItem.isActive ? "text-red-400" : "text-green-400",
      });
    }

    if (user.role === "super_admin" && userItem._id !== user.id) {
      const existingSuperAdmin = users.find(
        (u) => u.role === "super_admin" && u._id !== userItem._id
      );

      if (userItem.role !== "user") {
        actions.push({
          id: "make-user",
          label: "Hacer Usuario Normal",
          icon: User,
          action: () => handleChangeRole(userItem._id, userItem.role, "user"),
          color: "text-gray-300",
        });
      }

      if (userItem.role !== "admin") {
        actions.push({
          id: "make-admin",
          label: "Hacer Administrador",
          icon: Shield,
          action: () => handleChangeRole(userItem._id, userItem.role, "admin"),
          color: "text-purple-400",
        });
      }

      if (userItem.role !== "super_admin" && !existingSuperAdmin) {
        actions.push({
          id: "make-super-admin",
          label: "Hacer Super Admin",
          icon: Shield,
          action: () =>
            handleChangeRole(userItem._id, userItem.role, "super_admin"),
          color: "text-red-400",
        });
      }
    }

    if (userItem.role !== "super_admin" && userItem._id !== user.id) {
      actions.push({
        id: "delete",
        label: "Eliminar Usuario",
        icon: Trash2,
        action: () => handleDeleteUser(userItem._id, userItem.username),
        color: "text-red-400",
      });
    }

    return actions;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      showMessage("error", "Por favor ingresa un termino para buscar.");
      return;
    }

    const filtered = users.filter(
      (userItem) =>
        userItem.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userItem.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userItem.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered.length === 0) {
      showMessage("error", "No se encontraron usuarios con ese criterio.");
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const setDropdownRef = (element, userId) => {
    if (element) {
      dropdownRefs.current[userId] = element;
    } else {
      delete dropdownRefs.current[userId];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-white text-xl">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Administración de Usuarios
          </h1>
          <p className="text-gray-300">
            Bienvenido,{" "}
            <span className="font-semibold text-white">{user.username}</span> (
            {user.role === "super_admin"
              ? "Super Administrador"
              : "Administrador"}
            )
          </p>
        </div>

        {message.text && (
          <div
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up
            ${
              message.type === "success" ? "bg-green-600" : "bg-red-600"
            } text-white`}
          >
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-zinc-700 text-white rounded-md border border-zinc-600 focus:border-blue-500 focus:outline-none w-64"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-600 p-4 rounded-lg text-center text-white shadow-lg">
            <p className="font-semibold text-blue-100 mb-2">Total Usuarios</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="bg-green-600 p-4 rounded-lg text-center text-white shadow-lg">
            <p className="font-semibold text-green-100 mb-2">
              Usuarios Activos
            </p>
            <p className="text-2xl font-bold">
              {users.filter((u) => u.isActive).length}
            </p>
          </div>
          <div className="bg-red-600 p-4 rounded-lg text-center text-white shadow-lg">
            <p className="font-semibold text-red-100 mb-2">
              Usuarios Bloqueados
            </p>
            <p className="text-2xl font-bold">
              {users.filter((u) => !u.isActive).length}
            </p>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-lg w-full overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="w-48 p-4 text-left text-white font-semibold whitespace-nowrap">
                    Usuario
                  </th>
                  <th className="w-64 p-4 text-left text-white font-semibold whitespace-nowrap">
                    Email
                  </th>
                  <th className="w-32 p-4 text-center text-white font-semibold whitespace-nowrap">
                    Rol
                  </th>
                  <th className="w-36 p-4 text-center text-white font-semibold whitespace-nowrap">
                    Estado
                  </th>
                  <th className="w-48 p-4 text-center text-white font-semibold whitespace-nowrap">
                    Fecha Registro
                  </th>
                  <th className="w-56 p-4 text-center text-white font-semibold whitespace-nowrap">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((userItem, index) => {
                  const availableActions = getAvailableActions(userItem);

                  return (
                    <tr
                      key={userItem._id}
                      className={`border-b border-zinc-700 transition-colors ${
                        index % 2 === 0 ? "bg-zinc-800" : "bg-zinc-700"
                      } hover:bg-zinc-600`}
                    >
                      <td className="w-48 p-4 text-gray-300 font-medium whitespace-nowrap truncate">
                        {userItem.username}
                      </td>
                      <td className="w-64 p-4 text-gray-300 whitespace-nowrap truncate">
                        {userItem.email}
                      </td>
                      <td className="w-32 p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium inline-block w-full ${
                            userItem.role === "super_admin"
                              ? "bg-red-600 text-white"
                              : userItem.role === "admin"
                              ? "bg-purple-600 text-white"
                              : "bg-gray-600 text-white"
                          }`}
                        >
                          {userItem.role === "super_admin"
                            ? "Super Admin"
                            : userItem.role === "admin"
                            ? "Admin"
                            : "Usuario"}
                        </span>
                      </td>
                      <td className="w-36 p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium inline-block w-full ${
                            userItem.isActive
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {userItem.isActive ? "Activo" : "Bloqueado"}
                        </span>
                      </td>
                      <td className="w-48 p-4 text-gray-300 text-sm text-center whitespace-nowrap">
                        {formatDate(userItem.createdAt)}
                      </td>
                      <td className="w-48 p-4 text-center">
                        {availableActions.length > 0 ? (
                          <div
                            className="relative"
                            ref={(el) => setDropdownRef(el, userItem._id)}
                          >
                            <button
                              onClick={() =>
                                setOpenDropdown(
                                  openDropdown === userItem._id
                                    ? null
                                    : userItem._id
                                )
                              }
                              className="w-full flex items-center justify-between px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-md text-gray-300 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                            >
                              <span className="font-medium truncate">
                                Acciones
                              </span>
                              <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 ${
                                  openDropdown === userItem._id
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>

                            {openDropdown === userItem._id && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-600 rounded-md shadow-xl z-50 overflow-hidden">
                                {availableActions.map((action, index) => {
                                  const Icon = action.icon;
                                  return (
                                    <button
                                      key={action.id}
                                      onClick={() => {
                                        action.action();
                                        setOpenDropdown(null);
                                      }}
                                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-zinc-700 transition-colors ${
                                        index > 0
                                          ? "border-t border-zinc-600"
                                          : ""
                                      }`}
                                    >
                                      <Icon
                                        size={14}
                                        className={action.color}
                                      />
                                      <span className="text-gray-300 font-medium">
                                        {action.label}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs">
                            No hay acciones disponibles
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {currentUsers.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                {searchTerm
                  ? "No se encontraron usuarios que coincidan con la búsqueda"
                  : "No hay usuarios registrados"}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <label className="text-gray-300 text-sm">Mostrando:</label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-2 py-1 bg-zinc-700 text-white rounded-md border border-zinc-600 focus:border-blue-500 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
            </select>
            <span className="text-gray-300 text-sm">registros por página</span>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-zinc-700 text-white rounded-md disabled:opacity-50 hover:bg-zinc-600 transition-colors"
              >
                «
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-zinc-700 text-white rounded-md disabled:opacity-50 hover:bg-zinc-600 transition-colors"
              >
                ‹
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-700 text-white hover:bg-zinc-600"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-zinc-700 text-white rounded-md disabled:opacity-50 hover:bg-zinc-600 transition-colors"
              >
                ›
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-zinc-700 text-white rounded-md disabled:opacity-50 hover:bg-zinc-600 transition-colors"
              >
                »
              </button>
            </div>
          )}

          <div className="text-gray-300 text-sm text-center md:text-right">
            Mostrando {startIndex + 1} -{" "}
            {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length}{" "}
            registros
            {searchTerm && ` (filtrados de ${users.length} total)`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsersPage;
