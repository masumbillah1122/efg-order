
import { toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const toastSetting = {
    autoClose: 2000,
    transition: Slide,
    position: "top-right",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
}

export const errorHandeller = error => {
    const errorResponse = error && error.response ? error.response.data : null

    if (error && error.response && error.response.data && error.response.status === 422) {
        Object.values(error.response.data).map(value => {
            return toast.error(value, { ...toastSetting })
        })
    }

    if (errorResponse) {
        if (errorResponse.message === 'unauthorized request') {
            toast.error(errorResponse.message + ' Logging out...', { ...toastSetting })

            setTimeout(() => {
                localStorage.clear()
                window.location.reload()
            }, 2000)
        } else if (errorResponse.message === 'Token expired') {
            toast.error(error.message + ' Logging out...', { ...toastSetting })

            setTimeout(() => {
                localStorage.clear()
                window.location.reload()
            }, 2000)
        } else {
            return toast.error(errorResponse.message, { ...toastSetting })
        }
    }


}
