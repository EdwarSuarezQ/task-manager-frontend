import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuhtContext";
import {
  ChevronDown,
  ChevronUp,
  User,
  Settings,
  LogOut,
  PlusCircle,
  CheckSquare,
  Shield,
} from "lucide-react";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const colores = [
    "bg-indigo-700",
    "bg-blue-700",
    "bg-slate-600",
    "bg-purple-700",
    "bg-gray-700",
    "bg-emerald-700",
  ];

  const obtenerColorUsuario = (nombre = "") => {
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) {
      hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colores[Math.abs(hash) % colores.length];
  };

  const obtenerIniciales = (nombre = "") =>
    nombre
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2);

  const colorCirculo = obtenerColorUsuario(user?.username || "Usuario");
  const rutaActual = location.pathname;

  const enlaces = [
    { to: "/add-task", label: "Nueva Tarea", icon: PlusCircle },
    { to: "/tasks", label: "Tareas", icon: CheckSquare },
    { to: "/profile", label: "Mi Perfil", icon: User },
    { to: "/settings", label: "Configuración", icon: Settings },
  ];

  if (user?.role === "admin") {
    enlaces.push({ to: "/admin", label: "Administración", icon: Shield });
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false);
      }
    };
    if (menuAbierto) document.addEventListener("mousedown", handleClickFuera);
    else document.removeEventListener("mousedown", handleClickFuera);

    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, [menuAbierto]);

  useEffect(() => {
    setMenuAbierto(false);
  }, [location]);

  return (
    <nav
      className={`bg-zinc-800 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-xl border-b border-zinc-700" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold text-white hover:text-gray-200 transition-colors"
          >
            Gestión de Tareas
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3" ref={menuRef}>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm text-gray-400">Hola,</span>
                  <span className="text-sm font-semibold text-white max-w-32 truncate">
                    {user.username}
                  </span>
                </div>

                <div className="relative">
                  <button
                    onClick={toggleMenu}
                    className="flex items-center gap-2 p-1 rounded-lg transition-all duration-200"
                    aria-label="Abrir menú de usuario"
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${colorCirculo} flex items-center justify-center text-white font-semibold border border-gray-500`}
                    >
                      {obtenerIniciales(user?.username || "U")}
                    </div>
                    <div className="hidden sm:block">
                      {menuAbierto ? (
                        <ChevronUp size={18} className="text-gray-300" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-300" />
                      )}
                    </div>
                  </button>

                  {menuAbierto && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl py-2 z-50">
                      <div className="px-4 py-3 border-b border-zinc-700">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-full ${colorCirculo} flex items-center justify-center text-white font-semibold border border-gray-500`}
                          >
                            {obtenerIniciales(user?.username || "U")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">
                              {user.username}
                            </p>
                            <p className="text-gray-400 text-sm truncate">
                              {user.email}
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                              {user.role === "admin"
                                ? "Administrador"
                                : "Usuario"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        {enlaces.map((enlace) => {
                          const Icon = enlace.icon;
                          const estaActivo = rutaActual === enlace.to;

                          return (
                            <Link
                              key={enlace.to}
                              to={enlace.to}
                              onClick={() => setMenuAbierto(false)}
                              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-md transition-all duration-200 ${
                                estaActivo
                                  ? "bg-blue-500/20 text-blue-300"
                                  : "text-gray-200 hover:bg-zinc-800 hover:text-white"
                              }`}
                            >
                              <Icon
                                size={18}
                                className={
                                  estaActivo ? "text-blue-400" : "text-gray-400"
                                }
                              />
                              <span className="font-medium">
                                {enlace.label}
                              </span>
                            </Link>
                          );
                        })}
                      </div>

                      <div className="border-t border-zinc-700 my-2"></div>

                      <div className="px-2">
                        <button
                          onClick={() => {
                            logout();
                            setMenuAbierto(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-zinc-800 hover:text-red-300 rounded-md transition-all duration-200"
                        >
                          <LogOut size={18} />
                          <span className="font-medium">Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {rutaActual !== "/login" && (
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-200 hover:text-white border border-gray-500 hover:border-gray-400 rounded-md transition-all duration-200"
                  >
                    Iniciar Sesión
                  </Link>
                )}
                {rutaActual !== "/register" && (
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200"
                  >
                    Registrarse
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
