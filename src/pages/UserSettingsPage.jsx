import { useState, useEffect } from "react";
import { useAuth } from "../context/AuhtContext";
import {
  updateProfileRequest,
  changePasswordRequest,
  deleteAccountRequest,
} from "../api/auth";

function UserSettingsPage() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [deleteData, setDeleteData] = useState({
    password: "",
    confirmDelete: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateProfileRequest(profileData);
      setUser(response.data);
      showMessage("success", "Perfil actualizado exitosamente");
    } catch (error) {
      showMessage(
        "error",
        error.response?.data?.message || "Error al actualizar perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("error", "Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      await changePasswordRequest(passwordData);
      showMessage("success", "Contraseña actualizada exitosamente");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showMessage(
        "error",
        error.response?.data?.message || "Error al cambiar contraseña"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!deleteData.confirmDelete) {
      showMessage("error", "Debes confirmar la eliminación de la cuenta");
      return;
    }

    setLoading(true);

    try {
      await deleteAccountRequest(deleteData);
      showMessage("success", "Cuenta eliminada exitosamente");
      window.location.reload();
    } catch (error) {
      showMessage(
        "error",
        error.response?.data?.message || "Error al eliminar cuenta"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-100px)] px-4 sm:px-6 py-8 sm:py-10 relative">
      {message.text && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg transition-all duration-500 ${
            message.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      <h1 className="text-3xl font-bold text-white mb-6">
        Configuración de Usuario
      </h1>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 w-full max-w-2xl px-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex-1 sm:flex-none text-sm sm:text-base ${
            activeTab === "profile"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
          }`}
        >
          Perfil
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex-1 sm:flex-none text-sm sm:text-base ${
            activeTab === "password"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
          }`}
        >
          Contraseña
        </button>
        <button
          onClick={() => setActiveTab("danger")}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex-1 sm:flex-none text-sm sm:text-base ${
            activeTab === "danger"
              ? "bg-red-600 text-white shadow-lg"
              : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
          }`}
        >
          Eliminar
        </button>
      </div>

      <div className="w-full max-w-2xl">
        {activeTab === "profile" && (
          <div className="bg-zinc-800 p-6 rounded-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Actualizar Perfil
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) =>
                    setProfileData({ ...profileData, username: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-zinc-700 text-white rounded-md border border-zinc-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-zinc-700 text-white rounded-md border border-zinc-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Actualizando..." : "Actualizar Perfil"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "password" && (
          <div className="bg-zinc-800 p-6 rounded-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Cambiar Contraseña
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-zinc-700 text-white rounded-md border border-zinc-600 focus:border-blue-500 focus:outline-none"
                  required
                  autoComplete="current-password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-zinc-700 text-white rounded-md border border-zinc-600 focus:border-blue-500 focus:outline-none"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-zinc-700 text-white rounded-md border border-zinc-600 focus:border-blue-500 focus:outline-none"
                  required
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Cambiando..." : "Cambiar Contraseña"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "danger" && (
          <div className="bg-zinc-800 p-6 rounded-md border border-red-600">
            <h2 className="text-xl font-bold text-red-400 mb-4">
              Eliminar Cuenta
            </h2>
            <p className="text-gray-300 mb-6">
              Esta acción es irreversible. Se eliminarán todos tus datos y
              tareas.
            </p>
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={deleteData.password}
                  onChange={(e) =>
                    setDeleteData({ ...deleteData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-zinc-700 text-white rounded-md border border-zinc-600 focus:border-red-500 focus:outline-none"
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="confirmDelete"
                  checked={deleteData.confirmDelete}
                  onChange={(e) =>
                    setDeleteData({
                      ...deleteData,
                      confirmDelete: e.target.checked,
                    })
                  }
                  className="mr-2 w-4 h-4"
                  required
                />
                <label htmlFor="confirmDelete" className="text-gray-300">
                  Confirmo que quiero eliminar mi cuenta permanentemente
                </label>
              </div>
              <button
                type="submit"
                disabled={loading || !deleteData.confirmDelete}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Eliminando..." : "Eliminar Cuenta"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSettingsPage;
