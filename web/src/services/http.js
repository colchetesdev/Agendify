import axios from "axios"

const http = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
})

http.interceptors.request.use(
	(config) => {
		return config
	},
	(error) => {
		return Promise.reject(error)
	},
)

http.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		if (error.response) {
			console.error("API Error:", error.response.data)
		} else if (error.request) {
			console.error("Network Error:", error.message)
		} else {
			console.error("Error:", error.message)
		}
		return Promise.reject(error)
	},
)

export default http
