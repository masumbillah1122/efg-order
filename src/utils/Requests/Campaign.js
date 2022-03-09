import Axios from 'axios'
import { api } from '../api'
import { toast } from 'react-toastify'
import { errorHandeller } from './Error'
import 'react-toastify/dist/ReactToastify.css'
toast.configure({ autoClose: 2000 })

// List of Campaign
const Index = async (page, limit, header) => {
    try {
        const response = await Axios.get(`${api}campaign?page=${page}&limit=${limit}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Store Campaign 
const Store = async (data, header) => {
    try {
        const response = await Axios.post(`${api}campaign`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Show specific campaign
const Show = async (id, header) => {
    try {
        const response = await Axios.get(`${api}campaign/${id}`, header)
        if (response.status === 200) {
            return response.data.campaign
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update specific campaign
const Update = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}campaign/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update SM banner
const UpdateSmBanner = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}campaign/sm/banner/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update LG banner
const UpdateLgBanner = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}campaign/lg/banner/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Delete Campaign 
const Delete = async (id, header) => {
    try {
        const response = await Axios.delete(`${api}campaign/${id}`, header)
        if (response.status === 200) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Search item
const Search = async (data, header) => {
    try {
        const response = await Axios.get(`${api}campaign/search/items?query=${data}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Filter by date
const FilterByDateRange = async (data, header) => {
    try {
        const response = await Axios.post(`${api}campaign/date-range-filter`, data, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Filter by assign
const FilterByAssign = async (data, header) => {
    try {
        const response = await Axios.post(`${api}campaign/filter-by-assign`, data, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

const Campaign = {
    Index,
    Store,
    Show,
    Update,
    UpdateSmBanner,
    UpdateLgBanner,
    Delete,
    Search,
    FilterByDateRange,
    FilterByAssign
}

export default Campaign