<template>
	<header class="container-fluid d-flex justify-content-between p-4">
		<h3 class="text-header fs-3 fw-bold" @click="goToPage('')">
			<i class="bi bi-journal-arrow-up"></i> Agendify
		</h3>
		<nav class="">
			<button class="m-1 btn btn-outline-light" @click="goToPage('agendar')">
				Agendar
			</button>
			<button class="m-1 btn btn-outline-light" @click="goToPage('servicos')">
				Serviços
			</button>
			<button class="m-1 btn btn-outline-light" @click="goToPage('criar-servico')">
				Criar Serviço
			</button>
			<button
				class="m-1 btn btn-outline-light"
				@click="goToPage('meus-agendamentos')"
			>
				Meus agendamentos
			</button>
		</nav>
	</header>
	<main>
		<RouterView></RouterView>
	</main>
</template>
<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const goToPage = (page) => {
	router.push(`/${page}`)
}
</script>
<style scoped>
@font-face {
	font-family: Poppins;
	src: url("../assets/fonts/Poppins-Regular.ttf");
}
* {
	font-family: Poppins;
}
header {
	background: linear-gradient(100deg, #811919, #c91515);
	color: azure;
}
.text-header {
	cursor: pointer;
}
main {
	background-color: #f5f5f5;
}
</style>
