pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/InternetConnection.sol";

contract TestInternetConnection{

    // The address of the adoption contract to be tested
    InternetConnection internetConnection = InternetConnection(DeployedAddresses.InternetConnection());

    // The expected owner of the adopted pet is this contract
    address expectedOwner = address(this);
    uint productId = 1;

    // Buy an internet service
    function testPurchaseProduct() public {

        uint expectedproductID = internetConnection.purchaseProduct(productId);

        Assert.equal(expectedproductID, productId, "Should be equal");
        
    }

    // Testing the adopt() function
    function testGetOwner() public {
        address returnedOwner = internetConnection.getOwner();

        Assert.equal(returnedOwner, expectedOwner, "The expected owner should be the contract");
    }   


}