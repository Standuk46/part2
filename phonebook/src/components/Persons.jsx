const Persons = ({persons, string, onDelete}) => {
    const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(string.toLowerCase()))
    const handleDeletePerson = (person) => {
      onDelete(person.id)
    }

    return (
      <>
        {filteredPersons.map((person)=> (
          <div key={person.name}>
            {person.name} {person.number} <button onClick={() => handleDeletePerson(person)}>delete</button>
          </div>
        )
        )}
      </>
    )
  
  }
  

export default Persons