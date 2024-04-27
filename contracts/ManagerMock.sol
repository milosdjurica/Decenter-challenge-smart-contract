// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import {Manager} from "./VaultInfo.sol";

contract ManagerMock is Manager {
    mapping(uint256 => bytes32) private s_ilks;
    mapping(uint256 => address) private s_owners;
    mapping(uint256 => address) private s_urns;

    function setIlks(uint256 _cdpId, bytes32 ilk) external {
        s_ilks[_cdpId] = ilk;
    }

    function setOwners(uint256 _cdpId, address owner) external {
        s_owners[_cdpId] = owner;
    }

    function setUrns(uint256 _cdpId, address urn) external {
        s_urns[_cdpId] = urn;
    }

    function ilks(uint256 _cdpId) public view override returns (bytes32) {
        return s_ilks[_cdpId];
    }

    function owns(uint256 _cdpId) public view override returns (address) {
        return s_owners[_cdpId];
    }

    function urns(uint256 _cdpId) public view override returns (address) {
        return s_urns[_cdpId];
    }
}
