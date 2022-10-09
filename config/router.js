const { Router } = require("express");

const multerRoutes = require("../Apps/app/routes/multerRoutes");

// USER
const usersRoutes = require("../Apps/users/routes/usersRoutes");
const authRoutes = require("../Apps/users/routes/authRoutes");
const formsRoutes = require("../Apps/forms/routes/formsRoutes");

// ARUMLY
const shopRoutes = require("../Apps/arumly/routes/shopRoutes");
const checkoutRoutes = require("../Apps/arumly/routes/checkoutRoutes");

const router = Router();

// ADMIN SITES
router.use("/admin", (req, res) => {
	res.send("Admin Routes");
});

router.use("/api/v1", multerRoutes); // users

// USERS
router.use("/api/v1/users", usersRoutes); // users
router.use("/api/v1/auth-user", authRoutes); // auth

// APP
router.use("/api/v1/forms", formsRoutes);

// ARUMLY
router.use("/api/v1/arumly/shop", shopRoutes);
router.use("/api/v1/arumly/checkout", checkoutRoutes);

module.exports = router;
