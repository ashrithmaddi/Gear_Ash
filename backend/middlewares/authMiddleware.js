const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(403).json({ error: "Access denied, no token provided" });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Admin access required" });
    next();
};

exports.isInstructor = (req, res, next) => {
    if (req.user.role !== "instructor") return res.status(403).json({ error: "Instructor access required" });
    next();
};
