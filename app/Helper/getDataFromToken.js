import jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
    try {
        // 1. Get the token from the cookies
        const token = request.cookies.get("authtoken")?.value ;
        console.log(token)
        
        if (!token) {
            throw new Error("No token found");
        }

        // 2. Verify the token using your secret
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Return the ID (assuming your payload has an 'id' field)
        return decodedToken.id;

    } catch (error) {
        throw new Error(error.message);
    }
}