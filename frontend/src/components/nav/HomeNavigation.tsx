import { Link } from 'react-router-dom'

export default function HomeNavigation() {
    return (
        <>
            <Link
                className='text-white p-2 uppercase font-black cursor-pointer text-xs'
                to='/auth/login'
            >
            Iniciar Sesión
            </Link>

            <Link
                className='bg-lime-500 text-slate-800 p-2 uppercase font-black cursor-pointer text-xs rounded-lg'
                to='/auth/register'
            >
            Registrarme
            </Link>
        </>
    );
}