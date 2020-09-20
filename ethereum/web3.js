import Web3 from 'web3';

const truffleConfig = require('./truffle-config');

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
	//In the browser where metamask has already injected web3
	web3 = new Web3(window.web3.currentProvider);
} else {
	const env = process.env.NODE_ENV || "development";
	const provider = new Web3.providers.HttpProvider(
		env== 'testnet' ?
			('https://rinkeby.infura.io/yeyODM5MwlsKyyJqs2vx') :
			(`http://${truffleConfig.networks[env].host}:${truffleConfig.networks[env].port}`));
	web3 = new Web3(provider);
}

export default web3;
