<template>
	<div id="app">
		<AccountForm />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AccountForm from './components/AccountForm.vue';

export default defineComponent({
	components: {
		AccountForm,
	},
});
</script>
