import { verifyJwtGuardian } from "./guardian.middleware.js";
import { verifyJwtWomen } from "./women.middleware.js";

export const verifyJwtCombined = async (req, res, next) => {
    await verifyJwtWomen(req, res, async (err) => {
        if (err) {
            await verifyJwtGuardian(req, res, (err) => {
                if (err) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                next();
            });
        } else {
            next();
        }
    });
};
