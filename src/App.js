import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'
import droneService from './services/droneService'

const App = () => {
  const [drones, setDrones] = useState({})

  const tryReconnect = (socket) => {
    setTimeout(() => {
      socket.io.open((err) => {
        if (err) {
          tryReconnect()
        } else {
          droneService
            .getAll()
            .then((initialDrones) => setDrones(initialDrones))
        }
      })
    }, 2000)
  }

  // const updateDrones = (droneList) => {
  //   const updatedDrones = structuredClone(drones)
  //   droneList.forEach(drone => {
  //     console.log('Updated drone:', drone)
  //     updatedDrones[drone.serial] = drone
  //   })
  //   setDrones(updatedDrones)
  // }

  // const removeDrones = (droneList) => {
  //   const updatedDrones = structuredClone(drones)
  //   droneList.forEach(drone => {
  //     console.log('Drone to remove:', drone)
  //     delete updatedDrones[drone.serial]
  //   })
  //   setDrones(updatedDrones)
  // }

  const updateDrones = (newDrones) => {
    setDrones(newDrones)
  }

  useEffect(() => {
    droneService.getAll().then((initialDrones) => setDrones(initialDrones))

    const socket = io()
    socket.on('dronesUpdated', (data) => {
      const droneList = JSON.parse(data)
      updateDrones(droneList)
    })

    // socket.on('dronesRemoved', (data) => {
    //   const droneList = JSON.parse(data)
    //   removeDrones(droneList)
    // })

    socket.io.on('close', tryReconnect(socket))
  }, [])

  return (
    <div>
      <h1>Project Birdnest</h1>
      <table>
        <thead>
          <tr>
            <th>Distance from nest</th>
            <th>Drone serial</th>
            <th>Pilot name</th>
            <th>Email</th>
            <th>Phone number</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(drones)
            .reverse()
            .map((serial) => {
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
                  <td>{Math.round(drones[serial].distance / 1000)} m</td>
                  <td>{serial}</td>
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
