<template>
	<div class="container py-4">
		<div class="d-flex flex-column justify-content-center align-items-center">
			<button class="btn btn-secondary" @click="router.push('/')">
				<i class="bi bi-arrow-left"></i> Voltar
			</button>
			<h2 class="mb-4 mt-3 text-center">Agendar Serviço</h2>
		</div>
		<div class="mb-3">
			<label class="form-label">Selecione o Serviço</label>
			<select v-model="servico" class="form-select">
				<option disabled value="">Escolha um serviço</option>
				<option v-for="s in servicos" :key="s.id" :value="s.nome">
					{{ s.nome }} ({{ s.duracao }} min)
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

		<button class="btn btn-primary w-100" @click="confirmarAgendamento">
			Confirmar Agendamento
		</button>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

onMounted(() => {
	if (route.query.servico) {
		servico.value = route.query.servico
	}
})

const servico = ref("")
const data = ref("")
const horario = ref("")
const nome = ref("")
const telefone = ref("")
const dataMinima = ref("")

const servicos = [
	{ id: 1, nome: "Corte de Cabelo", duracao: 30 },
	{ id: 2, nome: "Barba", duracao: 20 },
	{ id: 3, nome: "Corte + Barba", duracao: 50 },
]

const horarios = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]

onMounted(() => {
	const hoje = new Date()
	const ano = hoje.getFullYear()
	const mes = String(hoje.getMonth() + 1).padStart(2, "0")
	const dia = String(hoje.getDate()).padStart(2, "0")
	dataMinima.value = `${ano}-${mes}-${dia}`

	if (route.query.servico) {
		servico.value = route.query.servico
	}
})

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

function confirmarAgendamento() {
	if (
		!servico.value ||
		!data.value ||
		!horario.value ||
		!nome.value ||
		!telefone.value
	) {
		alert("Preencha todos os campos!")
		return
	}

	const agendamentos = JSON.parse(localStorage.getItem("agendamentos") || "[]")
	const novoAgendamento = {
		id: Date.now(),
		servico: servico.value,
		data: data.value,
		horario: horario.value,
		nome: nome.value,
		telefone: telefone.value,
		criadoEm: new Date().toLocaleString("pt-BR"),
	}
	agendamentos.push(novoAgendamento)
	localStorage.setItem("agendamentos", JSON.stringify(agendamentos))

	alert(
		`Agendamento confirmado!\n\nServiço: ${servico.value}\nData: ${data.value}\nHorário: ${horario.value}`,
	)

	router.push({ name: "Schedules" })
}
</script>

<style scoped>
.container {
	max-width: 500px;
}
</style>
