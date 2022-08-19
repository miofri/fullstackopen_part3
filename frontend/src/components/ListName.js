import React from 'react'

const NameAndButton = ({ name, number, handleDelete, id }) => {
	return (
		<div>
			<li>{name} {number}
				<button onClick={() => handleDelete(id, name)}>
					delete
				</button></li>
		</div>
	)
}

const ListName = ({ persons, handleDelete }) => {
	return (
		<ul>
			{
				persons.map(x => <NameAndButton key={x.id} id={x.id} name={x.name} number={x.number} handleDelete={handleDelete} />)
			}
		</ul>
	)
}

export default ListName
