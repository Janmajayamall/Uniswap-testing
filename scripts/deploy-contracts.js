// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
	// Hardhat always runs the compile task when running scripts with its command
	// line interface.
	//
	// If this script is run directly using `node` you may want to call compile
	// manually to make sure everything is compiled
	// await hre.run('compile');

	// We get the contract to deploy
	const UniswapFactory = await hre.ethers.getContractFactory(
		"UniswapV2Factory"
	);
	const uniswapFactory = await UniswapFactory.deploy();
	await uniswapFactory.deployed();
	console.log(`Uniswap factory deployed at ${uniswapFactory.address}`);

	// token contracts
	const Fake1Token = await hre.ethers.getContractFactory("Fake1Token");
	const fake1Token = await Fake1Token.deploy(
		"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
	);
	await fake1Token.deployed();
	console.log(`Fake1Token deployed at ${fake1Token.address}`);

	const Fake2Token = await hre.ethers.getContractFactory("Fake2Token");
	const fake2Token = await Fake2Token.deploy(
		"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
	);
	await fake2Token.deployed();
	console.log(`Fake1Token deployed at ${fake2Token.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
