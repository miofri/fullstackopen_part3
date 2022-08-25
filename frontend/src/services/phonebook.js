import axios from 'axios'
// import React from 'react'
const baseUrl = '/api/persons'

const getAll = () => {
	const request = axios.get(baseUrl)
	// console.log(request.then(response => response.data));
	return request.then(response => response.data)
}

const createPerson = (personObj) => {
	const request = axios.post(baseUrl, personObj)
	return request
		.then(response => response.data)
}

const deletePerson = (id) => {
	const request = axios.delete(`${baseUrl}/${id}`)
	return request.then(response => response.data)
}

const updateNumber = (changedNumber, id) => {
	console.log(changedNumber, ` and id is ${id}`)
	const request = axios.put(`${baseUrl}/${id}`, changedNumber)
	return request.then(response => response.data)
}

const phonebookServices = { getAll, createPerson, deletePerson, updateNumber }

export default phonebookServices
