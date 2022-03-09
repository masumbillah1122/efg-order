import Axios from 'axios'
import { api } from '../api'
import { toast } from 'react-toastify'
import { errorHandeller } from './Error'
import 'react-toastify/dist/ReactToastify.css'
toast.configure({ autoClose: 2000 })

// Index of dashboard
const Index = async (header) => {
    try {
        const response = await Axios.get(`${api}dashboard`, header)
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Chart data
const ChartData = async (header) => {
    try {
        const response = await Axios.get(`${api}dashboard/chart-data`, header)
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Store credit report Index
const StoreCredit = async (header) => {
    try {
        const response = await Axios.get(`${api}dashboard/report/store-credit`, header)
        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}


const Dashboard = {
    Index,
    ChartData,
    StoreCredit
}

export default Dashboard