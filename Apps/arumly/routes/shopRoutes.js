const { Router } = require("express");

const shopViews = require("../views/shopViews");

const router = Router();

/* ================== 
        GET 
================== */
router.get("/products/:limit", shopViews.getProductsByLimit);
router.get("/product/:id", shopViews.getProductById);
router.get("/products/type/:obj_tags", shopViews.getProductsByTags);

/* ================== 
        POST 
================== */
// router.post("/create/contact", shopViews.createContentForm);

/* ================== 
        PATCH 
================== */
// router.patch("/account/:uid/update/info", isAuth.isSelf_UID, shopViews.updateAccountInfo); // Update Users By Id

module.exports = router;
