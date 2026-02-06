import { useEffect, useState } from "react";
import { useTasks } from "../context/TasksContext";
import { TaskCard } from "../components/TaskCard";
import Pagination from "../components/Pagination";

function TasksPage () {
  const { getTasks, tasks } = useTasks();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    getTasks()
  }, [])

  if(tasks.length === 0) return <h1 className="text-white text-2xl font-bold text-center mt-10">No hay tareas</h1>;

  // Lógica de paginación
  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTasks = tasks.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {
          currentTasks.map((task) => (
            <TaskCard task={task} key={task._id}/> 
          ))
        }
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={tasks.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}

export default TasksPage;
