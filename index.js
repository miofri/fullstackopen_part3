const { request, response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv').config()
const People = require('./models/people')
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// Morgan-post section

// Custom morgan token('token name', function callback). I used res since using req will mess with the app.post's body and set it to undefined.)
morgan.token('resbody', function (res) {
	if (res.body)
		return JSON.stringify(res.body)
})
// Need a var outside of the post scope to use in getBody func.
let body2
// Calling getBody will assign app.post's body to the response, so that morgan.token can use it for :resbody.
app.use(getBody)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :resbody'))


app.get('/', (request, response) => {
	response.send('<h1>Hello world</h1>')
})

app.get('/api/persons', (request, response) => {
	People.find({})
		.then(person => {
			response.json(person)
		})
})

app.get('/api/persons/:id', (request, response) => {
	People.findById(request.params.id)
		.then(num => {
			if (num) { response.json(num) }
			else { response.status(404).end() }
		})
		.catch((error) => next(error))
})

app.get('/info', (request, response) => {
	const x = People.find({})
		.then(response => response.length)
		.then((res) => {
			let curTime = new Date()
			response.send(`<p> phonebook has info for ${res} people </p>
	<p>${curTime}</p>`)
		})
})

app.delete('/api/persons/:id', (request, response, next) => {
	People.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	const num = new People({
		name: body.name,
		number: body.number,
	})

	num.save()
		.then(savedNum => {
			response.json(savedNum)
		})
		.catch(error => next(error))

	body2 = body
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	console.log(typeof body.number)

	let re = /[0-9]{2,3}-[0-9]{7,}/

	if (re.test(body.number)) {

		const person = {
			name: body.name,
			number: body.number,
		}

		People.findByIdAndUpdate(request.params.id, person, { new: true })
			.then(person => {
				if (person) {
					response.json(person)
				}
				else {
					response.status(404).end()
				}
			})
			.catch(error => next(error))
	}
	else {
		response.status(400).send({ error: 'malformatted number' })
		next()
	}
})

function getBody(req, res, next) {
	res.body = body2
	next()
}

const errorHandler = (error, request, response, next) => {
	// console.error(error.name)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
	else if (error.name === 'ValidationError') {
		return response.status(400).send(error.message)
	}
	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
})

