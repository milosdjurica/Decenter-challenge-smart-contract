import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../utils/helper.config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { getNamedAccounts, ethers, deployments, network } = hre;
	const { deployer } = await getNamedAccounts();
	const { deploy, log } = deployments;

	if (developmentChains.includes(network.name)) {
		console.log("Local network detected! Deploying mocks...");

		const vatMock = await deploy("VatMock", {
			from: deployer,
			args: [],
			log: true,
		});

		const managerMock = await deploy("ManagerMock", {
			from: deployer,
			args: [],
			log: true,
		});

		log("Mocks deployed!!!");
		log("===============================================================");
	}
};
export default func;
func.id = "00_deployMocks"; // id required to prevent re-execution
func.tags = ["mocks", "all"];
