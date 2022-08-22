const { Router } = require("express");

const checkoutViews = require("../views/checkoutViews");

const router = Router();

/* ================== 
        GET 
================== */
router.get("/cart/cart-items", checkoutViews.getCartItems);
router.get("/cart/cart-total", checkoutViews.getCartTotal);

/* ================== 
        POST 
================== */
router.post("/cart/create/cart-item", checkoutViews.createCartItem);

/* ================== 
        PATCH 
================== */
// router.patch("/account/:uid/update/info", isAuth.isSelf_UID, checkoutViews.updateAccountInfo); // Update Users By Id

/* ================== 
        DELETE 
================== */
router.delete("/cart/delete/cart-item/:id", checkoutViews.deleteCartItem); // Update Users By Id

module.exports = router;
