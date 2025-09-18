import { Link } from "react-router-dom";
import { useTasks } from "../context/TasksContext";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export function TaskCard({ task }) {
  const { deleteTask, updateTask } = useTasks();

  const hoy = dayjs().format("YYYY-MM-DD");

  const fechaDeTarea = dayjs.utc(task.date).format("YYYY-MM-DD");

  const toggleCompleted = () => {
    updateTask(task._id, { completed: !task.completed });
  };

  let estado = "Pendiente";
  let colorEstado = "text-yellow-400";

  if (task.completed) {
    estado = "Completada";
    colorEstado = "text-green-400";
  } else if (fechaDeTarea < hoy) {
    estado = "Vencida";
    colorEstado = "text-red-400";
  }

  const esDeshabilitado = task.completed;
  const classBoton = esDeshabilitado
    ? "bg-blue-800 px-2 py-1 rounded-md text-sm cursor-not-allowed"
    : "bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-md text-sm";

  return (
    <div
      className={`bg-zinc-800 max-w-md w-full p-6 rounded-md flex flex-col 
        justify-between shadow-md hover:shadow-lg transition-shadow
      ${task.completed ? "opacity-70" : ""}`}
    >
      <div>
        <header className="flex justify-between items-center mb-2">
          <h1
            className={`text-2xl font-bold truncate ${
              task.completed ? "line-through text-green-400" : "text-white"
            }`}
          >
            {task.title}
          </h1>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={toggleCompleted}
            className="w-5 h-5 accent-green-600 cursor-pointer"
          />
        </header>

        {task.description && (
          <p className="text-slate-400 my-2 break-words max-h-24 overflow-hidden whitespace-pre-line">
            {task.description}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          <button
            className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded-md text-sm"
            onClick={() => deleteTask(task._id)}
          >
            Eliminar
          </button>
          <Link
            className={classBoton}
            to={!esDeshabilitado ? `/tasks/${task._id}` : "#"}
            onClick={(e) => {
              if (esDeshabilitado) e.preventDefault();
            }}
          >
            Editar
          </Link>
          <Link
            className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded-md text-sm"
            to={`/tasks/view/${task._id}`}
          >
            Ver Tarea
          </Link>
        </div>

        <p className="text-sm mt-2">
          <span className="text-slate-400">
            Fecha: {dayjs.utc(task.date).format("DD/MM/YYYY")}
          </span>{" "}
          - <span className={colorEstado}>{estado}</span>
        </p>
      </div>
    </div>
  );
}

export default TaskCard;
