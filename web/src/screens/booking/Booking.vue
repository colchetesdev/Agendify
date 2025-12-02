<template>
	<div class="container py-4">
		<div class="d-flex flex-column justify-content-center align-items-center">
			<button class="btn btn-secondary" @click="router.push('/')">
				<i class="bi bi-arrow-left"></i> Voltar
			</button>
			<h2 class="mb-4 mt-3 text-center">Agendar Serviço</h2>
		</div>

		<div v-if="loadingServices" class="text-center">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Carregando...</span>
			</div>
		</div>

		<div v-else>
			<div class="mb-3">
				<label class="form-label">Selecione o Serviço</label>
				<select v-model="serviceId" class="form-select">
					<option disabled value="">Escolha um serviço</option>
					<option v-for="s in servicos" :key="s.id" :value="s.id">
						{{ s.name }} ({{ s.durationTimeMinutes }} min)
					</option>
				</select>
			</div>

			<div class="mb-3">
				<label class="form-label">Selecione a Data</label>
				<input
					type="date"
					v-model="data"
					:min="dataMinima"
					class="form-control"
				/>
			</div>

			<div class="mb-3">
				<label class="form-label">Horários Disponíveis</label>
				<select v-model="horario" class="form-select">
					<option disabled value="">Escolha um horário</option>
					<option v-for="h in horarios" :key="h">{{ h }}</option>
				</select>
			</div>

			<div class="mb-3">
				<label class="form-label">Nome</label>
				<input
					type="text"
					v-model="nome"
					class="form-control"
					placeholder="Seu nome"
				/>
			</div>

			<div class="mb-3">
				<label class="form-label">Telefone</label>
				<input
					type="text"
					v-model="telefone"
					@input="formatarTelefone"
					class="form-control"
					placeholder="(00) 00000-0000"
					maxlength="15"
				/>
			</div>

			<button
				class="btn btn-primary w-100"
				@click="confirmarAgendamento"
				:disabled="submitting"
			>
				<span
					v-if="submitting"
					class="spinner-border spinner-border-sm me-2"
					role="status"
				></span>
				{{ submitting ? "Agendando..." : "Confirmar Agendamento" }}
			</button>
		</div>

		<Modal
			:show="modal.show"
			:title="modal.title"
			:message="modal.message"
			:type="modal.type"
			:show-cancel-button="false"
			@close="closeModal"
		/>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { servicesAPI, scheduledServicesAPI } from "../../services/endpoints"
import Modal from "../../components/Modal.vue"

const router = useRouter()
const route = useRoute()

const servicos = ref([])
const loadingServices = ref(false)
const submitting = ref(false)

const serviceId = ref("")
const data = ref("")
const horario = ref("")
const nome = ref("")
const telefone = ref("")
const dataMinima = ref("")

const horarios = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]

const modal = ref({
	show: false,
	title: "",
	message: "",
	type: "info",
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

onMounted(async () => {
	const hoje = new Date()
	const ano = hoje.getFullYear()
	const mes = String(hoje.getMonth() + 1).padStart(2, "0")
	const dia = String(hoje.getDate()).padStart(2, "0")
	dataMinima.value = `${ano}-${mes}-${dia}`

	await carregarServicos()

	if (route.query.serviceId) {
		serviceId.value = parseInt(route.query.serviceId)
	}
})

async function carregarServicos() {
	try {
		loadingServices.value = true
		const response = await servicesAPI.getAll()
		servicos.value = response.data || response
	} catch (err) {
		showModal(
			"Erro",
			"Erro ao carregar serviços. Tente novamente mais tarde.",
			"error",
		)
		console.error("Erro ao carregar serviços:", err)
	} finally {
		loadingServices.value = false
	}
}

function formatarTelefone(event) {
	let valor = event.target.value.replace(/\D/g, "")

	if (valor.length > 11) {
		valor = valor.slice(0, 11)
	}

	if (valor.length <= 2) {
		telefone.value = valor
	} else if (valor.length <= 7) {
		telefone.value = `(${valor.slice(0, 2)}) ${valor.slice(2)}`
	} else {
		telefone.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`
	}
}

async function confirmarAgendamento() {
	if (
		!serviceId.value ||
		!data.value ||
		!horario.value ||
		!nome.value ||
		!telefone.value
	) {
		showModal("Atenção", "Preencha todos os campos!", "warning")
		return
	}

	try {
		submitting.value = true

		const agendamentoData = {
			serviceId: parseInt(serviceId.value),
			serviceDate: data.value,
			scheduledHour: horario.value,
			clientName: nome.value,
			clientPhone: telefone.value,
		}

		await scheduledServicesAPI.create(agendamentoData)

		const servicoSelecionado = servicos.value.find((s) => s.id === serviceId.value)
		showModal(
			"Sucesso",
			`Agendamento confirmado!\n\nServiço: ${servicoSelecionado?.name}\nData: ${data.value}\nHorário: ${horario.value}`,
			"success",
		)

		setTimeout(() => {
			router.push({ name: "Schedules" })
		}, 2000)
	} catch (err) {
		showModal("Erro", "Erro ao criar agendamento. Tente novamente.", "error")
		console.error("Erro ao criar agendamento:", err)
	} finally {
		submitting.value = false
	}
}
</script>

<style scoped>
.container {
	max-width: 500px;
}
</style>
