import { useEffect } from "react";
import { useTasks } from "../context/TasksContext";
import { TaskCard } from "../components/TaskCard";

function TasksPage () {
  const { getTasks, tasks } = useTasks();

  useEffect(() => {
    getTasks()
  }, [])

  if(tasks.length === 0) return <h1 className="text-white text-2xl font-bold text-center mt-10">No hay tareas</h1>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {
          tasks.map((task) => (
            <TaskCard task={task} key={task._id}/> 
          ))
        }
      </div>
    </div>
  );
}

export default TasksPage;
