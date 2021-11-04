const db = require("../../db")
const { decrypt, isAuthorized } = require("../../lib/jwt")

require("dotenv").config()

module.exports = async (req, res) => {
	try {
		const userToken = isAuthorized(req)
		const { id } = userToken
		const user = await db.getUserById(id)
		const { email, nickname, image } = user.dataValues
		return res.status(200).json({ id, email, nickname, image })
	} catch (err) {
		res.status(500).json({ message: "server-error" })
	}
}
