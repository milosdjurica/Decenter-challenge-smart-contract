import { network, ethers, getNamedAccounts, deployments } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { VaultInfo } from "../../typechain-types";
import { developmentChains } from "../../utils/helper.config";

console.log("unit test");
const isDevelopmentChain = developmentChains.includes(network.name);
const IS_FORKED_NETWORK = "forking" in network.config;
const executeTest = isDevelopmentChain && !IS_FORKED_NETWORK;

executeTest
	? describe("Example Unit Tests", () => {
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
		})
	: describe.skip;
