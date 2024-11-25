
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const TOKEN_SECRET = process.env.JWT_SECRET;

export const AdminAuth = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        res.status(401).json({ error: { message: "No tienes permiso"} });
    }

    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: { message: "No tienes permiso"} });
        }

        const decodedToken = decoded;

        req._id = decodedToken._id;
        req.rol = decodedToken.rol;

        if (req.rol !== "Admin") {
            return res.status(403).json({ error: { message: "No tienes permiso" } });
        }

        next();
    });
};
