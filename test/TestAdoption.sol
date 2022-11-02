pragma solidity ^0.5.4;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoptions {
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

    function testUserCanAdoptPet() public {
        uint returnedId = adoption.adopt(8);
        uint expected = 8;
        Assert.equal(returnedId, expected, "Adoption of pet id 8 should be recorded.");
    }

    //  8号宠物的收养者应该是测试合约自己
    function testGetAdopterAddressByPet() public {
        address expected = address(this);
        address adopter = adoption.adopters(8);
        Assert.equal(expected, adopter, "Owner of pet id 8 should be recorded.");
    }

    function testGetAdopterAddressByPetIdInArray() public {
        address expected = address(this);
        address[16] memory adopters = adoption.getAdopters();
        Assert.equal(expected, adopters[8], "Owner of pet id 8 should be recorded.");
    }
}
