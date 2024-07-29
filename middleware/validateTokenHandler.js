const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: "User is not authorized" });
                return; // Stop further execution
            }

            req.user = decoded.user; // Attach decoded token to the request object
            next(); // Proceed to the next middleware or route handler
        });
    } else {
        res.status(401).json({ message: "Authorization denied" });
    }
});

module.exports = validateToken;
