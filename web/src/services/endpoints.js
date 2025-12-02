import http from "./http"

export const servicesAPI = {
	getAll: async (page = 1, limit = 10) => {
		const response = await http.get("/services", {
			params: { page, limit },
		})
		return response.data
	},

	getById: async (id) => {
		const response = await http.get(`/services/${id}`)
		return response.data
	},

	create: async (data) => {
		const response = await http.post("/services", data)
		return response.data
	},

	update: async (id, data) => {
		const response = await http.patch(`/services/${id}`, data)
		return response.data
	},

	delete: async (id) => {
		const response = await http.delete(`/services/${id}`)
		return response.data
	},
}

export const scheduledServicesAPI = {
	getAll: async (page = 1, limit = 10) => {
		const response = await http.get("/scheduled-services", {
			params: { page, limit },
		})
		return response.data
	},

	getById: async (id) => {
		const response = await http.get(`/scheduled-services/${id}`)
		return response.data
	},

	create: async (data) => {
		const response = await http.post("/scheduled-services", data)
		return response.data
	},

	update: async (id, data) => {
		const response = await http.patch(`/scheduled-services/${id}`, data)
		return response.data
	},

	delete: async (id) => {
		const response = await http.delete(`/scheduled-services/${id}`)
		return response.data
	},
}
