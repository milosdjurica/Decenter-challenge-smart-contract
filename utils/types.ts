export type VaultResponseType = {
	urn: string;
	owner: string;
	userAddr: string;
	ilk: string;
	collateral: string;
	debt: string;
};

export type VatSetIlkParamType = {
	ilk: string;
	art: string;
	rate: string;
	spot: string;
	line: string;
	dust: string;
};
