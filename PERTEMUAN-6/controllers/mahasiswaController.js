const Mahasiswa = require("../models/Mahasiswa")

module.exports = {
    viewMahasiswa: async (req, res) => {
        try {
            const mahasiswa = await Mahasiswa.find()
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")
            const alert = {message: alertMessage, status: alertStatus}
            res.render("index", {
                mahasiswa, alert, title: "CRUD",
            })} catch (error) {
                res.redirect("/mahasiswa")
            }
        }
    }
