import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuhtContext';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function RegisterPage() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup, isAuthenticated, errors: registerErrors } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate("/tasks");
    }, [isAuthenticated]);

    const onSubmits = handleSubmit(async (values) => {
        signup(values);
    });

    return (
        <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
            <div className="bg-zinc-800 max-w-md p-10 rounded-md">
                {
                    registerErrors.map((error, i) => (
                        <div className='bg-red-500 text-white p-4 rounded-md my-2 text-center' key={i}>
                            {error}
                        </div>
                    ))
                }

                <h1 className="text-2xl font-bold my-2">Registrarse</h1>
                <form onSubmit={onSubmits}>
                    <input type="text" {...register("username", { required: true })}
                        className={ `w-full border bg-zinc-700  text-white px-4 py-6 rounded-md my-2 
                        ${errors.username && "border-red-500 text-red-500 placeholder-red-500"}` }
                        placeholder={errors.username ? 'Se requiere un nombre de usuario' : 'Nombre de usuario'}
                    />
                    
                    <input type="email" {...register("email", { required: true })}
                        className={ `w-full border bg-zinc-700  text-white px-4 py-6 rounded-md my-2
                        ${errors.email && "border-red-500 text-red-500 placeholder-red-500"} ` }
                        placeholder={errors.email ? 'Se requiere un correo electronico' : 'Correo electronico'}
                    />
                
                    <div className="relative group">
                        <input type={showPassword ? "text" : "password"} {...register("password", { required: true })}
                            className={ `w-full border bg-zinc-700 text-white px-4 py-6 rounded-md my-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${errors.password ? "border-red-500 text-red-500 placeholder-red-500" : "border-zinc-700"} ` }
                            placeholder={errors.password ? 'Se requiere una contraseña' : 'Contraseña'}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors z-10"
                        >
                            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                        </button>
                    </div>

                    <button className='w-full hover:bg-zinc-900 text-white px-4 py-6 rounded-md my-2'  >Registrarse</button>
                </form>
                <p className="text-zinc-500 flex gap-x-1 justify-center">
                    Ya tienes una cuenta?
                    <Link to='/login' className="text-sky-500 hover:text-sky-700">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
