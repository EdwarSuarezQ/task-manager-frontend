import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuhtContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function LoginPage () {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, errors: signinErrors, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const onSubmits = handleSubmit((data) => {
    signin(data);
  })

  useEffect(() => {
    if(isAuthenticated) navigate('/tasks');
  },[isAuthenticated])

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center p-4">
      <div className="bg-zinc-800 w-full max-w-md p-6 sm:p-10 rounded-md shadow-xl border border-zinc-700">
        {
          signinErrors.map((error, i) => (
            <div className='bg-red-500 text-white p-4 rounded-md my-2 text-center' key={i}>
              {error}
            </div>
          ))
        }

        <h1 className="text-2xl font-bold my-2">Iniciar Sesion</h1>
        <form onSubmit={onSubmits}>
          <input type="email" {...register("email", { required: true })}
            className={`w-full border bg-zinc-700  text-white px-4 py-6 rounded-md my-2
            ${errors.email && "border-red-500 text-red-500 placeholder-red-500"} `}
            placeholder={errors.email ? 'Se requiere un correo electronico' : 'Correo electronico'}
          />

          <div className="relative">
            <input type={showPassword ? "text" : "password"} {...register("password", { required: true })}
              className={`w-full border bg-zinc-700 text-white px-4 py-6 rounded-md my-2 pr-12
              ${errors.password ? "border-red-500 text-red-500 placeholder-red-500" : "border-zinc-700"} `}
              placeholder={errors.password ? 'Se requiere una contraseña' : 'Contraseña'}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button className='w-full hover:bg-zinc-900 text-white px-4 py-6 rounded-md my-2'>Iniciar Sesion</button>
        </form>
        <p className="text-zinc-500 flex gap-x-1 justify-center">
          No tienes una cuenta? 
          <Link to='/register' className="text-sky-500 hover:text-sky-700"> Registrate </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
