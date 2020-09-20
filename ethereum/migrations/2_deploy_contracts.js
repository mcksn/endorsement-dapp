var Endorsement = artifacts.require("./Endorsement.sol");

module.exports = function (deployer) {
	deployer.deploy(Endorsement);
};