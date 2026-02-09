import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuhtContext";
import { useTasks } from "../context/TasksContext";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  PlusCircle,
  ListTodo,
  TrendingUp,
  Calendar,
} from "lucide-react";

function HomePage() {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    dueToday: 0,
  });

  useEffect(() => {
    if (tasks.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const completed = tasks.filter((t) => t.completed).length;
      const pending = tasks.filter((t) => !t.completed).length;

      let overdue = 0;
      let dueToday = 0;

      tasks.forEach((task) => {
        if (!task.completed && task.date) {
          const taskDate = new Date(task.date);
          taskDate.setHours(0, 0, 0, 0);

          if (taskDate < today) {
            overdue++;
          } else if (taskDate.getTime() === today.getTime()) {
            dueToday++;
          }
        }
      });

      setStats({
        total: tasks.length,
        completed,
        pending,
        overdue,
        dueToday,
      });
    }
  }, [tasks]);

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statCards = [
    {
      title: "Total de Tareas",
      value: stats.total,
      icon: ListTodo,
      color: "bg-blue-500",
      textColor: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Completadas",
      value: stats.completed,
      icon: CheckCircle2,
      color: "bg-green-500",
      textColor: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Pendientes",
      value: stats.pending,
      icon: Clock,
      color: "bg-yellow-500",
      textColor: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Vencidas",
      value: stats.overdue,
      icon: AlertCircle,
      color: "bg-red-500",
      textColor: "text-red-400",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-100px)] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            ¡Hola, {user?.username || "Usuario"}!
          </h1>
          <p className="text-gray-400 text-lg">
            Aquí está el resumen de tus tareas
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 hover:border-zinc-600 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <span className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm font-medium">
                  {stat.title}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Completion Rate */}
          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">
                Tasa de Completitud
              </h2>
            </div>
            <div className="flex items-end gap-4">
              <span className="text-5xl font-bold text-purple-400">
                {completionRate}%
              </span>
              <p className="text-gray-400 mb-2">
                {stats.completed} de {stats.total} tareas completadas
              </p>
            </div>
            <div className="mt-4 bg-zinc-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-orange-400" />
              <h2 className="text-xl font-bold text-white">Tareas de Hoy</h2>
            </div>
            <div className="space-y-3">
              {stats.dueToday > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Vencen hoy</span>
                    <span className="text-2xl font-bold text-orange-400">
                      {stats.dueToday}
                    </span>
                  </div>
                  <Link
                    to="/tasks"
                    className="block w-full text-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                  >
                    Ver tareas de hoy
                  </Link>
                </>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <p className="text-gray-400">
                    ¡No tienes tareas para hoy!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h2 className="text-xl font-bold text-white mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/add-task"
              className="flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors group"
            >
              <PlusCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-white font-semibold">Crear Nueva Tarea</h3>
                <p className="text-blue-100 text-sm">
                  Agrega una tarea a tu lista
                </p>
              </div>
            </Link>
            <Link
              to="/tasks"
              className="flex items-center gap-3 p-4 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors group border border-zinc-600"
            >
              <ListTodo className="w-6 h-6 text-gray-300 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-white font-semibold">Ver Todas las Tareas</h3>
                <p className="text-gray-400 text-sm">
                  Gestiona tus {stats.total} tareas
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Alert for overdue tasks */}
        {stats.overdue > 0 && (
          <div className="mt-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-red-400 font-semibold mb-1">
                ¡Atención! Tienes {stats.overdue} tarea{stats.overdue > 1 ? "s" : ""} vencida{stats.overdue > 1 ? "s" : ""}
              </h3>
              <p className="text-red-300 text-sm mb-2">
                Revisa tus tareas pendientes para ponerte al día
              </p>
              <Link
                to="/tasks"
                className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
              >
                Ver tareas vencidas
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
