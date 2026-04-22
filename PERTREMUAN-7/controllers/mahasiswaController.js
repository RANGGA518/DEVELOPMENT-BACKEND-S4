const Mahasiswa = require("../models/Mahasiswa")

module.exports = {

  // READ
  viewMahasiswa: async (req, res) => {
    try {
      const mahasiswa = await Mahasiswa.find()
      const alertMessage = req.flash("alertMessage")
      const alertStatus = req.flash("alertStatus")
      const alert = { message: alertMessage, status: alertStatus }

      res.render("index", {
        mahasiswa,
        alert,
        title: "CRUD"
      })
    } catch (error) {
      res.redirect("/mahasiswa")
    }
  },

  // CREATE
  addMahasiswa: async (req, res) => {
    try {
      const { nama, nim, jurusan, alamat } = req.body
      await Mahasiswa.create({ nama, nim, jurusan, alamat })

      req.flash("alertMessage", "Success add data mahasiswa")
      req.flash("alertStatus", "success")
      res.redirect("/mahasiswa")

    } catch (error) {
      req.flash("alertMessage", error.message)
      req.flash("alertStatus", "danger")
      res.redirect("/mahasiswa")
    }
  },

  // UPDATE
  editMahasiswa: async (req, res) => {
    try {
      const { id, nama, nim, jurusan, alamat } = req.body

      await Mahasiswa.updateOne(
        { _id: id },
        { nama, nim, jurusan, alamat }
      )

      req.flash("alertMessage", "Success update data mahasiswa")
      req.flash("alertStatus", "success")
      res.redirect("/mahasiswa")

    } catch (error) {
      req.flash("alertMessage", error.message)
      req.flash("alertStatus", "danger")
      res.redirect("/mahasiswa")
    }
  },

  // DELETE
  deleteMahasiswa: async (req, res) => {
    try {
      const { id } = req.params
      await Mahasiswa.deleteOne({ _id: id })

      req.flash("alertMessage", "Success delete data mahasiswa")
      req.flash("alertStatus", "warning")
      res.redirect("/mahasiswa")

    } catch (error) {
      req.flash("alertMessage", error.message)
      req.flash("alertStatus", "danger")
      res.redirect("/mahasiswa")
    }
  }
}