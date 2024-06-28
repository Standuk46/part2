import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import personService from './services/persons'

const Notification = ({message, type}) => {

  if (message === null) {
    return null
  }

  return (
    <div className = {type}>
      {message}
    </div>
  )
}



const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('')
  const [notification, setNotification] = useState({message: null, type: ''})

  useEffect(() => {
    personService
      .getAll()
      .then(initianalPersons => {
        setPersons(initianalPersons)
      })
  }, [])
  
  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName, number: newNumber,
    }
    let hasDuplicate = persons.some(person => person.name === newName)

    if (hasDuplicate) {
      if (window.confirm('You want to update number?')){
        const existingPerson = persons.find(p => p.name === newName)
        const changedPerson = {...existingPerson, number: newNumber}
        const id = existingPerson.id

        personService
          .update(id ,changedPerson)
          .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotification({
            message : `'${newName}' number was changed to ${newNumber}`,
            type : 'success'
          }
          )
          setTimeout(() => {
            setNotification({message: null, type: ''})
          }, 5000)
          })
          .catch(error => {
            setNotification({
              message: `Information of ${newName} has already been removed from server`,
              type: 'unsuccessful'
            }
            )
            setPersons(persons.filter(person => person.id !== id))
            setTimeout(() => {
              setNotification({message: null, type: ''})
            }, 5000)
          })
      }
    } else {
      setPersons(persons.concat(nameObject))
        personService
          .create(nameObject)
          .then(returnedNote => {
            setPersons(persons.concat(returnedNote))
            setNewName('')
            setNewNumber('')
            setNotification({
              message :`'${newName}' added to phonebook`,
              type: 'success'
          })
            setTimeout(() => {
              setNotification({message: null, type: ''})
            }, 5000)  
          })
      } 
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleDeleteOf = (id) => {
    const personObj = persons.find(person => person.id === id)
    if (window.confirm('Are you sure?')){
      personService
        .deleteUpd(id)
        .then(returnedNote => {
          setPersons(persons.filter(person => person.id !== id))
          setNotification({
            message: `Person '${personObj.name}' was deleted from phonebook`,
            type: 'successful'
          })
          setTimeout(() => {
            setNotification({message: null, type: ''})
          }, 5000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type}/>
      <Filter handleChange={handleFilterChange} value = {filter}/>
      <h2>add a new</h2>
      <PersonForm 
      addPerson={addPerson} 
      newName={newName} 
      handleNameChange={handleNameChange} 
      newNumber={newNumber} 
      handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons} 
        string={filter}
        onDelete={handleDeleteOf}
        />
    </div>
  )
}

export default App