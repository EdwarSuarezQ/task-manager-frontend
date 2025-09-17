import { Link } from "react-router-dom";
import { useTasks } from "../context/TasksContext";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export function TaskCard({ task }) {
    const { deleteTask } = useTasks();
    const isExpired = dayjs().isAfter(dayjs.utc(task.date));
    return (
        <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow">
            <div>
            <header className="flex justify-between">
                <h1 className="text-2xl font-bold truncate">{task.title}</h1>
            </header>
            <p className="text-slate-400 my-2 break-words max-h-24 overflow-hidden whitespace-pre-line">{task.description}</p>
            </div>
            
            <div className="mt-4">
            <div className="flex gap-x-2 items-center flex-wrap">
                <button
                    className="bg-red-600 hover:bg-red-700 px-2 py-2 rounded-md"
                    onClick={() => {
                        deleteTask(task._id);
                    }} >Eliminar</button>

                <Link
                    className="bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-md"
                    to={`/tasks/${task._id}`}>Editar</Link>

                <Link
                    className="bg-green-600 hover:bg-green-700 px-2 py-2 rounded-md"
                    to={`/tasks/view/${task._id}`}
                >Ver Tarea</Link>
            </div>
                <p className={`text-sm mt-2 ${isExpired ? "text-red-400" : "text-slate-400"}`}>
                    {dayjs.utc(task.date).format("DD/MM/YYYY")} {isExpired && "(Vencida)"}</p>
            </div>
        </div>
    );
}

export default TaskCard;
