import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'
import droneService from './services/droneService'

const App = () => {
  const [drones, setDrones] = useState({})
  const socket = io({
    reconnection: false
  })

  useEffect(() => {
    droneService.getAll().then(initialDrones => setDrones(initialDrones))
  }, [])

  const tryReconnect = () => {
    setTimeout(() => {
      socket.io.open((err) => {
        if (err) {
          tryReconnect()
        } else {
          droneService.getAll().then(initialDrones => setDrones(initialDrones))
        }
      })
    }, 2000)
  }

  socket.io.on('close', tryReconnect)

  useEffect(() => {
    socket.on('dronesUpdated', (newDrones) => {
      setDrones(JSON.parse(newDrones))
    })
  }, [])

  return (
    <div>
      <h1>Project Birdnest</h1>
      <table>
        <thead>
          <tr>
            <th>Distance from nest</th>
            <th>Pilot name</th>
            <th>Email</th>
            <th>Phone number</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(drones).reverse().map((serial) => {
            const pilot = drones[serial].pilot
            let name = ''
            let email = ''
            let phoneNumber = ''
            if (pilot) {
              name = drones[serial].pilot.name
              email = drones[serial].pilot.email
              phoneNumber = drones[serial].pilot.phoneNumber
            }
            return (
              <tr key={serial}>
                <td>{Math.round(drones[serial].distance/1000)} m</td>
                <td>{name}</td>
                <td>{email}</td>
                <td>{phoneNumber}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default App
