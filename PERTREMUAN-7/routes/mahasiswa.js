const router = require("express").Router()
const mahasiswaController = require("../controllers/mahasiswaController")

// READ
router.get("/", mahasiswaController.viewMahasiswa)

// CREATE
router.post("/", mahasiswaController.addMahasiswa)

// UPDATE
router.put("/", mahasiswaController.editMahasiswa)

// DELETE
router.delete("/:id", mahasiswaController.deleteMahasiswa)

module.exports = router