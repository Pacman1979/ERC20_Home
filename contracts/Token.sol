// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "hardhat/console.sol";

contract Token {
	string public name;
	string public symbol = "HOME";
	uint256 public decimals = 18;
	uint256 public totalSupply = 100000000 * (10**decimals);

	constructor(string memory _name) {
		name = _name;
	}
}
