import './App.css';
import './index.css';
import { useState } from 'react';
import Filter from './components/Filter'


const App = () => {
  const [country, setCountry] = useState('')
  const handleChange = (event) => {
    setCountry(event.target.value)
  }

  return (
    <div>
      <div>
        find countries: <input value={country} onChange={handleChange}/>
      </div>
      <Filter countryString={country}/>
    </div>
  )
}

export default App;