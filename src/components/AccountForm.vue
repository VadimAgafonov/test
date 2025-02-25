<template>
	<v-container fluid class="fill-height d-flex align-center justify-center bg-grey-lighten-5">
		<v-card class="pa-8 rounded-lg elevation-6" max-width="600" width="100%">
			<v-card-title class="text-h5 font-weight-bold text-center mb-6">
				Управление учетными записями
			</v-card-title>

			<!-- Кнопка добавления записи -->
			<v-btn color="success" block class="mb-6" @click="addAccount">
				<v-icon left>mdi-plus</v-icon>
				Добавить запись
			</v-btn>

			<!-- Таблица учетных записей -->
			<v-list>
				<v-list-item v-for="(account, index) in accounts" :key="account.id" class="mb-4">
					<v-card flat outlined>
						<v-row dense>
							<!-- Метка -->
							<v-col cols="12">
								<v-text-field v-model="account.labelsText" label="Метка"
									placeholder="Введите метки через ;" @blur="updateLabels(account)" dense hide-details
									:error-messages="!isValidLabel(account) ? 'Неверный формат метки' : ''" outlined
									class="rounded-lg"></v-text-field>
							</v-col>

							<!-- Тип записи -->
							<v-col cols="12">
								<v-select v-model="account.type" :items="['LDAP', 'Локальная']" label="Тип записи"
									@change="togglePasswordField(account)" dense hide-details outlined
									class="rounded-lg"></v-select>
							</v-col>

							<!-- Логин -->
							<v-col cols="12">
								<v-text-field v-model="account.login" label="Логин" @blur="validateLogin(account)" dense
									hide-details :error-messages="!isValidLogin(account) ? 'Обязательное поле' : ''"
									outlined class="rounded-lg"></v-text-field>
							</v-col>

							<!-- Пароль -->
							<v-col cols="12" v-if="account.type === 'Локальная'">
								<v-text-field v-model="account.password" label="Пароль" type="password"
									@blur="validatePassword(account)" dense hide-details
									:error-messages="!isValidPassword(account) ? 'Обязательное поле' : ''" outlined
									class="rounded-lg"></v-text-field>
							</v-col>

							<!-- Кнопка удаления -->
							<v-col cols="12" class="text-right">
								<v-btn icon color="error" small @click="removeAccount(account.id)">
									<v-icon>mdi-delete</v-icon>
								</v-btn>
							</v-col>
						</v-row>
					</v-card>
				</v-list-item>
			</v-list>
		</v-card>
	</v-container>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useAccountsStore } from '../stores/accounts';
import type { Account } from '../types/account';

export default defineComponent({
	setup() {
		const store = useAccountsStore();
		const accounts = computed(() => store.accounts);

		let nextId = 1;

		function addAccount() {
			const newAccount: Account = {
				id: nextId++,
				labels: [],
				labelsText: '',
				type: 'LDAP',
				login: '',
				password: null,
				isValidLogin: false,
				isValidPassword: false,
			};
			store.addAccount(newAccount);
		}

		function removeAccount(id: number) {
			store.removeAccount(id);
		}

		function togglePasswordField(account: Account) {
			if (account.type === 'LDAP') {
				store.updateAccount({ ...account, password: null });
			}
		}

		function updateLabels(account: Account) {
			if (!account.labelsText || account.labelsText.trim() === '') {
				store.updateAccount({ ...account, labels: [] });
				return;
			}
			const labelsText = account.labelsText.split(';').map((text) => text.trim());
			const labels = labelsText
				.filter((text) => text.length > 0 && text.length <= 50)
				.map((text) => ({ text }));
			store.updateAccount({ ...account, labels });
		}

		function validateLogin(account: Account) {
			store.updateAccount({ ...account, isValidLogin: !!account.login && account.login.length <= 100 });
		}

		function validatePassword(account: Account) {
			store.updateAccount({
				...account,
				isValidPassword: !!account.password && account.password?.length <= 100,
			});
		}

		function isValidLabel(account: Account): boolean {
			return account.labels.every((label) => label.text.length <= 50);
		}

		function isValidLogin(account: Account): boolean {
			return (account.isValidLogin ?? false) && account.login.length <= 100;
		}

		function isValidPassword(account: Account): boolean {
			return account.type === 'Local'
				? (account.isValidPassword ?? false) && !!account.password && account.password.length <= 100
				: true;
		}

		return {
			accounts,
			addAccount,
			removeAccount,
			togglePasswordField,
			updateLabels,
			validateLogin,
			validatePassword,
			isValidLabel,
			isValidLogin,
			isValidPassword,
		};
	},
});
</script>

<style scoped>
/* Минималистичные стили */
.v-card {
	background-color: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(10px);
}

.v-btn {
	transition: all 0.3s ease;
}

.v-btn:hover {
	transform: scale(1.05);
}
</style>
