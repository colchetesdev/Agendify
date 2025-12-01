import { createRouter, createWebHistory } from "vue-router"
import Home from "@/screens/home/Home.vue"
import Booking from "@/screens/booking/Booking.vue"
import Services from "@/screens/services/Services.vue"
import Schedules from "@/screens/schedules/Schedules.vue"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: "/", name: "Home", component: Home },
		{ path: "/agendar", name: "Booking", component: Booking },
		{ path: "/servicos", name: "Services", component: Services },
		{ path: "/meus-agendamentos", name: "Schedules", component: Schedules },
	],
})

export default router
