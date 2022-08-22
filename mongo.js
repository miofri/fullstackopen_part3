const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('Password needed. Arg format: node mongo.js <passw>');
}

const passw = process.argv[2]

const url = `mongodb+srv://slvkesuma:${passw}@cluster0.smqtqch.mongodb.net/phoneApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
	id: Number,
})

const People = mongoose.model('People', personSchema)

mongoose
	.connect(url)
	.then(() => {
		console.log("connected")

		if (process.argv.length > 4) {
			const people = new People({
				name: process.argv[3],
				number: process.argv[4],
			})
			people.save()
				.then(
					() => {
						console.log(`added ${process.argv[3]} ${process.argv[4]} to phonebook`);
					})
			return mongoose.connection.close()
		}
		else {
			People.find({}).then(
				(result) => {
					console.log('phonebook:')
					result.forEach(item => {
						console.log(item.name, item.number)
					})
					return mongoose.connection.close()
				})
		}
	})

	.catch((err) =>
		console.log(err)
	)


