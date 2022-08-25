require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.URI

console.log('connecting to:', url)
// if (process.argv.length < 3) {
// 	console.log('Password needed. Arg format: node mongo.js <passw>');
// }

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true
	},
	number: {
		type: String,
		validate: {
			validator: (v) => {
				return /[0-9]{2,3}-[0-9]{7,}/.test(v)
			},
			message: 'The number you entered is not valid!',
		},
		message: 'This is not a valid phone number',
		required: true
	},
	id: Number,
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const People = mongoose.model('People', personSchema)

mongoose
	.connect(url)
	.then(() => {
		console.log('connected')

		if (process.argv.length > 4) {
			const people = new People({
				name: process.argv[3],
				number: process.argv[4],
			})
			people.save()
				.then(
					() => {
						console.log(`added ${process.argv[3]} ${process.argv[4]} to phonebook`)
					})
		}
	})
	.catch((err) =>
		console.log(err)
	)

module.exports = mongoose.model('People', personSchema)

