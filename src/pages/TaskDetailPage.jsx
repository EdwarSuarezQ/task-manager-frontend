import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTasks } from "../context/TasksContext";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export function TaskDetailPage() {
  const { getTask } = useTasks();
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    async function loadTask() {
      const data = await getTask(id);
      setTask(data);
    }
    loadTask();
  }, [id]);

  if (!task) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <p className="text-white">Cargando tarea...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
        <h1 className="text-3xl font-bold text-white mb-4">{task.title}</h1>
        <p className="text-slate-300 whitespace-pre-line mb-4">
          {task.description}
        </p>
        <p className="text-slate-400 text-sm mb-6">
          Fecha: {dayjs.utc(task.date).format("DD/MM/YYYY, hh:mm a")}
        </p>

        <Link
          to="/tasks"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
        >
          Volver a tareas
        </Link>
      </div>
    </div>
  );
}

export default TaskDetailPage;
