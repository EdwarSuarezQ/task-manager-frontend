import { useEffect } from "react";
import { useTasks } from "../context/TasksContext";
import { TaskCard } from "../components/TaskCard";

function TasksPage () {
  const { getTasks, tasks } = useTasks();

  useEffect(() => {
    getTasks()
  }, [])

  if(tasks.length === 0) return <h1>No hay tareas</h1>;

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 p-2">
      {
        tasks.map((task) => (
          <TaskCard task={task} key={task._id}/> 
        ))
      }
    </div>
  );
}

export default TasksPage;
