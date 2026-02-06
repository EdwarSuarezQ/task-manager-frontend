import { useAuth } from "../context/AuhtContext";
import { useTasks } from "../context/TasksContext";
import { Link } from "react-router-dom";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

function ProfilePage() {
  const { user } = useAuth();
  const { tasks } = useTasks();

  const totalTareas = tasks.length;
  const tareasCompletadas = tasks.filter((t) => t.completed).length;

  const tareasVencidas = tasks.filter((t) => {
    const hoy = dayjs().format("YYYY-MM-DD");

    const fechaDeTarea = dayjs.utc(t.date).format("YYYY-MM-DD");

    const estaVencida = fechaDeTarea < hoy;

    return estaVencida && !t.completed;
  }).length;

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-100px)] px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">Mi Perfil</h1>

      <div className="bg-zinc-800 p-6 rounded-md w-full max-w-2xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm sm:text-base">
              <span className="font-bold text-slate-200">Usuario:</span>{" "}
              <span className="text-gray-300">{user.username}</span>
            </p>
            <p className="text-sm sm:text-base">
              <span className="font-bold text-slate-200">Correo:</span>{" "}
              <span className="text-gray-300 truncate block sm:inline">{user.email}</span>
            </p>
          </div>
          <Link
            to="/settings"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white text-sm font-medium text-center transition-colors"
          >
            Configuración
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 mt-6 gap-4 w-full max-w-2xl">
        <div className="bg-blue-600 p-4 rounded-md text-center text-white shadow-lg">
          <p className="font-bold text-sm uppercase tracking-wider opacity-80">Tareas Totales</p>
          <p className="text-3xl font-bold">{totalTareas}</p>
        </div>
        <div className="bg-green-600 p-4 rounded-md text-center text-white shadow-lg">
          <p className="font-bold text-sm uppercase tracking-wider opacity-80">Completadas</p>
          <p className="text-3xl font-bold">{tareasCompletadas}</p>
        </div>
        <div className="bg-red-600 p-4 rounded-md text-center text-white shadow-lg">
          <p className="font-bold text-sm uppercase tracking-wider opacity-80">Vencidas</p>
          <p className="text-3xl font-bold">{tareasVencidas}</p>
        </div>
      </div>

      <div className="bg-zinc-800 p-6 rounded-md w-full max-w-2xl mt-6">
        <p className="text-slate-400 mb-2 font-bold">Ultimas Tareas</p>
        <ul className="divide-y divide-gray-700">
          {tasks
            .slice(-5)
            .reverse()
            .map((task) => (
              <li key={task._id} className="py-2 flex justify-between">
                <span>{task.title}</span>
                <span
                  className={`font-bold ${
                    task.completed ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {task.completed ? "Completada" : "Pendiente"}
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default ProfilePage;
