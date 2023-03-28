const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
	let token

	beforeEach(async () => {
		// Fetch Home from the Blockchain
		const Token = await ethers.getContractFactory('Token')
		token = await Token.deploy('Home')
	})

	it('has correct name', async () => {
		expect(await token.name()).to.equal('Home')
	})

	it('has correct symbol', async () => {
		expect(await token.symbol()).to.equal('HOME')
	})

	it('has correct decimals', async () => {
		expect(await token.decimals()).to.equal('18')
	})

	it('has correct total supply', async () => {
		expect(await token.totalSupply()).to.equal(tokens(100000000))
	})
})