// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const contractAddresses = {
	uniswapFactory: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
	fake1Token: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
	fake2Token: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
	myAddress: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
};
async function main() {
	const UniswapFactory = await hre.ethers.getContractFactory(
		"UniswapV2Factory"
	);
	const uniswapFactory = await UniswapFactory.attach(
		contractAddresses.uniswapFactory
	);

	// token contracts
	const Fake1Token = await hre.ethers.getContractFactory("Fake1Token");
	const fake1Token = await Fake1Token.attach(contractAddresses.fake1Token);

	const Fake2Token = await hre.ethers.getContractFactory("Fake2Token");
	const fake2Token = await Fake2Token.attach(contractAddresses.fake2Token);

	// await addFakeTokensPair(uniswapFactory, fake1Token, fake2Token);
	await addMoreLiquidity(uniswapFactory, fake1Token, fake2Token);
}

async function addFakeTokensPair(uniswapFactory, fake1Token, fake2Token) {
	// add tokens
	await fake1Token.mintToken(4000);
	await fake2Token.mintToken(4000);

	await uniswapFactory.createPair(fake1Token.address, fake2Token.address);
	const pairAddress = await uniswapFactory.getPair(
		fake1Token.address,
		fake2Token.address
	);
	console.log(pairAddress, " Token pair address");
	const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
	const fakeTokensPair = UniswapV2Pair.attach(pairAddress);

	// provide initial liquidity
	await fake1Token.transfer(pairAddress, 2000);
	await fake2Token.transfer(pairAddress, 2000);
	console.log(
		await fake2Token.balanceOf(pairAddress),
		await fake1Token.balanceOf(pairAddress),
		" Balance of contract pair"
	);
	console.log(await fakeTokensPair.getReserves(), " Pair reserves");
	console.log(await fakeTokensPair.totalSupply(), " Total supply rn");
	// mint LP tokens
	console.log(
		await fakeTokensPair.mint(contractAddresses.myAddress),
		" -- LP rewards"
	);

	// check LP tokens balance
	console.log(
		await fakeTokensPair.balanceOf(contractAddresses.myAddress),
		" -- Checking LP tokens"
	);
	return;
}
async function addMoreLiquidity(uniswapFactory, fake1Token, fake2Token) {
	// await uniswapFactory.createPair(fake1Token.address, fake2Token.address);
	const pairAddress = await uniswapFactory.getPair(
		fake1Token.address,
		fake2Token.address
	);
	console.log(pairAddress, " Token pair address");
	const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
	const fakeTokensPair = UniswapV2Pair.attach(pairAddress);

	// provide initial liquidity
	await fake1Token.transfer(pairAddress, 2000);
	await fake2Token.transfer(pairAddress, 2000);
	console.log(
		await fake2Token.balanceOf(pairAddress),
		await fake1Token.balanceOf(pairAddress),
		" Balance of contract pair"
	);
	console.log(await fakeTokensPair.getReserves(), " Pair reserves");
	console.log(await fakeTokensPair.totalSupply(), " Total supply rn");

	// mint LP tokens
	console.log(
		await fakeTokensPair.mint(contractAddresses.myAddress),
		" -- LP rewards"
	);

	// check LP tokens balance
	console.log(
		await fakeTokensPair.balanceOf(contractAddresses.myAddress),
		" -- Checking LP tokens"
	);
	return;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
