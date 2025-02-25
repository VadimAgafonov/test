export interface Label {
	text: string;
}

export interface Account {
	id: number;
	labels: Label[];
	labelsText?: string;
	type: 'LDAP' | 'Local';
	login: string;
	password?: string | null;
	isValidLogin?: boolean;
	isValidPassword?: boolean;
}
