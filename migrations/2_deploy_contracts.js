var InternetConnection = artifacts.require("InternetConnection");

module.exports = function(deployer) {
  deployer.deploy(InternetConnection);
};