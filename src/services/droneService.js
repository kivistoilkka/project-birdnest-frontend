import axios from 'axios'
const baseUrl = '/api/'

const getAll = () => {
  const request = axios.get(baseUrl + 'drones')

  return request.then((res) => res.data)
}

export default { getAll }
