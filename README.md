# Transactions using Ropsten


This is sample app in which you can transfer ether from one walllet to another wallet using Ropsten test network. 

## Prerequisite

- Basic Reactjs
- Basic Solidity
- Nodejs
- Understanding of basics of Blockchain
- Most important is your will to learn and understand

## Technology/Tools
- Nodejs (v16.14.2)
- ReactJs
- Metamask
- Alchemy for deployment
- Other dependency packages will be inside package.json file


## Command

Install the dependencies and devDependencies and start the front.

```sh
npm i
npm start
```

For smart contract deploymenyt add Alchemy url and and wallet private key inside smart_contract/hardhat.config.js then deploy the contract using command

```sh
npx hardhat run scripts/deploy.js --network ropsten
```
Then you will get transaction address, copy the Traansactions address and paste inside client/src/utils/constants.js as CONTRACT_ADDRESS also paste the Transaction.json file here as well. Once you deployed the smart contract. You will get abi inside artifacts/contracts/Transactions.sol/Transactions.json



## License

MIT

**Happy coding!😀**
