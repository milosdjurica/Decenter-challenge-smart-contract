import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { getNamedAccounts, deployments } = hre;
	const { deployer } = await getNamedAccounts();
	const { deploy, log } = deployments;

	const vault = await deploy("VaultInfo", {
		from: deployer,
		args: [], // ! constructor args
		log: true,
	});

	log(`VaultInfo contract: `, vault.address);
};
export default func;
func.id = "deploy_example"; // id required to prevent re-execution
func.tags = ["example", "all"];
