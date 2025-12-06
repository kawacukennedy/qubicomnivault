// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title oqAsset
 * @dev ERC-20 token representing tokenized real-world assets on Qubic
 * Each oqAsset is backed by verified documents and valuations
 */
contract oqAsset is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    struct AssetMetadata {
        string documentHash;      // IPFS hash of original document
        uint256 valuation;        // USD valuation in cents
        uint256 maturityDate;     // When the asset matures
        address creator;          // Who created this asset
        bool isActive;           // Whether asset is still valid
        string assetType;        // "invoice", "contract", etc.
    }

    mapping(uint256 => AssetMetadata) public assetMetadata;
    mapping(address => bool) public authorizedMinters;
    uint256 public nextAssetId = 1;

    event AssetMinted(uint256 indexed assetId, address indexed owner, uint256 amount, uint256 valuation);
    event AssetBurned(uint256 indexed assetId, address indexed owner, uint256 amount);
    event MinterAuthorized(address indexed minter);
    event MinterRevoked(address indexed minter);

    modifier onlyAuthorizedMinter() {
        require(authorizedMinters[msg.sender] || msg.sender == owner(), "Not authorized to mint");
        _;
    }

    constructor() ERC20("oqAsset", "OQA") {}

    /**
     * @dev Authorize an address to mint oqAssets
     */
    function authorizeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
        emit MinterAuthorized(minter);
    }

    /**
     * @dev Revoke minting authorization
     */
    function revokeMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit MinterRevoked(minter);
    }

    /**
     * @dev Mint oqAsset tokens with metadata
     */
    function mintAsset(
        address to,
        uint256 amount,
        string memory documentHash,
        uint256 valuation,
        uint256 maturityDate,
        string memory assetType
    ) external onlyAuthorizedMinter nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be positive");
        require(valuation > 0, "Valuation must be positive");
        require(maturityDate > block.timestamp, "Maturity must be in future");

        uint256 assetId = nextAssetId++;
        assetMetadata[assetId] = AssetMetadata({
            documentHash: documentHash,
            valuation: valuation,
            maturityDate: maturityDate,
            creator: msg.sender,
            isActive: true,
            assetType: assetType
        });

        _mint(to, amount);
        emit AssetMinted(assetId, to, amount, valuation);
        return assetId;
    }

    /**
     * @dev Burn oqAsset tokens (when asset is repaid/liquidated)
     */
    function burnAsset(uint256 assetId, uint256 amount) external {
        require(assetMetadata[assetId].isActive, "Asset not active");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _burn(msg.sender, amount);
        emit AssetBurned(assetId, msg.sender, amount);
    }

    /**
     * @dev Deactivate an asset (admin function)
     */
    function deactivateAsset(uint256 assetId) external onlyOwner {
        assetMetadata[assetId].isActive = false;
    }

    /**
     * @dev Get asset metadata
     */
    function getAssetMetadata(uint256 assetId) external view returns (AssetMetadata memory) {
        return assetMetadata[assetId];
    }

    /**
     * @dev Check if asset is eligible for collateral (not matured, active)
     */
    function isEligibleForCollateral(uint256 assetId) external view returns (bool) {
        AssetMetadata memory metadata = assetMetadata[assetId];
        return metadata.isActive && metadata.maturityDate > block.timestamp;
    }
}