const jwt = require("jsonwebtoken")
// const bcrypt = require("bcrypt")
const db = require("../../db")
const cookieParser = require("cookie-parser")
const { encrypt, uuid, sendToken, sendUUID } = require("../../lib/jwt")

require("dotenv").config()

module.exports = async (req, res) => {
	const { email, password } = req.body
	const authenticatedUser = await db.authenticateUser(email, password)

	try {
		if (!authenticatedUser) {
			return res.status(400).send({ email, message: "not-authorized" })
		}
		const { id } = authenticatedUser[0].dataValues
		const sortedUUID = uuid()
		const encryptedUUID = await encrypt(sortedUUID, process.env.ENCRYPTION_KEY)

		const token = jwt.sign({ id: id, uuid: encryptedUUID }, process.env.JWT_SECRET, {
			expiresIn: "1d",
			issuer: "urscene",
		})

		sendToken(res, token)
		sendUUID(res, sortedUUID)
		return res.status(200).json({ message: "log-in-successfully" })
	} catch (err) {
		res.status(500).json({ message: "server-error" })
	}
}
