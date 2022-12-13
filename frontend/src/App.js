import { useState, useEffect } from 'react'
import axios from 'axios';
import Filter from './components/Filter'
import ListName from "./components/ListName"
import PersonForm from './components/PersonForm'
import phonebookServices from './services/phonebook'
import './index.css'
import styled, { css } from 'styled-components';

const NotificationStyle = styled.div`
	color: aquamarine;
	background-color: black;
	font-size: 20px;
	border-style: solid;
	width: 300px;
	text-align: center;
	margin-bottom: 15px;
`

const Notification = ({ message }) => {
	if (message === null)
		return (null)
	return (
		<NotificationStyle className='prompt'>
			{message}
		</NotificationStyle>
	)
}

const Error = ({ message }) => {
	if (message === null)
		return (null)
	return (
		<div className='err'>
			{message}
		</div>
	)
}

const App = () => {
	const [persons, setPersons] = useState([])
	const [newNumbers, setNumber] = useState('')
	const [newName, setNewName] = useState('')
	const [filtered, setFiltered] = useState('')
	const [promptMsg, setPromptMsg] = useState(null)
	const [errorMsg, setErrorMsg] = useState(null)

	useEffect(() => {
		phonebookServices.getAll()
			.then(response => setPersons(response))
	}, [])

	// for finding if name already existed in the phonebook
	const checkName = ({ persons }) => {
		let names = []
		names = persons.map(x => x.name)
		return (names.includes(newName))
	}

	// adding a new personObj to
	const addPerson = (event) => {

		event.preventDefault()

		if (checkName({ persons }) === true) {
			if (window.confirm(`${newName} is already added to the phonebook, replace old number with a new one?`)) {

				const changedPerson = persons.find(n => n.name === newName)
				const changedNumber = { ...changedPerson, number: newNumbers }

				return (phonebookServices.updateNumber(changedNumber, changedPerson.id)
					.then(response => {
						setPersons(persons.map(x => x.id !== changedNumber.id ? x : response))
						setPromptMsg(`updated ${response.name}'s number`)
						setTimeout(() => { setPromptMsg(null) }, 5000)
					})
					.catch(err => {
						setErrorMsg(`${changedPerson.name} is already deleted`)
						setTimeout(() => {
							setErrorMsg(null)
						}, 5000)
					}
					))
			}
			else {
				return event.preventDefault()
			}
		}

		const personObj = {
			name: newName,
			number: newNumbers,
		}

		phonebookServices.createPerson(personObj)
			.then(response => {
				setPersons(persons.concat(response))
				setNewName('')
				setNumber('')
				setPromptMsg(`added ${response.name}`)
				setTimeout(() => { setPromptMsg(null) }, 5000)
			})
			.catch(error => {
				console.log(error.response.data)
				setErrorMsg(error.response.data)
				setTimeout(() => { setErrorMsg(null) }, 5000)
			})

	}

	const handleDelete = (id, name) => {
		if (window.confirm(`Delete ${name}?`)) {
			phonebookServices.deletePerson(id)
				.then(
					setPersons(persons.filter(persons =>
						persons.id !== id)),
					setPromptMsg(`deleted ${name}`),
					setTimeout(() => { setPromptMsg(null) }, 5000)
				)
				.catch(err => {
					setErrorMsg(`${name} is already deleted`)
					setTimeout(() => {
						setErrorMsg(null)
					}, 5000)
				}
				)
		}

	}

	const handlePersonChange = (event) => {
		setNewName(event.target.value)
	}

	const handleNumberChange = (event) => {
		setNumber(event.target.value)
	}

	const handleFilter = (event) => {
		setFiltered(event.target.value)
	}

	const showAllNumbers = persons.filter(x => x.name.includes(filtered))

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={promptMsg} />
			<Error message={errorMsg} />
			<div>
				<Filter handleFilter={handleFilter} />
			</div>
			<h2>Add a new person:</h2>
			<form onSubmit={addPerson}>
				<div>
					<PersonForm persons={persons} newName={newName} handlePersonChange={handlePersonChange} handleNumberChange={handleNumberChange} newNumbers={newNumbers} />
				</div>
				<button type="submit">add</button>
			</form >
			<h2>Numbers</h2>
			<ListName persons={showAllNumbers} handleDelete={handleDelete} />
		</div >
	)
}

export default App
