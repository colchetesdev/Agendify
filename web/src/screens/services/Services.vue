<template>
	<div class="container py-4">
		<div
			class="d-flex flex-column justify-content-center align-items-center mb-5"
		>
			<button class="btn btn-secondary" @click="router.push('/')">
				<i class="bi bi-arrow-left"></i> Voltar
			</button>
			<h2 class="mb-0 mt-3">Nossos Serviços</h2>
		</div>

		<div v-if="loading" class="text-center">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Carregando...</span>
			</div>
		</div>

		<div v-else-if="error" class="alert alert-danger text-center">
			{{ error }}
		</div>

		<div v-else class="row g-4">
			<div
				v-for="servico in servicos"
				:key="servico.id"
				class="col-md-6 col-lg-4"
			>
				<div class="card h-100 shadow-sm service-card">
					<div class="card-body d-flex flex-column">
						<h5 class="card-title mb-3">{{ servico.name }}</h5>
						<p class="card-text text-muted mb-3">
							<i class="bi bi-clock"></i> {{ servico.durationTimeMinutes }}
							minutos
						</p>
						<button
							class="btn btn-primary mt-auto"
							@click="agendarServico(servico.id)"
						>
							Agendar Agora
						</button>
					</div>
				</div>
			</div>
		</div>

		<div v-if="!loading && !error && totalPages > 1" class="d-flex justify-content-center mt-5">
			<nav>
				<ul class="pagination">
					<li class="page-item" :class="{ disabled: currentPage === 1 }">
						<button class="page-link" @click="previousPage" :disabled="currentPage === 1">
							<i class="bi bi-chevron-left"></i> Anterior
						</button>
					</li>
					<li
						v-for="page in totalPages"
						:key="page"
						class="page-item"
						:class="{ active: currentPage === page }"
					>
						<button class="page-link" @click="changePage(page)">
							{{ page }}
						</button>
					</li>
					<li class="page-item" :class="{ disabled: currentPage === totalPages }">
						<button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">
							Próxima <i class="bi bi-chevron-right"></i>
						</button>
					</li>
				</ul>
			</nav>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { servicesAPI } from "../../services/endpoints"

const router = useRouter()
const servicos = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const limit = ref(9)
const totalPages = ref(0)
const total = ref(0)

onMounted(async () => {
	await carregarServicos()
})

async function carregarServicos() {
	try {
		loading.value = true
		error.value = null
		const response = await servicesAPI.getAll(currentPage.value, limit.value)
		servicos.value = response.data || []
		total.value = response.total || 0
		totalPages.value = response.totalPages || 0
	} catch (err) {
		error.value = "Erro ao carregar serviços. Tente novamente mais tarde."
		console.error("Erro ao carregar serviços:", err)
	} finally {
		loading.value = false
	}
}

function changePage(page) {
	if (page >= 1 && page <= totalPages.value) {
		currentPage.value = page
		carregarServicos()
	}
}

function previousPage() {
	if (currentPage.value > 1) {
		currentPage.value--
		carregarServicos()
	}
}

function nextPage() {
	if (currentPage.value < totalPages.value) {
		currentPage.value++
		carregarServicos()
	}
}

function agendarServico(serviceId) {
	router.push({
		name: "Booking",
		query: { serviceId },
	})
}
</script>

<style scoped>
.container {
	max-width: 1200px;
}

.service-card {
	border: none;
	transition:
		transform 0.3s ease,
		box-shadow 0.3s ease;
	border-radius: 12px;
	overflow: hidden;
}

.service-card:hover {
	transform: translateY(-8px);
	box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.service-card .card-body {
	padding: 2rem;
}

.service-card .card-title {
	font-size: 1.3rem;
	font-weight: 600;
	color: #333;
}

.service-card .card-text {
	font-size: 0.95rem;
}

.service-card .btn {
	border-radius: 8px;
	font-weight: 500;
	transition: all 0.3s ease;
}

.service-card .btn:hover {
	transform: scale(1.05);
}
</style>
