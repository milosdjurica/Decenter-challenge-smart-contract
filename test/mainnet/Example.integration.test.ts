import { network, ethers, getNamedAccounts, deployments } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { VaultInfo } from "../../typechain-types";
import { MANAGER_ADDRESS, VAT_ADDRESS } from "../../utils/helper.config";

const IS_FORKED_NETWORK = "forking" in network.config;
const executeTest = IS_FORKED_NETWORK;

console.log("Integration test");

executeTest
	? describe("Mainnet Tests", () => {
			let vault: VaultInfo;

			beforeEach(async () => {
				await deployments.fixture(["all"]);
				vault = await ethers.getContract("VaultInfo");
			});

			describe("Constructor Tests", () => {
				it("Constructor test", async () => {
					const realManager = await vault.manager();
					const realVat = await vault.vat();

					assert.equal(realManager, MANAGER_ADDRESS);
					assert.equal(realVat, VAT_ADDRESS);
				});
			});

			describe("Call CDP ID with debt rate", () => {
				it("Example test", async () => {
					console.log(await vault.getCdpInfoWithDebtWithRate(31214));
					console.log(await vault.getCdpInfoWithDebtWithRate(31039));
				});
			});
		})
	: describe.skip;
