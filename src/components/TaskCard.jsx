import { Link } from "react-router-dom";
import { useTasks } from "../context/TasksContext";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export function TaskCard({ task }) {
    const { deleteTask } = useTasks();
    return (
        <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md overflow-hidden">
            <header className="flex justify-between">
                <h1 className="text-2xl font-bold truncate">{task.title}</h1>
            </header>
            <p className="text-slate-400 my-2 break-words max-h-24 overflow-hidden">{task.description}</p>
            <div className="flex gap-x-2 items-center flex-wrap">
                <button
                    className="bg-red-600 hover:bg-red-700 px-2 py-2 rounded-md"
                    onClick={() => {
                        deleteTask(task._id);
                    }} >Eliminar</button>

                <Link
                    className="bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-md"
                    to={`/tasks/${task._id}`}>Editar</Link>
            </div>
                <p className="text-slate-400 text-sm my-2">{dayjs.utc(task.date).format("DD/MM/YYYY")}</p>
        </div>
    );
}

export default TaskCard;
