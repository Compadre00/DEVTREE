import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { getUser } from "../api/DevTreeAPI";
import DevTree from "../components/DevTree";

export default function AppLayout() {

    const {data, isLoading, isError } = useQuery({
        queryFn: getUser,
        queryKey: ['user'],
        retry: 5,
        refetchOnWindowFocus: false
    });

    if (isLoading) return <p>Cargando...</p>;
    // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
    if (isError) return <Navigate to={'/auth/login'} />

    // Si el usuario está autenticado, mostrar el árbol de desarrollo
    if (data) return <DevTree data={data} />;
}