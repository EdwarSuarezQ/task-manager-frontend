import { useTasks } from "../context/TasksContext";

function HomePage() {
  const { tasks } = useTasks();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] px-6">
      <h1 className="text-3xl font-bold text-center text-white mb-4">
        Bienvenido a tu gestor de tareas
      </h1>
      <p className="text-slate-400 text-center mb-6">
        Organiza tus pendientes, guarda tus ideas y mantente productivo.
      </p>

      <div className="flex justify-center mb-6">
        <a
          href="/tasks"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
        >
          Ver mis tareas
        </a>
      </div>

      <div className="bg-zinc-800 p-6 rounded-md w-full max-w-2xl"></div>
    </div>
  );
}

export default HomePage;
