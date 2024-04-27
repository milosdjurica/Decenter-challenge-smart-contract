import { BytesLike } from "ethers";

export type VaultResponseType = {
	urn: string;
	owner: string;
	userAddr: string;
	ilk: BytesLike;
	collateral: bigint;
	debt: bigint;
};

export type VaultResponseTypeWithDebtRate = VaultResponseType & {
	debtRate: bigint;
};

export type VatSetIlkParamType = {
	ilk: BytesLike;
	art: bigint;
	rate: bigint;
	spot: bigint;
	line: bigint;
	dust: bigint;
};
