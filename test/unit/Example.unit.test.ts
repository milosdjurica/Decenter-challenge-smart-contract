import { network, ethers, getNamedAccounts, deployments } from "hardhat";
import { assert, expect } from "chai";
import {
	DSProxy,
	ManagerMock,
	VatMock,
	VaultInfo,
} from "../../typechain-types";
import {
	CDP_ID,
	MANAGER_ADDRESS,
	VAT_ADDRESS,
	VAULT_RESPONSE_EXAMPLE,
	VatSetIlkParam,
	ZERO_ADDRESS,
	developmentChains,
} from "../../utils/helper.config";
import { ZeroAddress } from "ethers";

console.log("unit test");
const isDevelopmentChain = developmentChains.includes(network.name);
const IS_FORKED_NETWORK = "forking" in network.config;
const executeTest = isDevelopmentChain && !IS_FORKED_NETWORK;

executeTest
	? describe("Example Unit Tests", () => {
			let vault: VaultInfo;
			let vatMock: VatMock;
			let managerMock: ManagerMock;

			beforeEach(async () => {
				await deployments.fixture(["all"]);
				vault = await ethers.getContract("VaultInfo");
				vatMock = await ethers.getContract("VatMock");
				managerMock = await ethers.getContract("ManagerMock");
			});

			describe("managerMockTests", () => {
				it("returns zero values if not set up", async () => {
					const ilks = await managerMock.ilks(CDP_ID);
					const urns = await managerMock.ilks(CDP_ID);
					const owners = await managerMock.ilks(CDP_ID);
					assert.equal(ilks, ZERO_ADDRESS);
					assert.equal(urns, ZERO_ADDRESS);
					assert.equal(owners, ZERO_ADDRESS);
				});

				it("should set ilks", async () => {
					const ilk = VAULT_RESPONSE_EXAMPLE.ilk;
					await managerMock.setIlks(CDP_ID, ilk);
					const storedIlk = await managerMock.ilks(CDP_ID);
					assert.equal(storedIlk, ilk);
				});

				it("should set owners", async () => {
					const owner = VAULT_RESPONSE_EXAMPLE.owner;
					await managerMock.setOwners(CDP_ID, owner);
					const storedOwner = await managerMock.owns(CDP_ID);
					assert.equal(storedOwner, owner);
				});

				it("should set urns", async () => {
					const urns = VAULT_RESPONSE_EXAMPLE.urn;
					await managerMock.setUrns(CDP_ID, urns);
					const storedUrns = await managerMock.urns(CDP_ID);
					assert.equal(storedUrns, urns);
				});
			});

			describe("vatMockTests", () => {
				it("Gets urn", async () => {
					const ilk = VAULT_RESPONSE_EXAMPLE.ilk;
					const urn = VAULT_RESPONSE_EXAMPLE.urn;
					const urns = await vatMock.urns(ilk, urn);
					assert.equal(urns.ink, BigInt(0));
					assert.equal(urns.art, BigInt(0));
				});

				it("Sets ilk", async () => {
					const { art, dust, ilk, line, rate, spot } = VatSetIlkParam;
					await vatMock.setIlk(
						ilk,
						BigInt(art),
						BigInt(rate),
						BigInt(spot),
						BigInt(line),
						BigInt(dust),
					);
					const ilksResponse = await vatMock.ilks(ilk);
					assert.equal(ilksResponse.Art, BigInt(art));
					assert.equal(ilksResponse.rate, BigInt(rate));
					assert.equal(ilksResponse.spot, BigInt(spot));
					assert.equal(ilksResponse.line, BigInt(line));
					assert.equal(ilksResponse.dust, BigInt(dust));
				});

				it("Sets urns", async () => {
					const ilk = VAULT_RESPONSE_EXAMPLE.ilk;
					const urn = VAULT_RESPONSE_EXAMPLE.urn;
					const collateral = VAULT_RESPONSE_EXAMPLE.collateral;
					const debt = VAULT_RESPONSE_EXAMPLE.debt;
					await vatMock.setUrn(ilk, urn, collateral, debt);
					const urnsResponse = await vatMock.urns(ilk, urn);
					assert.equal(urnsResponse.ink, BigInt(collateral));
					assert.equal(urnsResponse.art, BigInt(debt));
				});
			});

			describe("Constructor Tests", () => {
				it("Sets Manager and Vat correctly", async () => {
					const managerRealAddr = await vault.manager();
					const vatRealAddr = await vault.vat();
					const managerExpectedAddr = await managerMock.getAddress();
					const vatExpectedAddr = await vatMock.getAddress();
					assert.equal(managerRealAddr, managerExpectedAddr);
					assert.equal(vatRealAddr, vatExpectedAddr);
				});
			});

			describe("getCdpInfo", () => {
				const { collateral, debt, ilk, owner, urn } = VAULT_RESPONSE_EXAMPLE;
				const { art, dust, line, rate, spot } = VatSetIlkParam;

				beforeEach(async () => {
					await managerMock.setIlks(CDP_ID, ilk);
					await managerMock.setOwners(CDP_ID, owner);
					await managerMock.setUrns(CDP_ID, urn);
					await vatMock.setUrn(ilk, urn, collateral, debt);
					await vatMock.setIlk(
						ilk,
						BigInt(art),
						BigInt(rate),
						BigInt(spot),
						BigInt(line),
						BigInt(dust),
					);
				});

				it("Returns CDP info", async () => {
					const info = await vault.getCdpInfo(CDP_ID);
					assert.equal(info.urn, urn);
					assert.equal(info.owner, owner);
					assert.equal(info.userAddr, ZeroAddress);
					assert.equal(info.ilk, ilk);
					assert.equal(info.collateral, BigInt(collateral));
					assert.equal(info.debt, BigInt(debt));
				});

				it("Returns CDP info with debt rate", async () => {
					const rateReal = (await vatMock.ilks(ilk)).rate;
					const expectedDebtWithRate = (Number(debt) * Number(rate)) / 1e27;
					const info = await vault.getCdpInfoWithDebtWithRate(CDP_ID);

					assert.equal(rateReal, BigInt(rate));
					assert.equal(info.urn, urn);
					assert.equal(info.owner, owner);
					assert.equal(info.userAddr, ZeroAddress);
					assert.equal(info.ilk, ilk);
					assert.equal(info.collateral, BigInt(collateral));
					assert.equal(info.debt, BigInt(debt));
					assert.equal(Number(info.debtWithRate), expectedDebtWithRate);
				});
			});
		})
	: describe.skip;
