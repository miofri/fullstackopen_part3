const { request, response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan');

let phonebook = [
	{
		"id": 1,
		"name": "Arto Hellas",
		"number": "040-123456"
	},
	{
		"id": 2,
		"name": "Ada Lovelace",
		"number": "39-44-5323523"
	},
	{
		"id": 3,
		"name": "Dan Abramov",
		"number": "12-43-234345"
	},
	{
		"id": 4,
		"name": "Mary Poppendieck",
		"number": "39-23-6423122"
	}
]

app.use(express.json())

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
	response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const number = phonebook.find(num => num.id === id)
	if (number) {
		response.json(number)
	}
	else {
		response.status(404).end()
	}
})

app.get('/info', (request, response) => {
	let len = phonebook.length
	let curTime = new Date()
	response.send(`<p> phonebook has info for ${len} people </p>
	<p>${curTime}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	phonebook = phonebook.filter(num => num.id !== id)

	response.status(204).end
})

const generateId = () => {
	let maxNum = 10000
	let possible_id = Math.floor(Math.random() * maxNum)

	let loopguard = 0

	// checking that there is no duplicate IDs
	while (loopguard < maxNum) {
		if ((phonebook.map(num => num.id)).includes(possible_id)) {
			possible_id = Math.floor(Math.random() * maxNum)
			loopguard++
		}
		else {
			return possible_id
		}
	}

	if (loopguard === maxNum) {
		console.log("All possible IDs had already been taken!")
	}
}

app.post('/api/persons', (request, response) => {
	const body = request.body

	if (!body.name || !body.number) {
		return (response.status(400).json({
			error: 'name or/and number are missing'
		}))
	}
	else if (
		(phonebook.map(data => data.name.toLowerCase())
			.includes(body.name.toLowerCase())
		)
	) {
		return (response.status(400).json({
			error: 'name already exists in the phonebook.'
		}))
	}

	const num = {
		id: generateId(),
		name: body.name,
		number: body.number,
	}

	phonebook = phonebook.concat(num)
	response.json(num)

	body2 = body
})

function getBody(req, res, next) {
	res.body = body2
	next()
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({
		error: "Not found"
	})
}

app.use(unknownEndpoint)

const PORT = 3002
app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
})
