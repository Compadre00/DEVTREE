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
        </>
    );
}