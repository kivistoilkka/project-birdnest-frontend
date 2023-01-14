import { useEffect, useState } from 'react'
import droneService from './services/droneService'

const App = () => {
  const [drones, setDrones] = useState({})

  useEffect(() => {
    droneService.getAll().then(initialDrones => setDrones(initialDrones))
  })

  return (
    <div>
      <h1>Project Birdnest</h1>
      <ul>
        {Object.keys(drones).map((serial) => (
          <li key={serial}><b>{serial}</b>: Closest distance {Math.round(drones[serial].distance/1000)} meters</li>
        ))}
      </ul>
    </div>
  )
}

export default App
