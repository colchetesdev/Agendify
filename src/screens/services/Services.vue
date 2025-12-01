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

		<div class="row g-4">
			<div
				v-for="servico in servicos"
				:key="servico.id"
				class="col-md-6 col-lg-4"
			>
				<div class="card h-100 shadow-sm service-card">
					<div class="card-body d-flex flex-column">
						<h5 class="card-title mb-3">{{ servico.nome }}</h5>
						<p class="card-text text-muted mb-3">
							<i class="bi bi-clock"></i> {{ servico.duracao }} minutos
						</p>
						<button
							class="btn btn-primary mt-auto"
							@click="agendarServico(servico.nome)"
						>
							Agendar Agora
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const servicos = [
	{ id: 1, nome: "Corte de Cabelo", duracao: 30 },
	{ id: 2, nome: "Barba", duracao: 20 },
	{ id: 3, nome: "Corte + Barba", duracao: 50 },
]

function agendarServico(nomeServico) {
	router.push({
		name: "Booking",
		query: { servico: nomeServico },
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
