import React from 'react'

const Filter = ({ handleFilter }) => {
	return (
		<>
			Filter shown with <input onChange={handleFilter} />
		</>
	)
}

export default Filter
