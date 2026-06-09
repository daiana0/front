import { AUTH_TOKEN_STORAGE_KEY } from "@/core/constants/auth.storage";
import { decodeJwtPayload } from "@/features/authEstudiantes/utils/jwt";

export const getDataByToken = () => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) {
        return null;
    }
    const payload = decodeJwtPayload(token);
    return payload;
}