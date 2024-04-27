import { network, ethers, getNamedAccounts, deployments } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { VaultInfo } from "../../typechain-types";
import { developmentChains } from "../../utils/helper.config";

const isMainnetFork = network.name === "forkedMainnet";
console.log("integration test");

!isMainnetFork
	? describe.skip
	: describe("Mainnet Tests", () => {
			const CHAIN_ID = network.config.chainId;
			console.log("CHAIN_ID", CHAIN_ID);
			let vault: VaultInfo;

			beforeEach(async () => {
				await deployments.fixture(["all"]);
				vault = await ethers.getContract("VaultInfo");
			});

			describe("Constructor Tests", () => {
				it("Example test", async () => {
					assert.equal(1, 1);
				});
			});

			describe("Call CDP ID with debt rate", () => {
				it("Example test", async () => {
					console.log(await vault.getCdpInfoWithDebtWithRate(31214));
					console.log(await vault.getCdpInfoWithDebtWithRate(31039));
				});
			});
		});
