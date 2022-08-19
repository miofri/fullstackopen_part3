import React from 'react'

const InputName = ({ persons, newName, handlePersonChange }) => {
	return (
		<div>
			Name: <input value={newName} onChange={handlePersonChange} />
		</div>
	)
}

const InputNumber = ({ newNumbers, handleNumberChange }) => {
	return (
		<div>
			Number: <input value={newNumbers} onChange={handleNumberChange} />
		</div>
	)
}

const PersonForm = ({ persons, newName, handlePersonChange, newNumbers, handleNumberChange }) => {
	return (
		<>
			<InputName persons={persons} newName={newName} handlePersonChange={handlePersonChange} />
			<InputNumber handleNumberChange={handleNumberChange} newNumbers={newNumbers} />
		</>
	)
}

export default PersonForm
