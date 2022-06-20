pragma solidity ^0.5.0;

contract InternetConnection{

    address payable private owner = 0x0000000000000000000000000000000000000000;

    constructor() public {
        owner = msg.sender;
    }

    event productPurchased(address payable owner, address payable buyer, uint product_id, uint price );

    // Buy an internet service
    function purchaseProduct(uint productId) public payable{

        require(productId >= 0 && productId <= 4);
        require(owner != msg.sender);

        owner.transfer(msg.value);

        emit productPurchased(owner, msg.sender, productId, msg.value);
    }

    // Get the owner address
    function getOwner() public view returns (address){
        return owner;
    }
}