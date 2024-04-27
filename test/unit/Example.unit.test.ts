import { network, ethers, getNamedAccounts, deployments } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { ManagerMock, VatMock, VaultInfo } from "../../typechain-types";
import {
	CDP_ID,
	ILK,
	URN,
	VAULT_RESPONSE_EXAMPLE,
	ZERO_ADDRESS,
	developmentChains,
} from "../../utils/helper.config";

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
				it("getters", async () => {
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
					const urns = await vatMock.urns(ILK, URN);
					console.log("urns", urns);
				});
			});

			describe("Constructor Tests", () => {
				it("Example test", async () => {
					assert.equal(1, 1);
				});
			});

			describe("Call CDP ID with debt rate", () => {
				it("Example test", async () => {
					// console.log(await vault.getCdpInfoWithDebtWithRate(31214));
					// console.log(await vault.getCdpInfoWithDebtWithRate(31039));
				});
			});
		})
	: describe.skip;
