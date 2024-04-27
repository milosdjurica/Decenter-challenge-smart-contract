import { network, ethers, getNamedAccounts, deployments } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { VaultInfo } from "../../typechain-types";
import {
	MANAGER_ADDRESS,
	VAT_ADDRESS,
	VaultMainnetExample,
} from "../../utils/helper.config";

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
					const { collateral, debt, debtWithRate, ilk, owner, urn, userAddr } =
						VaultMainnetExample;
					const cdpInfo = await vault.getCdpInfoWithDebtWithRate(31214);
					assert.equal(cdpInfo.urn, urn);
					assert.equal(cdpInfo.owner, owner);
					assert.equal(cdpInfo.userAddr, userAddr);
					assert.equal(cdpInfo.ilk, ilk);
					assert.equal(cdpInfo.collateral, collateral);
					assert.equal(cdpInfo.debt, debt);
					assert.equal(cdpInfo.debtWithRate, debtWithRate);
				});
			});
		})
	: describe.skip;
