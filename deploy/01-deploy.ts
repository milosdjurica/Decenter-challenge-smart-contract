import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
	MANAGER_ADDRESS,
	VAT_ADDRESS,
	developmentChains,
} from "../utils/helper.config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { getNamedAccounts, deployments, network, ethers } = hre;
	const { deployer } = await getNamedAccounts();
	const { deploy, log } = deployments;

	const IS_DEV_CHAIN = developmentChains.includes(network.name);
	const IS_FORKED_NETWORK = "forking" in network.config;

	let vatAddress;
	let managerAddress;

	if (IS_FORKED_NETWORK) {
		vatAddress = VAT_ADDRESS;
		managerAddress = MANAGER_ADDRESS;
	} else if (IS_DEV_CHAIN) {
		vatAddress = (await deployments.get("VatMock")).address;
		managerAddress = (await deployments.get("ManagerMock")).address;
	}

	const vault = await deploy("VaultInfo", {
		from: deployer,
		args: [managerAddress, vatAddress], // ! constructor args
		log: true,
	});

	log(`VaultInfo contract: `, vault.address);
};
export default func;
func.id = "deploy_example"; // id required to prevent re-execution
func.tags = ["example", "all"];
