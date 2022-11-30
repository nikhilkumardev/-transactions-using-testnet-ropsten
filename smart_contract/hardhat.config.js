require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten:{
      url: "YOUR_alchemy_URL",
      accounts: ['WALLET PRIVATE KEYS']
    }
  }
}