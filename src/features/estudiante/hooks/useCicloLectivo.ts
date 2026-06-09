import { useState, useEffect } from 'react';
import { calificacionService } from '../service/calificaciones.service';

export const useCicloLectivo = () => {
    const [anio, setAnio] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCiclo = async () => {
            try {
                const data = await calificacionService.getCicloActivo();
                setAnio(data.anio);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCiclo();
    }, []);

    return { anio, loading, error };
};