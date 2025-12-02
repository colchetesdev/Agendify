<template>
	<Teleport to="body">
		<div
			v-if="show"
			class="modal fade show d-block"
			tabindex="-1"
			role="dialog"
			@click.self="handleBackdropClick"
		>
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content">
					<div class="modal-header" :class="headerClass">
						<h5 class="modal-title">
							<i v-if="icon" :class="iconClass" class="me-2"></i>
							{{ title }}
						</h5>
						<button
							v-if="showCloseButton"
							type="button"
							class="btn-close"
							@click="close"
							aria-label="Close"
						></button>
					</div>
					<div class="modal-body">
						<slot>
							<p v-if="message" class="mb-0">{{ message }}</p>
						</slot>
					</div>
					<div v-if="showFooter" class="modal-footer">
						<slot name="footer">
							<button
								v-if="showCancelButton"
								type="button"
								class="btn btn-secondary"
								@click="cancel"
							>
								{{ cancelText }}
							</button>
							<button
								type="button"
								:class="confirmButtonClass"
								@click="confirm"
							>
								{{ confirmText }}
							</button>
						</slot>
					</div>
				</div>
			</div>
		</div>
		<div v-if="show" class="modal-backdrop fade show"></div>
	</Teleport>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: "Mensagem",
	},
	message: {
		type: String,
		default: "",
	},
	type: {
		type: String,
		default: "info",
		validator: (value) => ["success", "error", "warning", "info"].includes(value),
	},
	showCloseButton: {
		type: Boolean,
		default: true,
	},
	showFooter: {
		type: Boolean,
		default: true,
	},
	showCancelButton: {
		type: Boolean,
		default: false,
	},
	confirmText: {
		type: String,
		default: "OK",
	},
	cancelText: {
		type: String,
		default: "Cancelar",
	},
	closeOnBackdrop: {
		type: Boolean,
		default: true,
	},
})

const emit = defineEmits(["confirm", "cancel", "close"])

const headerClass = computed(() => {
	const classes = {
		success: "bg-success text-white",
		error: "bg-danger text-white",
		warning: "bg-warning text-dark",
		info: "bg-primary text-white",
	}
	return classes[props.type] || classes.info
})

const iconClass = computed(() => {
	const icons = {
		success: "bi bi-check-circle-fill",
		error: "bi bi-exclamation-circle-fill",
		warning: "bi bi-exclamation-triangle-fill",
		info: "bi bi-info-circle-fill",
	}
	return icons[props.type] || icons.info
})

const icon = computed(() => {
	return ["success", "error", "warning", "info"].includes(props.type)
})

const confirmButtonClass = computed(() => {
	const classes = {
		success: "btn btn-success",
		error: "btn btn-danger",
		warning: "btn btn-warning",
		info: "btn btn-primary",
	}
	return classes[props.type] || classes.info
})

function confirm() {
	emit("confirm")
	emit("close")
}

function cancel() {
	emit("cancel")
	emit("close")
}

function close() {
	emit("close")
}

function handleBackdropClick() {
	if (props.closeOnBackdrop) {
		close()
	}
}
</script>

<style scoped>
.modal {
	background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
	max-width: 500px;
}

.btn-close {
	filter: brightness(0) invert(1);
}

.modal-header.bg-warning .btn-close {
	filter: none;
}
</style>
