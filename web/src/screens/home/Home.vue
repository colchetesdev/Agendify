<template>
	<section
		class="hero-section container-fluid d-flex align-items-center justify-content-between px-5"
	>
		<div class="hero-text">
			<h4 class="fs-4 title">Olá, Bem-vindo ao <strong>Agendify</strong>👋</h4>
			<h5 class="fs-5 subtitle">
				Gerencie seus agendamentos de forma fácil e rápida.
			</h5>
			<button class="btn px-5 py-2 mt-5 fs-6" @click="router.push('/agendar')">
				Agendar agora!
			</button>
		</div>
	</section>

	<section class="container my-5">
		<h3 class="text-center mb-4 fw-bold">Nossos Serviços</h3>

		<div v-if="loading" class="text-center">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Carregando...</span>
			</div>
		</div>

		<div v-else-if="error" class="alert alert-danger text-center">
			{{ error }}
		</div>

		<div v-else class="row g-4">
			<div class="col-md-4" v-for="s in servicos" :key="s.id">
				<div class="card shadow-sm border-0 h-100 p-3 text-center">
					<h5 class="fw-bold">{{ s.name }}</h5>
					<p class="text-muted">Duração: {{ s.durationTimeMinutes }} min</p>
					<button
						class="btn btn-danger mt-2"
						@click="
							router.push({
								path: '/agendar',
								query: { serviceId: s.id },
							})
						"
					>
						Agendar
					</button>
				</div>
			</div>
		</div>
	</section>

	<section class="benefits-section py-5 text-light">
		<div class="container">
			<h3 class="text-center fw-bold mb-4">Por que usar o Agendify?</h3>

			<div class="row text-center">
				<div class="col-md-4">
					<h5 class="fw-bold"><i class="bi bi-check-lg"></i> Agilidade</h5>
					<p>Agende seus serviços em segundos, sem complicações.</p>
				</div>

				<div class="col-md-4">
					<h5 class="fw-bold"><i class="bi bi-check-lg"></i> Organização</h5>
					<p>Tenha controle total dos horários e atendimentos.</p>
				</div>

				<div class="col-md-4">
					<h5 class="fw-bold"><i class="bi bi-check-lg"></i> Simplicidade</h5>
					<p>Interface fácil, moderna e intuitiva para todos.</p>
				</div>
			</div>
		</div>
	</section>

	<section class="text-center my-5">
		<h4 class="fw-bold">Pronto para organizar seus horários?</h4>
		<p class="text-muted">Clique abaixo e faça seu agendamento agora mesmo!</p>

		<button class="btn btn-danger px-4 py-2" @click="router.push('/agendar')">
			Fazer Agendamento
		</button>
	</section>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { servicesAPI } from "../../services/endpoints"

const router = useRouter()
const servicos = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
	await carregarServicos()
})

async function carregarServicos() {
	try {
		loading.value = true
		error.value = null
		const response = await servicesAPI.getAll(1, 100)
		servicos.value = response.data || []
	} catch (err) {
		error.value = "Erro ao carregar serviços. Tente novamente mais tarde."
		console.error("Erro ao carregar serviços:", err)
	} finally {
		loading.value = false
	}
}
</script>

<style scoped>
.hero-section {
	min-height: 400px;
	background-image: url("../../assets/images/hero-section.png");
	background-size: cover;
	background-position: center;
	box-shadow: 0px 5px 12px 3px #1a020d60;
}

.title,
.subtitle {
	color: #fafafa;
}

.title {
	font-weight: 800;
}

button {
	color: #e9fae5;
	background-color: rgb(214, 46, 46);
	font-weight: 900;
	border-radius: 10px;
	box-shadow: 3px 5px 10px 4px rgba(0, 0, 0, 0.164);
}

button:hover {
	transition: 0.3s;
	background-color: #1a020d;
	color: rgb(214, 46, 46);
}

strong {
	color: rgb(214, 46, 46);
	text-shadow: rgb(163, 9, 9) 1px 1px 4px;
}

.benefits-section {
	background: #1a020d;
}
</style>
