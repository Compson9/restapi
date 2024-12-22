const validate = (token: any) => {
    const validateToken = true; // validate token
    if(!validateToken || !token ) {
        return false;
    }
}

export function authMiddleware(request: Request): any {
    const token = request.headers.get("Authorization")?.split("")[1];
    return {isValid: validate(token)};
    
   
}
