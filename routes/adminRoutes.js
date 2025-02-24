const express = require("express");
const {fetchPendingSellers, approveSeller, rejectSeller} = require("../controllers/adminController");

const router = express.Router();

// route to get pending requests

router.get("/sellers/pending", fetchPendingSellers);

// route to approve seller
router.put("/sellers/approve/:id", approveSeller)

// route to reject sellers
router.put("/sellers/reject/:id", rejectSeller);




module.exports = router;