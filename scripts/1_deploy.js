async function main() {
  // Fetch contract to deploy
  const Home = await ethers.getContractFactory("Home")
  
  // Deploy contract
  const home = await Home.deploy()
  await home.deployed()
  console.log(`Token deployed to: ${home.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
