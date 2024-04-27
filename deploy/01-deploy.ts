import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../utils/helper.config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { getNamedAccounts, deployments, network, ethers } = hre;
	const { deployer } = await getNamedAccounts();
	const { deploy, log } = deployments;

	const IS_DEV_CHAIN = developmentChains.includes(network.name);
	console.log("network.name", network.name);

	let vatAddress;
	let managerAddress;

	if (IS_DEV_CHAIN) {
		vatAddress = (await deployments.get("VatMock")).address;
		managerAddress = (await deployments.get("ManagerMock")).address;
	} else {
		vatAddress = "0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B";
		managerAddress = "0x5ef30b9986345249bc32d8928B7ee64DE9435E39";
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
