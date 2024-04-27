import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

import "hardhat-deploy";
import "hardhat-deploy-ethers";
import { BLOCK_NUMBER } from "./utils/helper.config";

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "api-key";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "api-key";

const config: HardhatUserConfig = {
	solidity: {
		compilers: [{ version: "0.6.0" }],
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	defaultNetwork: "hardhat",
	networks: {
		hardhat: {
			chainId: 31337,

			// ! Uncomment this to run on forked mainnet
			// forking: {
			// 	url: MAINNET_RPC_URL,
			// 	blockNumber: BLOCK_NUMBER,
			// },
		},
	},
	namedAccounts: {
		deployer: {
			default: 0,
		},
		player: {
			default: 1,
		},
	},
	etherscan: {
		apiKey: {
			// mainnet: ETHERSCAN_API_KEY,
			sepolia: ETHERSCAN_API_KEY,
		},
	},
	gasReporter: {
		// put it enabled: true -> only when you want to check gas optimizations
		enabled: false,
		noColors: true,
		outputFile: "gas-report.txt",
		currency: "USD",
		excludeContracts: [],
		coinmarketcap: COINMARKETCAP_API_KEY,
	},
	mocha: {
		timeout: 500000, //500 seconds
	},
};

export default config;
