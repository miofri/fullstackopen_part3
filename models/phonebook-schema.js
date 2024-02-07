require('dotenv').config();
const mongoose = require('mongoose');

const phonebookSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
	},
	number: {
		type: String,
		validate: {
			validator: (v) => {
				return /^\d{2,3}-\d+$/.test(v);
			},
			message: (props) =>
				`${props.value} is not a valid phone number! Example: 09-1234556`,
		},
		required: true,
		minlength: 8,
	},
});

phonebookSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const PhonebookEntry = mongoose.model('PhonebookEntry', phonebookSchema);
module.exports = PhonebookEntry;
