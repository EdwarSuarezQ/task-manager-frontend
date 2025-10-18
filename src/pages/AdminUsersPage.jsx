import { useState, useEffect } from "react";
import { useAuth } from "../context/AuhtContext";
import {
  getUsersRequest,
  toggleUserStatusRequest,
  deleteUserRequest,
} from "../api/auth";

function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    if (user && user.role === "admin") {
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
      setUsers(
        users.map((u) =>
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
      setUsers(users.filter((u) => u._id !== userId));
    } catch (error) {
      showMessage(
        "error",
        error.response?.data?.message || "Error al eliminar usuario"
      );
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="text-white text-xl">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-100px)] px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">
        Administración de Usuarios
      </h1>

      <div className="text-gray-300 mb-6">
        Bienvenido, {user.username} (Administrador)
      </div>

      {message.text && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up
      ${message.type === "success" ? "bg-green-600" : "bg-red-600"} text-white`}
        >
          <span className="text-xl">{message.type === "success"}</span>
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 w-full max-w-6xl">
        <div className="flex items-center gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full max-w-6xl">
        <div className="bg-blue-600 p-4 rounded-md text-center text-white">
          <p className="font-bold">Total Usuarios</p>
          <p className="text-2xl">{users.length}</p>
        </div>
        <div className="bg-green-600 p-4 rounded-md text-center text-white">
          <p className="font-bold">Usuarios Activos</p>
          <p className="text-2xl">{users.filter((u) => u.isActive).length}</p>
        </div>
        <div className="bg-red-600 p-4 rounded-md text-center text-white">
          <p className="font-bold">Usuarios Bloqueados</p>
          <p className="text-2xl">{users.filter((u) => !u.isActive).length}</p>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-md w-full max-w-6xl overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="p-4 text-left text-white">Usuario</th>
              <th className="p-4 text-left text-white">Email</th>
              <th className="p-4 text-left text-white">Rol</th>
              <th className="p-4 text-center text-white min-w-[130px]">
                Estado
              </th>
              <th className="p-4 text-left text-white">Fecha Registro</th>
              <th className="p-4 text-center text-white min-w-[240px]">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((userItem) => (
              <tr
                key={userItem._id}
                className="border-b border-zinc-700 hover:bg-zinc-700 transition-all duration-200"
              >
                <td className="p-4 text-gray-300 font-medium">
                  {userItem.username}
                </td>
                <td className="p-4 text-gray-300">{userItem.email}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium block text-center min-w-[110px] ${
                      userItem.role === "admin"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {userItem.role === "admin" ? "Administrador" : "Usuario"}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium inline-block min-w-[110px] transition-all duration-200 ${
                      userItem.isActive
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {userItem.isActive ? "Activo" : "Bloqueado"}
                  </span>
                </td>
                <td className="p-4 text-gray-300 text-sm">
                  {formatDate(userItem.createdAt)}
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    {userItem._id !== user.id && (
                      <button
                        onClick={() =>
                          handleToggleStatus(userItem._id, userItem.isActive)
                        }
                        className={`px-3 py-1 rounded text-xs font-medium min-w-[110px] transition-all duration-200 ${
                          userItem.isActive
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        {userItem.isActive ? "Bloquear" : "Desbloquear"}
                      </button>
                    )}
                    {userItem._id !== user.id && userItem.role !== "admin" && (
                      <button
                        onClick={() =>
                          handleDeleteUser(userItem._id, userItem.username)
                        }
                        className="px-3 py-1 rounded text-xs font-medium bg-red-600 hover:bg-red-700 text-white min-w-[110px] transition-all duration-200"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
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

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 w-full max-w-6xl">
        <div className="flex items-center gap-2">
          <label className="text-gray-300 text-sm">Mostrar:</label>
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
              className="px-3 py-1 bg-zinc-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-600"
            >
              «
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-zinc-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-600"
            >
              ‹
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md ${
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
              className="px-3 py-1 bg-zinc-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-600"
            >
              ›
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-zinc-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-600"
            >
              »
            </button>
          </div>
        )}

        <div className="text-gray-300 text-sm">
          Mostrando {startIndex + 1} -{" "}
          {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length}{" "}
          Registros
          {searchTerm && ` (filtrados de ${users.length} total)`}
        </div>
      </div>
    </div>
  );
}

export default AdminUsersPage;
