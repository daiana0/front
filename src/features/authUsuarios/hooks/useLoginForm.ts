import { useState } from 'react';
import { authUsuarioService } from '../service/authUsuario.service';
import type { AuthUser } from '../dto/authUsuario.dto';

export const useLoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateEmail = (val: string) => {
        if (!val) {
            setEmailError('El email es obligatorio');
            return false;
        }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(val)) {
            setEmailError('Formato de email inválido (ej: usuario@issrc.edu)');
            return false;
        }
        setEmailError('');
        return true;
    };

    // Para login, solo verificamos que la contraseña no esté vacía.
    // (La fortaleza de la contraseña se valida en el registro, no en el inicio de sesión)
    const validatePassword = (val: string) => {
        if (!val) {
            setPasswordError('La contraseña es obligatoria');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const handleSubmit = async (
        e: React.FormEvent,
        onSuccess: (user: AuthUser) => void
    ) => {
        e.preventDefault();
        const isEmailValid = validateEmail(email);
        const isPassValid = validatePassword(password);
        if (!isEmailValid || !isPassValid) return;

        setLoading(true);
        setError(null);
        try {
            const user = await authUsuarioService.login({
                email,
                contrasenia: password,
                rol: 'USUARIO',
            });
            onSuccess(user);
        } catch (err) {
            const message = err instanceof Error
                ? err.message
                : 'Credenciales incorrectas. Por favor, verifique sus datos.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        loading,
        error,
        setError,
        emailError,
        passwordError,
        validateEmail,
        validatePassword,
        handleSubmit,
    };
};