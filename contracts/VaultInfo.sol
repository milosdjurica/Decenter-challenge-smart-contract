/**
 * Submitted for verification at Etherscan.io on 2020-11-03
 */

/**
 * Submitted for verification at Etherscan.io on 2019-12-25
 */

pragma solidity ^0.6.0;

contract DSMath {
    function add(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require((z = x + y) >= x);
    }

    function sub(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require((z = x - y) <= x);
    }

    function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function min(uint256 x, uint256 y) internal pure returns (uint256 z) {
        return x <= y ? x : y;
    }

    function max(uint256 x, uint256 y) internal pure returns (uint256 z) {
        return x >= y ? x : y;
    }

    function imin(int256 x, int256 y) internal pure returns (int256 z) {
        return x <= y ? x : y;
    }

    function imax(int256 x, int256 y) internal pure returns (int256 z) {
        return x >= y ? x : y;
    }

    uint256 constant WAD = 10 ** 18;
    uint256 constant RAY = 10 ** 27;

    function wmul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = add(mul(x, y), WAD / 2) / WAD;
    }

    function rmul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = add(mul(x, y), RAY / 2) / RAY;
    }

    function wdiv(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = add(mul(x, WAD), y / 2) / y;
    }

    function rdiv(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = add(mul(x, RAY), y / 2) / y;
    }

    function rpow(uint256 x, uint256 n) internal pure returns (uint256 z) {
        z = n % 2 != 0 ? x : RAY;

        for (n /= 2; n != 0; n /= 2) {
            x = rmul(x, x);

            if (n % 2 != 0) {
                z = rmul(z, x);
            }
        }
    }
}

contract Vat {
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
}

abstract contract Manager {
    function ilks(uint256) public view virtual returns (bytes32);
    function owns(uint256) public view virtual returns (address);
    function urns(uint256) public view virtual returns (address);
}

abstract contract DSProxy {
    function owner() public view virtual returns (address);
}

contract VaultInfo is DSMath {
    // Compiler 0.6.0 doesn't support immutable variables
    Manager public manager;
    Vat public vat;

    constructor(address _managerAddress, address _vatAddress) public {
        manager = Manager(_managerAddress);
        vat = Vat(_vatAddress);
    }

    function _getProxyOwner(address owner) external view returns (address userAddr) {
        DSProxy proxy = DSProxy(owner);
        userAddr = proxy.owner();
    }

    function getCdpInfo(uint256 _cdpId)
        external
        view
        returns (address urn, address owner, address userAddr, bytes32 ilk, uint256 collateral, uint256 debt)
    {
        ilk = manager.ilks(_cdpId);
        urn = manager.urns(_cdpId);
        owner = manager.owns(_cdpId);
        userAddr = address(0);
        try this._getProxyOwner(owner) returns (address user) {
            userAddr = user;
        } catch {}

        (collateral, debt) = vat.urns(ilk, urn);
    }

    function getCdpInfoWithDebtWithRate(uint256 _cdpId)
        external
        view
        returns (
            address urn,
            address owner,
            address userAddr,
            bytes32 ilk,
            uint256 collateral,
            uint256 debt,
            uint256 debtWithRate
        )
    {
        ilk = manager.ilks(_cdpId);
        urn = manager.urns(_cdpId);
        owner = manager.owns(_cdpId);
        (, uint256 debtRate,,,) = vat.ilks(ilk);
        userAddr = address(0);
        try this._getProxyOwner(owner) returns (address user) {
            userAddr = user;
        } catch {}

        (collateral, debt) = vat.urns(ilk, urn);
        debtWithRate = rdiv(rmul(debt, debtRate), 1e27);
    }
}
