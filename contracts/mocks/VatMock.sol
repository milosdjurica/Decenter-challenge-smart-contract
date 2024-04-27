// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import {Vat} from "../VaultInfo.sol";

contract VatMock {
    struct Urn {
        uint256 ink;
        uint256 art;
    }

    struct Ilk {
        uint256 Art;
        uint256 rate;
        uint256 spot;
        uint256 line;
        uint256 dust;
    }

    mapping(bytes32 => mapping(address => Urn)) public urns;
    mapping(bytes32 => Ilk) public ilks;

    function setUrn(bytes32 _ilk, address _account, uint256 _ink, uint256 _art) external {
        urns[_ilk][_account] = Urn(_ink, _art);
    }

    function setIlk(bytes32 _ilk, uint256 _art, uint256 _rate, uint256 _spot, uint256 _line, uint256 _dust) external {
        ilks[_ilk] = Ilk(_art, _rate, _spot, _line, _dust);
    }
}
