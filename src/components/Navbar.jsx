import { Link } from "react-router-dom";
import { useAuth } from "../context/AuhtContext";

function Navbar() {
    const { isAuthenticated, logout, user } = useAuth();
    return (
        <nav className="flex items-center justify-between bg-zinc-800 p-4 ">
            <Link to='/'>
                <h1 className="text-3xl font-bold"> Gestion de Tareas </h1>
            </Link>
            <ul className="flex gap-x-2">
                {isAuthenticated ? (
                    <>
                        <li>
                            Bienvenido, {user.username}
                        </li>
                        <li>
                            <Link to='/add-task'
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                            >Nueva Tarea</Link>
                        </li>
                        <li>
                            <Link to='/'
                                onClick={() => {
                                    logout();
                                }}
                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
                            >Cerrar Sesion</Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to='/login'
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                            >Inisiar Sesion</Link>
                        </li>
                        <li>
                            <Link to='/register'
                                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
                            >Registrarse</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;