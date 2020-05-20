const router = require("express").router;
const {
  deleteComment,
  getComments,
  notFound,
  postComment,
  patchComment,
} = require("./controllers");
const makeCallback = "../express-callback";

dotenv.config();

router.post("/vendor", makeCallback(postComment));
router.delete("/vendor/:id", makeCallback(deleteComment));
router.delete("/vendor", makeCallback(deleteComment));
router.patch("/vendor/:id", makeCallback(patchComment));
router.patch("/vendor", makeCallback(patchComment));
router.get("/vendor", makeCallback(getComments));
router.use(makeCallback(notFound));

module.exports = router;
