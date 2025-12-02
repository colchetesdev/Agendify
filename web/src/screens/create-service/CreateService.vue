<template>
	<div class="container py-4">
		<div class="d-flex flex-column justify-content-center align-items-center">
			<button class="btn btn-secondary" @click="router.push('/')">
				<i class="bi bi-arrow-left"></i> Voltar
			</button>
			<h2 class="mb-4 mt-3 text-center">Cadastrar Novo Serviço</h2>
		</div>

		<div class="mb-3">
			<label class="form-label">Nome do Serviço</label>
			<input
				type="text"
				v-model="nome"
				class="form-control"
				placeholder="Ex: Corte de Cabelo Premium"
			/>
		</div>

		<div class="mb-4">
			<label class="form-label">Duração (minutos)</label>
			<input
				type="number"
				v-model="duracao"
				min="1"
				class="form-control"
				placeholder="Ex: 60"
			/>
		</div>

		<button
			class="btn btn-primary w-100"
			@click="criarServico"
			:disabled="submitting"
		>
			<span
				v-if="submitting"
				class="spinner-border spinner-border-sm me-2"
				role="status"
			></span>
			{{ submitting ? "Salvando..." : "Cadastrar Serviço" }}
		</button>

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
import { ref } from "vue"
import { useRouter } from "vue-router"
import { servicesAPI } from "../../services/endpoints"
import Modal from "../../components/Modal.vue"

const router = useRouter()

const nome = ref("")
const duracao = ref("")
const submitting = ref(false)

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

async function criarServico() {
	if (!nome.value.trim() || !duracao.value) {
		showModal("Atenção", "Preencha todos os campos.", "warning")
		return
	}

	const durationNumber = parseInt(duracao.value, 10)
	if (Number.isNaN(durationNumber) || durationNumber <= 0) {
		showModal(
			"Atenção",
			"Informe uma duração válida (mínimo 1 minuto).",
			"warning",
		)
		return
	}

	try {
		submitting.value = true

		await servicesAPI.create({
			name: nome.value.trim(),
			durationTimeMinutes: durationNumber,
		})

		showModal("Sucesso", "Serviço cadastrado com sucesso!", "success")
		setTimeout(() => {
			router.push({ name: "Services" })
		}, 1500)
	} catch (err) {
		showModal(
			"Erro",
			"Não foi possível salvar o serviço. Tente novamente.",
			"error",
		)
		console.error("Erro ao criar serviço:", err)
	} finally {
		submitting.value = false
	}
}
</script>

<style scoped>
.container {
	max-width: 520px;
}
</style>
