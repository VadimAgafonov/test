import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import type { Account } from '@/types/account';

export const useAccountsStore = defineStore('accounts', () => {
	const accounts = ref<Account[]>([]);

	// Загрузка данных из localStorage при монтировании
	onMounted(() => {
		const savedAccounts = localStorage.getItem('accounts');
		if (savedAccounts) {
			accounts.value = JSON.parse(savedAccounts);
		}
	});

	// Метод добавления учетной записи
	function addAccount(account: Account) {
		accounts.value.push(account);
		saveToLocalStorage();
	}

	// Метод удаления учетной записи
	function removeAccount(id: number) {
		accounts.value = accounts.value.filter((account) => account.id !== id);
		saveToLocalStorage();
	}

	// Метод обновления учетной записи
	function updateAccount(updatedAccount: Account) {
		const index = accounts.value.findIndex((account) => account.id === updatedAccount.id);
		if (index !== -1) {
			accounts.value[index] = updatedAccount;
		}
		saveToLocalStorage();
	}

	// Сохранение данных в localStorage
	function saveToLocalStorage() {
		localStorage.setItem('accounts', JSON.stringify(accounts.value));
	}

	return { accounts, addAccount, removeAccount, updateAccount };
});
