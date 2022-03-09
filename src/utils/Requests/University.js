import Axios from 'axios'
import { api } from '../api'
import { toast } from 'react-toastify'
import { errorHandeller } from './Error'
import 'react-toastify/dist/ReactToastify.css'
toast.configure({ autoClose: 2000 })

// Index of category items
const CategoryIndex = async (page, limit, header) => {
    try {
        const response = await Axios.get(`${api}university/category?page=${page}&limit=${limit}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Store a category
const CategoryStore = async (data, header) => {
    try {
        const response = await Axios.post(`${api}university/category`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Show specific category
const CategoryShow = async (id, header) => {
    try {
        const response = await Axios.get(`${api}university/category/${id}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Category search
const CategorySearch = async (query, header) => {
    try {
        const response = await Axios.get(`${api}/university/category/search/items?query=${query}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update specific category
const CategoryUpdate = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}university/category/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update category image
const UpdateCategoryImage = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}university/category/image/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Delete specific category
const CategoryDelete = async (id, header) => {
    try {
        const response = await Axios.delete(`${api}university/category/${id}`, header)
        if (response.status === 200) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Index of post items
const PostIndex = async (page, limit, header) => {
    try {
        const response = await Axios.get(`${api}university/post?page=${page}&limit=${limit}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Store a post
const PostStore = async (data, header) => {
    try {
        const response = await Axios.post(`${api}university/post`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Show specific post
const PostShow = async (id, header) => {
    try {
        const response = await Axios.get(`${api}university/post/${id}`, header)
        if (response.status === 200) return response.data
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update specific post
const PostUpdate = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}university/post/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Update post image
const UpdatePostImage = async (id, data, header) => {
    try {
        const response = await Axios.put(`${api}university/post/image/${id}`, data, header)
        if (response.status === 201) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

// Delete
const PostDelete = async (id, header) => {
    try {
        const response = await Axios.delete(`${api}university/post/${id}`, header)
        if (response.status === 200) {
            toast.success(response.data.message)
            return true
        }
    } catch (error) {
        if (error) return errorHandeller(error)
    }
}

const University = {
    CategoryIndex,
    CategoryStore,
    CategoryDelete,
    CategoryShow,
    CategorySearch,
    UpdateCategoryImage,
    CategoryUpdate,
    PostStore,
    PostIndex,
    PostShow,
    PostUpdate,
    UpdatePostImage,
    PostDelete
}

export default University
