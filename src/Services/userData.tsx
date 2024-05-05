import { jwtDecode } from "jwt-decode";

interface User {
    sub: string
}

export const getUserData = () => {
    if (localStorage.getItem('userData')) {
        const user: User = jwtDecode(localStorage.getItem('userData')! as string);
        return {user, token: localStorage.getItem('userData')};
    }
    else {
        return null;
    }
}

export const setUserData = (data: any) => {
    localStorage.setItem('userData', data);
}


export const removeUserData = () => {
    localStorage.removeItem('userData');
    return null;
}