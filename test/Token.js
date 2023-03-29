const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
	let token, accounts, deployer, receiver, exchange

	beforeEach(async () => {
		// Fetch 'Token' from the Blockchain
		const Token = await ethers.getContractFactory('Token')
		token = await Token.deploy('Home', 'HOME', '100000000')

		accounts = await ethers.getSigners()
		deployer = accounts[0]
		receiver = accounts[1]
		exchange = accounts[2]
	})

	describe('Deployment', () => {
		const name = 'Home'
		const symbol = 'HOME'
		const decimals = '18'
		const totalSupply = tokens('100000000')

		it('has correct name', async () => {
			expect(await token.name()).to.equal(name)
		})

		it('has correct symbol', async () => {
			expect(await token.symbol()).to.equal(symbol)
		})

		it('has correct decimals', async () => {
			expect(await token.decimals()).to.equal(decimals)
		})

		it('has correct total supply', async () => {
			expect(await token.totalSupply()).to.equal(totalSupply)
		})

		it('assigns total supply to developer', async () => {
			expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
		})
	

	})

	describe('Sending Tokens', () => {
		let amount, transaction, result

		describe('Success', () => {

			beforeEach(async () => {
				amount = tokens(100)
				transaction = await token.connect(deployer).transfer(receiver.address, amount)
				result = await transaction.wait()
			})

			it('transfers token balances', async () => {
				// log balance before transfer
				// console.log("receiver balance before transfer", await token.balanceOf(receiver.address))
				// console.log("deployer balance before transfer", await token.balanceOf(deployer.address))

				// In order for us to test (dummy test) whether we can transfer tokens...
				// and then see if it's been done we have to connect the contract owner (the deployer)...
				// to the contract (token = Token).

				// Ensure that tokens were transferred (balance changed)
				expect(await token.balanceOf(deployer.address)).to.equal(tokens(99999900))
				expect(await token.balanceOf(receiver.address)).to.equal(amount)


				// console.log("deployer balance after transfer", await token.balanceOf(deployer.address))
				// console.log("receiver balance after transfer", await token.balanceOf(receiver.address))
			})

			it('emits a transfer event', async () => {
				const event = result.events[0]
				expect(event.event).to.equal('Transfer')

				const args = event.args
				expect(args.from).to.equal(deployer.address)
				expect(args.to).to.equal(receiver.address)
				expect(args.value).to.equal(amount)
			})

		})

		describe('Failure', () => {
			it('rejects insufficient balances', async () => {
				const invalidAmount = tokens(1000000000)
				await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
			})

			it('rejects invalid recipient', async () => {
				const amount = tokens(100)
				await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
			})
		})
	

	})

	describe('Approving Tokens', () => {
		let amount, transaction, result

		beforeEach(async () => {
			amount = tokens(100)
			transaction = await token.connect(deployer).approve(exchange.address, amount)
			result = await transaction.wait()
		})

		describe('Success', () => {
			it('allocates an allowance for delegated token spending', async () => {
				expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
			})

			it('emits an approval event', async () => {
				const event = result.events[0]
				expect(event.event).to.equal('Approval')

				const args = event.args
				expect(args.owner).to.equal(deployer.address)
				expect(args.spender).to.equal(exchange.address)
				expect(args.value).to.equal(amount)
			})
		})

		describe('Failure', () => {
			it('rejects invalid spenders', async () => {
				await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
			})
		})
	})
})








