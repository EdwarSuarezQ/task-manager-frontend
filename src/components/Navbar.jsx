import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuhtContext";
import { Menu, X } from "lucide-react"; // íconos del menú

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const enPerfil = location.pathname === "/profile";
  const enConfiguracion = location.pathname === "/settings";
  const enAdmin = location.pathname === "/admin";

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <nav className="bg-zinc-800 p-4 flex justify-between items-center relative">
      {/* Título */}
      <Link to="/" className="text-2xl font-bold text-white">
        Gestión de Tareas
      </Link>

      <div className="flex items-center gap-4">
        {/* Texto de bienvenida (solo si está autenticado) */}
        {isAuthenticated && (
          <span className="text-gray-300 text-sm sm:text-base">
            Bienvenido, <span className="font-semibold">{user.username}</span>
          </span>
        )}

        {/* Botón hamburguesa */}
        <button
          onClick={toggleMenu}
          className="text-white hover:text-gray-300 focus:outline-none"
        >
          {menuAbierto ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú desplegable */}
      {menuAbierto && (
        <ul className="absolute top-full right-0 mt-2 w-56 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg flex flex-col gap-2 p-3 z-50">
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/"
                  onClick={() => {
                    logout();
                    setMenuAbierto(false);
                  }}
                  className="block text-center bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
                >
                  Cerrar Sesion
                </Link>
              </li>

              <li>
                <Link
                  to="/add-task"
                  onClick={() => setMenuAbierto(false)}
                  className="block text-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                >
                  Nueva Tarea
                </Link>
              </li>

              {enPerfil ? (
                <li>
                  <Link
                    to="/tasks"
                    onClick={() => setMenuAbierto(false)}
                    className="block text-center bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-md"
                  >
                    Volver a Tareas
                  </Link>
                </li>
              ) : enConfiguracion ? (
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setMenuAbierto(false)}
                    className="block text-center bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md"
                  >
                    Mi Perfil
                  </Link>
                </li>
              ) : enAdmin ? (
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setMenuAbierto(false)}
                    className="block text-center bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md"
                  >
                    Mi Perfil
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => setMenuAbierto(false)}
                      className="block text-center bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md"
                    >
                      Mi Perfil
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      onClick={() => setMenuAbierto(false)}
                      className="block text-center bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
                    >
                      Configuración
                    </Link>
                  </li>
                  {user.role === "admin" && (
                    <li>
                      <Link
                        to="/admin"
                        onClick={() => setMenuAbierto(false)}
                        className="block text-center bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md"
                      >
                        Administración
                      </Link>
                    </li>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  onClick={() => setMenuAbierto(false)}
                  className="block text-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                >
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  onClick={() => setMenuAbierto(false)}
                  className="block text-center bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
                >
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
