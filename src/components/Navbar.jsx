import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Bell,
} from "lucide-react";
import { useNotifications } from "../context/NotificationsContext";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.locale("es");

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { notifications, summary, unviewedCount, markAllAsViewed } =
    useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [notiAbierto, setNotiAbierto] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);
  const notiRef = useRef(null);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const toggleNoti = () => {
    if (!notiAbierto && unviewedCount > 0) {
      markAllAsViewed();
    }
    setNotiAbierto(!notiAbierto);
  };

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

  if (user?.role === "admin" || user?.role === "super_admin") {
    enlaces.push({ to: "/admin", label: "Administración", icon: Shield });
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false);
      }
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setNotiAbierto(false);
      }
    };

    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  useEffect(() => {
    setMenuAbierto(false);
    setNotiAbierto(false);
  }, [location]);

  const formatNotificationDate = (dateString) => {
    if (!dateString) return "";

    try {
      return dayjs.utc(dateString).format("DD/MM/YYYY, hh:mm a");
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "Fecha inválida";
    }
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return "";

    try {
      return dayjs.utc(dateString).fromNow();
    } catch (error) {
      return "";
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.taskId) {
      navigate(`/tasks/view/${notification.taskId}`);
    }
    setNotiAbierto(false);
  };

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
              <div className="flex items-center gap-3">
                <div className="relative" ref={notiRef}>
                  <button
                    onClick={toggleNoti}
                    className="relative p-2 rounded-lg transition-all duration-200"
                    aria-label="Notificaciones"
                  >
                    <Bell size={22} className="text-gray-300" />
                    {unviewedCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unviewedCount > 9 ? "9+" : unviewedCount}
                      </span>
                    )}
                  </button>

                  {notiAbierto && (
                    <div className="absolute right-0 mt-2 w-96 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50">
                      <div className="px-4 py-3 border-b border-zinc-700">
                        <div className="flex justify-between items-center">
                          <h3 className="text-white font-semibold">
                            Notificaciones
                            {notifications.length > 0 && (
                              <span className="ml-2 text-sm text-gray-400">
                                ({notifications.length})
                              </span>
                            )}
                          </h3>
                          {(user?.role === "admin" ||
                            user?.role === "super_admin") &&
                            summary && (
                              <div className="text-xs text-gray-400">
                                {summary.tasksOverdue > 0 && (
                                  <span className="text-red-400 mx-1">●</span>
                                )}
                                {summary.tasksDueToday > 0 && (
                                  <span className="text-yellow-400 mx-1">
                                    ●
                                  </span>
                                )}
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-400">
                            <Bell size={32} className="mx-auto mb-2" />
                            <p>No tienes notificaciones</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-zinc-800">
                            {notifications.map((noti, index) => {
                              const isOverdue =
                                noti.message?.includes("vencida");
                              const isDueToday =
                                noti.message?.includes("vence hoy");
                              const isDueTomorrow =
                                noti.message?.includes("vence mañana");

                              return (
                                <div
                                  key={index}
                                  className="p-4 cursor-pointer hover:bg-zinc-800"
                                  onClick={() => handleNotificationClick(noti)}
                                >
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                        isOverdue
                                          ? "bg-red-500"
                                          : isDueToday
                                          ? "bg-yellow-500"
                                          : isDueTomorrow
                                          ? "bg-blue-500"
                                          : "bg-gray-500"
                                      }`}
                                    />

                                    <div className="flex-1 min-w-0">
                                      <p className="text-white text-sm">
                                        {noti.message}
                                      </p>

                                      {noti.dueDate && (
                                        <p className="text-gray-500 text-xs mt-1">
                                          Vence:{" "}
                                          {formatNotificationDate(noti.dueDate)}
                                        </p>
                                      )}

                                      <p className="text-gray-600 text-xs mt-1">
                                        {getRelativeTime(noti.generatedAt)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {(user?.role === "admin" ||
                        user?.role === "super_admin") &&
                        summary && (
                          <div className="px-4 py-3 border-t border-zinc-700 bg-zinc-800">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                <span className="text-gray-400">Usuarios:</span>
                                <span className="text-white font-semibold">
                                  {summary.totalUsers}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                <span className="text-gray-400">Tareas:</span>
                                <span className="text-white font-semibold">
                                  {summary.tasksTotal}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                <span className="text-gray-400">Vencidas:</span>
                                <span className="text-white font-semibold">
                                  {summary.tasksOverdue}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                                <span className="text-gray-400">Hoy:</span>
                                <span className="text-white font-semibold">
                                  {summary.tasksDueToday}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>

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
                                {user.role === "super_admin"
                                  ? "Super Admin"
                                  : user.role === "admin"
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
                                    estaActivo
                                      ? "text-blue-400"
                                      : "text-gray-400"
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
