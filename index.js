const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const PhonebookEntry = require('./models/phonebook-schema');
const url = process.env.MONGODB_URI;

mongoose
	.connect(url)
	.then(() => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message);
	});
mongoose.set('strictQuery', false);

morgan.token('body', (req) => {
	return JSON.stringify(req.body);
});

app.use(express.static('build'));
app.use(express.json());
app.use(cors());
app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/', (req, res) => {
	return res.send('<h1>Welcome to phonebook!</h1>');
});

app.get('/api/persons', (req, res, next) => {
	PhonebookEntry.find({})
		.then((result) => {
			res.json(result);
		})
		.catch((error) => {
			next(error);
		});
});

app.get('/api/persons/:id', (req, res, next) => {
	const id = req.params.id;
	PhonebookEntry.findById(id)
		.then((result) => {
			if (result) {
				return res.json(result);
			}
			return res.status(404).end();
		})
		.catch((error) => {
			next(error);
		});
});

app.post('/api/persons', async (req, res, next) => {
	const findDuplicate = async () => {
		const duplicate = await PhonebookEntry.find({
			name: req.body.name,
		});
		if (duplicate.length > 0) {
			return true;
		}
		return false;
	};
	const isDuplicate = await findDuplicate();
	if (isDuplicate) {
		return res.json({
			error: 'name must be unique',
		});
	}
	const newPhonebookEntry = new PhonebookEntry({
		name: req.body.name,
		number: req.body.number,
	});
	newPhonebookEntry
		.save()
		.then((result) => {
			console.log('new entry saved!');
			res.json(result).status(201).end();
		})
		.catch((error) => {
			next(error);
		});
});

app.put('/api/persons/:id', async (req) => {
	const { name, number } = req.body;
	PhonebookEntry.findByIdAndUpdate(
		req.params.id,
		{ name, number },
		{ new: true, runValidators: true, context: 'query' }
	);
});

app.delete('/api/persons/:id', async (req, res, next) => {
	PhonebookEntry.findByIdAndDelete(req.params.id)
		.then((result) => {
			if (result) {
				return res.status(204).end();
			}
			return res.status(404).end();
		})
		.catch((error) => {
			next(error);
		});
});

const errorHandler = (error, req, res, next) => {
	console.error(error.stack);
	if (error.name === 'CastError') {
		return res.status(400).json({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return res
			.status(403)
			.send({ errorName: error.name, errorMessage: error.message });
	}
	next(error);
};

app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
