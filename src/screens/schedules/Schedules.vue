<template>
	<div class="container py-4">
		<div
			class="d-flex flex-column justify-content-center align-items-center mb-5"
		>
			<button class="btn btn-secondary" @click="router.push('/')">
				<i class="bi bi-arrow-left"></i> Voltar
			</button>
			<h2 class="mb-0 mt-3">Meus Agendamentos</h2>
		</div>

		<div v-if="agendamentos.length === 0" class="alert alert-info text-center">
			<i class="bi bi-info-circle"></i> Nenhum agendamento realizado ainda.
		</div>

		<div v-else class="row g-4">
			<div
				v-for="agendamento in agendamentos"
				:key="agendamento.id"
				class="col-md-6 col-lg-4"
			>
				<div class="card h-100 shadow-sm schedule-card">
					<div class="card-body d-flex flex-column">
						<h5 class="card-title mb-3">{{ agendamento.servico }}</h5>
						<div
							v-if="agendamentoEditando !== agendamento.id"
							class="schedule-details"
						>
							<p class="mb-2">
								<i class="bi bi-calendar-event"></i>
								<strong>Data:</strong> {{ formatarData(agendamento.data) }}
							</p>
							<p class="mb-2">
								<i class="bi bi-clock"></i>
								<strong>Horário:</strong> {{ agendamento.horario }}
							</p>
							<p class="mb-2">
								<i class="bi bi-person"></i>
								<strong>Nome:</strong> {{ agendamento.nome }}
							</p>
							<p class="mb-3">
								<i class="bi bi-telephone"></i>
								<strong>Telefone:</strong> {{ agendamento.telefone }}
							</p>
						</div>

						<div v-else class="form-edit">
							<div class="mb-2">
								<label class="form-label small">Data</label>
								<input
									type="date"
									v-model="agendamentoEmEdicao.data"
									:min="dataMinima"
									class="form-control form-control-sm"
								/>
							</div>
							<div class="mb-2">
								<label class="form-label small">Horário</label>
								<select
									v-model="agendamentoEmEdicao.horario"
									class="form-select form-select-sm"
								>
									<option v-for="h in horarios" :key="h">{{ h }}</option>
								</select>
							</div>
							<div class="mb-2">
								<label class="form-label small">Nome</label>
								<input
									type="text"
									v-model="agendamentoEmEdicao.nome"
									class="form-control form-control-sm"
								/>
							</div>
							<div class="mb-2">
								<label class="form-label small">Telefone</label>
								<input
									type="text"
									v-model="agendamentoEmEdicao.telefone"
									class="form-control form-control-sm"
									@input="formatarTelefone"
									maxlength="15"
								/>
							</div>
						</div>

						<div class="d-flex gap-2 mt-auto pt-3">
							<button
								v-if="agendamentoEditando !== agendamento.id"
								class="btn btn-warning btn-sm flex-grow-1"
								@click="iniciarEdicao(agendamento)"
							>
								<i class="bi bi-pencil"></i> Editar
							</button>
							<button
								v-else
								class="btn btn-success btn-sm flex-grow-1"
								@click="salvarEdicao(agendamento.id)"
							>
								<i class="bi bi-check"></i> Salvar
							</button>
							<button
								v-if="agendamentoEditando === agendamento.id"
								class="btn btn-secondary btn-sm flex-grow-1"
								@click="cancelarEdicao"
							>
								<i class="bi bi-x"></i> Cancelar
							</button>
							<button
								v-else
								class="btn btn-danger btn-sm flex-grow-1"
								@click="deletarAgendamento(agendamento.id)"
							>
								<i class="bi bi-trash"></i> Cancelar
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const agendamentos = ref([])
const agendamentoEditando = ref(null)
const agendamentoEmEdicao = ref({})
const dataMinima = ref("")

const horarios = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]

onMounted(() => {
	const hoje = new Date()
	const ano = hoje.getFullYear()
	const mes = String(hoje.getMonth() + 1).padStart(2, "0")
	const dia = String(hoje.getDate()).padStart(2, "0")
	dataMinima.value = `${ano}-${mes}-${dia}`

	carregarAgendamentos()
})

function carregarAgendamentos() {
	const dados = localStorage.getItem("agendamentos")
	agendamentos.value = dados ? JSON.parse(dados) : []
}

function formatarData(dataString) {
	const data = new Date(dataString + "T00:00:00")
	return data.toLocaleDateString("pt-BR", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	})
}

function iniciarEdicao(agendamento) {
	agendamentoEditando.value = agendamento.id
	agendamentoEmEdicao.value = { ...agendamento }
}

function cancelarEdicao() {
	agendamentoEditando.value = null
	agendamentoEmEdicao.value = {}
}

function salvarEdicao(id) {
	const index = agendamentos.value.findIndex((a) => a.id === id)
	if (index !== -1) {
		agendamentos.value[index] = agendamentoEmEdicao.value
		localStorage.setItem("agendamentos", JSON.stringify(agendamentos.value))
	}
	agendamentoEditando.value = null
	agendamentoEmEdicao.value = {}
}

function deletarAgendamento(id) {
	if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
		agendamentos.value = agendamentos.value.filter((a) => a.id !== id)
		localStorage.setItem("agendamentos", JSON.stringify(agendamentos.value))
	}
}

function formatarTelefone(event) {
	let valor = event.target.value.replace(/\D/g, "")

	if (valor.length > 11) {
		valor = valor.slice(0, 11)
	}

	if (valor.length <= 2) {
		agendamentoEmEdicao.value.telefone = valor
	} else if (valor.length <= 7) {
		agendamentoEmEdicao.value.telefone = `(${valor.slice(0, 2)}) ${valor.slice(2)}`
	} else {
		agendamentoEmEdicao.value.telefone = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`
	}
}
</script>

<style scoped>
.container {
	max-width: 1200px;
}

.schedule-card {
	border: none;
	transition:
		transform 0.3s ease,
		box-shadow 0.3s ease;
	border-radius: 12px;
	overflow: hidden;
}

.schedule-card:hover {
	box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.schedule-card .card-body {
	padding: 2rem;
}

.schedule-card .card-title {
	font-size: 1.3rem;
	font-weight: 600;
	color: #333;
	border-bottom: 2px solid #007bff;
	padding-bottom: 1rem;
}

.schedule-details p {
	font-size: 0.95rem;
	color: #555;
}

.schedule-details i {
	margin-right: 0.5rem;
	color: #007bff;
}

.form-edit {
	background-color: #f8f9fa;
	padding: 1rem;
	border-radius: 8px;
}

.form-edit .form-label {
	margin-bottom: 0.25rem;
	color: #555;
	font-weight: 600;
}

.schedule-card .btn {
	border-radius: 8px;
	font-weight: 500;
	transition: all 0.3s ease;
	font-size: 0.85rem;
}

.d-flex.gap-2 {
	gap: 0.5rem;
}
</style>
