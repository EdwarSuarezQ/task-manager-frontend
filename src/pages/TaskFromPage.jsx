import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

function TaskFromPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { createTask, getTask, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();

  const today = dayjs().format("YYYY-MM-DD");
  const currentTime = dayjs().format("HH:mm");

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const task = await getTask(params.id);
        setValue("title", task.title);
        setValue("description", task.description);
        setValue("date", dayjs(task.date).utc().format("YYYY-MM-DD"));
        setValue("time", dayjs(task.date).utc().format("HH:mm"));
      } else {
        setValue("date", today);
        setValue("time", currentTime);
      }
    }
    loadTask();
  }, []);

  const onSubmits = handleSubmit((data) => {
    const dateTimeString = `${data.date}T${data.time}`;

    const dataValid = {
      ...data,
      date: data.date
        ? dayjs.utc(dateTimeString).format()
        : dayjs.utc().format(),
    };

    if (params.id) {
      updateTask(params.id, dataValid);
    } else {
      createTask(dataValid);
    }
    navigate("/tasks");
  });

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md p-10 rounded-md">
        <form onSubmit={onSubmits}>
          <label htmlFor="title">Título</label>
          <input
            id="title"
            type="text"
            {...register("title", { required: true })}
            className={`w-full border bg-zinc-700 text-white px-4 py-2 rounded-md my-2
                        ${
                          errors.title &&
                          "border-red-500 text-red-500 placeholder-red-500"
                        } `}
            placeholder={
              errors.title ? "Se requiere un título" : "Ej: Comprar la cena"
            }
            autoFocus
          />
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            rows="5"
            {...register("description", { required: true })}
            className={`w-full border bg-zinc-700 text-white px-4 py-2 rounded-md my-2
                        ${
                          errors.description &&
                          "border-red-500 text-red-500 placeholder-red-500"
                        } `}
            placeholder={
              errors.description
                ? "Se requiere una descripción"
                : "Ej: Ir al supermercado y comprar la cena"
            }
          ></textarea>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date">Fecha</label>
              <input
                id="date"
                type="date"
                min={today}
                {...register("date", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
              />
            </div>
            <div>
              <label htmlFor="time">Hora</label>
              <input
                id="time"
                type="time"
                {...register("time", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
              />
            </div>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
            Guardar
          </button>
          <button
            type="button"
            onClick={() => navigate("/tasks")}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md ml-2"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskFromPage;
