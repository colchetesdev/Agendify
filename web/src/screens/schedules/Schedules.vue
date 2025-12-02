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

		<div v-if="loading" class="text-center">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Carregando...</span>
			</div>
		</div>

		<div v-else-if="error" class="alert alert-danger text-center">
			{{ error }}
		</div>

		<div v-else-if="agendamentos.length === 0" class="alert alert-info text-center">
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
						<h5 class="card-title mb-3">{{ agendamento.service?.name || "Serviço Desconhecido" }}</h5>
						<div
							v-if="agendamentoEditando !== agendamento.id"
							class="schedule-details"
						>
							<p class="mb-2">
								<i class="bi bi-calendar-event"></i>
								<strong>Data:</strong> {{ formatarData(agendamento.serviceDate) }}
							</p>
							<p class="mb-2">
								<i class="bi bi-clock"></i>
								<strong>Horário:</strong> {{ agendamento.scheduledHour }}
							</p>
							<p class="mb-2">
								<i class="bi bi-person"></i>
								<strong>Nome:</strong> {{ agendamento.clientName }}
							</p>
							<p class="mb-3">
								<i class="bi bi-telephone"></i>
								<strong>Telefone:</strong> {{ agendamento.clientPhone }}
							</p>
						</div>

						<div v-else class="form-edit">
							<div class="mb-2">
								<label class="form-label small">Data</label>
								<input
									type="date"
									v-model="agendamentoEmEdicao.serviceDate"
									:min="dataMinima"
									class="form-control form-control-sm"
								/>
							</div>
							<div class="mb-2">
								<label class="form-label small">Horário</label>
								<select
									v-model="agendamentoEmEdicao.scheduledHour"
									class="form-select form-select-sm"
								>
									<option v-for="h in horarios" :key="h">{{ h }}</option>
								</select>
							</div>
							<div class="mb-2">
								<label class="form-label small">Nome</label>
								<input
									type="text"
									v-model="agendamentoEmEdicao.clientName"
									class="form-control form-control-sm"
								/>
							</div>
							<div class="mb-2">
								<label class="form-label small">Telefone</label>
								<input
									type="text"
									v-model="agendamentoEmEdicao.clientPhone"
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
								:disabled="saving"
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
								:disabled="deleting"
							>
								<i class="bi bi-trash"></i> Cancelar
							</button>
						</div>
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

		<Modal
			:show="modal.show"
			:title="modal.title"
			:message="modal.message"
			:type="modal.type"
			:show-cancel-button="false"
			@close="closeModal"
		/>

		<Modal
			:show="confirmModal.show"
			:title="confirmModal.title"
			:message="confirmModal.message"
			type="warning"
			:show-cancel-button="true"
			confirm-text="Confirmar"
			cancel-text="Cancelar"
			@confirm="handleConfirm"
			@cancel="closeConfirmModal"
			@close="closeConfirmModal"
		/>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { scheduledServicesAPI } from "../../services/endpoints"
import Modal from "../../components/Modal.vue"

const router = useRouter()
const agendamentos = ref([])
const agendamentoEditando = ref(null)
const agendamentoEmEdicao = ref({})
const dataMinima = ref("")
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const error = ref(null)
const currentPage = ref(1)
const limit = ref(9)
const totalPages = ref(0)
const total = ref(0)

const horarios = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]

const modal = ref({
	show: false,
	title: "",
	message: "",
	type: "info",
})

const confirmModal = ref({
	show: false,
	title: "",
	message: "",
	onConfirm: null,
})

function showModal(title, message, type = "info") {
	modal.value = {
		show: true,
		title,
		message,
		type,
	}
}

function closeModal() {
	modal.value.show = false
}

function showConfirmModal(title, message, onConfirm) {
	confirmModal.value = {
		show: true,
		title,
		message,
		onConfirm,
	}
}

function handleConfirm() {
	if (confirmModal.value.onConfirm) {
		confirmModal.value.onConfirm()
	}
	confirmModal.value.show = false
}

function closeConfirmModal() {
	confirmModal.value.show = false
}

onMounted(async () => {
	const hoje = new Date()
	const ano = hoje.getFullYear()
	const mes = String(hoje.getMonth() + 1).padStart(2, "0")
	const dia = String(hoje.getDate()).padStart(2, "0")
	dataMinima.value = `${ano}-${mes}-${dia}`

	await carregarAgendamentos()
})

async function carregarAgendamentos() {
	try {
		loading.value = true
		error.value = null
		const response = await scheduledServicesAPI.getAll(currentPage.value, limit.value)
		agendamentos.value = response.data || []
		total.value = response.total || 0
		totalPages.value = response.totalPages || 0
	} catch (err) {
		error.value = "Erro ao carregar agendamentos. Tente novamente mais tarde."
		console.error("Erro ao carregar agendamentos:", err)
	} finally {
		loading.value = false
	}
}

function changePage(page) {
	if (page >= 1 && page <= totalPages.value) {
		currentPage.value = page
		carregarAgendamentos()
	}
}

function previousPage() {
	if (currentPage.value > 1) {
		currentPage.value--
		carregarAgendamentos()
	}
}

function nextPage() {
	if (currentPage.value < totalPages.value) {
		currentPage.value++
		carregarAgendamentos()
	}
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

async function salvarEdicao(id) {
	try {
		saving.value = true

		const updateData = {
			serviceDate: agendamentoEmEdicao.value.serviceDate,
			scheduledHour: agendamentoEmEdicao.value.scheduledHour,
			clientName: agendamentoEmEdicao.value.clientName,
			clientPhone: agendamentoEmEdicao.value.clientPhone,
		}

		await scheduledServicesAPI.update(id, updateData)
		await carregarAgendamentos()

		agendamentoEditando.value = null
		agendamentoEmEdicao.value = {}

		showModal("Sucesso", "Agendamento atualizado com sucesso!", "success")
	} catch (err) {
		showModal("Erro", "Erro ao atualizar agendamento. Tente novamente.", "error")
		console.error("Erro ao atualizar agendamento:", err)
	} finally {
		saving.value = false
	}
}

function deletarAgendamento(id) {
	showConfirmModal(
		"Confirmar Cancelamento",
		"Tem certeza que deseja cancelar este agendamento?",
		async () => {
			try {
				deleting.value = true
				await scheduledServicesAPI.delete(id)
				await carregarAgendamentos()
				showModal("Sucesso", "Agendamento cancelado com sucesso!", "success")
			} catch (err) {
				showModal("Erro", "Erro ao cancelar agendamento. Tente novamente.", "error")
				console.error("Erro ao cancelar agendamento:", err)
			} finally {
				deleting.value = false
			}
		},
	)
}

function formatarTelefone(event) {
	let valor = event.target.value.replace(/\D/g, "")

	if (valor.length > 11) {
		valor = valor.slice(0, 11)
	}

	if (valor.length <= 2) {
		agendamentoEmEdicao.value.clientPhone = valor
	} else if (valor.length <= 7) {
		agendamentoEmEdicao.value.clientPhone = `(${valor.slice(0, 2)}) ${valor.slice(2)}`
	} else {
		agendamentoEmEdicao.value.clientPhone = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`
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
