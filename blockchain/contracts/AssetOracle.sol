// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AssetOracle
 * @dev Oracle for oqAsset valuations with multiple data sources
 */
contract AssetOracle is Ownable, ReentrancyGuard {
    struct Valuation {
        uint256 value;
        uint256 timestamp;
        address oracle;
        bool isActive;
    }

    struct AssetValuation {
        uint256 assetId;
        Valuation[] valuations;
        uint256 averageValue;
        uint256 lastUpdate;
        uint256 confidence; // 0-10000 (basis points)
    }

    mapping(uint256 => AssetValuation) public assetValuations;
    mapping(address => bool) public authorizedOracles;

    uint256 public constant MAX_VALUATION_AGE = 7 days;
    uint256 public constant MIN_ORACLES = 3;
    uint256 public constant MAX_ORACLE_DEVIATION = 500; // 5% max deviation

    event ValuationSubmitted(uint256 indexed assetId, address indexed oracle, uint256 value);
    event ValuationUpdated(uint256 indexed assetId, uint256 averageValue, uint256 confidence);
    event OracleAuthorized(address indexed oracle);
    event OracleRevoked(address indexed oracle);

    modifier onlyAuthorizedOracle() {
        require(authorizedOracles[msg.sender], "Not authorized oracle");
        _;
    }

    /**
     * @dev Authorize an oracle
     */
    function authorizeOracle(address oracle) external onlyOwner {
        authorizedOracles[oracle] = true;
        emit OracleAuthorized(oracle);
    }

    /**
     * @dev Revoke oracle authorization
     */
    function revokeOracle(address oracle) external onlyOwner {
        authorizedOracles[oracle] = false;
        emit OracleRevoked(oracle);
    }

    /**
     * @dev Submit valuation for an asset
     */
    function submitValuation(uint256 assetId, uint256 value) external onlyAuthorizedOracle {
        require(value > 0, "Invalid valuation");

        AssetValuation storage assetVal = assetValuations[assetId];
        if (assetVal.assetId == 0) {
            assetVal.assetId = assetId;
        }

        // Add new valuation
        assetVal.valuations.push(Valuation({
            value: value,
            timestamp: block.timestamp,
            oracle: msg.sender,
            isActive: true
        }));

        emit ValuationSubmitted(assetId, msg.sender, value);

        // Update average if we have enough valuations
        if (assetVal.valuations.length >= MIN_ORACLES) {
            _updateAverageValuation(assetId);
        }
    }

    /**
     * @dev Get current valuation for an asset
     */
    function getValuation(uint256 assetId) external view returns (uint256 value, uint256 confidence, uint256 timestamp) {
        AssetValuation memory assetVal = assetValuations[assetId];
        require(assetVal.assetId != 0, "Asset not found");
        require(block.timestamp - assetVal.lastUpdate <= MAX_VALUATION_AGE, "Valuation too old");

        return (assetVal.averageValue, assetVal.confidence, assetVal.lastUpdate);
    }

    /**
     * @dev Check if asset valuation is valid
     */
    function isValuationValid(uint256 assetId) external view returns (bool) {
        AssetValuation memory assetVal = assetValuations[assetId];
        if (assetVal.assetId == 0) return false;
        if (block.timestamp - assetVal.lastUpdate > MAX_VALUATION_AGE) return false;
        if (assetVal.confidence < 5000) return false; // Require 50% confidence

        return true;
    }

    /**
     * @dev Update average valuation using multiple oracle inputs
     */
    function _updateAverageValuation(uint256 assetId) internal {
        AssetValuation storage assetVal = assetValuations[assetId];
        uint256 activeValuations = 0;
        uint256 totalValue = 0;
        uint256[] memory values = new uint256[](assetVal.valuations.length);

        // Collect active valuations
        for (uint256 i = 0; i < assetVal.valuations.length; i++) {
            if (assetVal.valuations[i].isActive &&
                block.timestamp - assetVal.valuations[i].timestamp <= MAX_VALUATION_AGE) {
                values[activeValuations] = assetVal.valuations[i].value;
                totalValue += assetVal.valuations[i].value;
                activeValuations++;
            }
        }

        if (activeValuations < MIN_ORACLES) return;

        // Calculate average
        uint256 average = totalValue / activeValuations;

        // Calculate confidence based on deviation
        uint256 totalDeviation = 0;
        for (uint256 i = 0; i < activeValuations; i++) {
            uint256 deviation = values[i] > average ? values[i] - average : average - values[i];
            uint256 deviationPercent = (deviation * 10000) / average;
            totalDeviation += deviationPercent;
        }

        uint256 averageDeviation = totalDeviation / activeValuations;
        uint256 confidence = averageDeviation <= MAX_ORACLE_DEVIATION ?
            10000 - (averageDeviation * 10000) / MAX_ORACLE_DEVIATION : 0;

        // Update asset valuation
        assetVal.averageValue = average;
        assetVal.confidence = confidence;
        assetVal.lastUpdate = block.timestamp;

        emit ValuationUpdated(assetId, average, confidence);
    }

    /**
     * @dev Invalidate old valuations
     */
    function invalidateOldValuations(uint256 assetId) external onlyOwner {
        AssetValuation storage assetVal = assetValuations[assetId];
        require(assetVal.assetId != 0, "Asset not found");

        for (uint256 i = 0; i < assetVal.valuations.length; i++) {
            if (block.timestamp - assetVal.valuations[i].timestamp > MAX_VALUATION_AGE) {
                assetVal.valuations[i].isActive = false;
            }
        }

        // Recalculate average with active valuations
        if (assetVal.valuations.length >= MIN_ORACLES) {
            _updateAverageValuation(assetId);
        }
    }

    /**
     * @dev Get all valuations for an asset
     */
    function getAssetValuations(uint256 assetId) external view returns (Valuation[] memory) {
        return assetValuations[assetId].valuations;
    }

    /**
     * @dev Emergency pause oracle
     */
    function emergencyPause() external onlyOwner {
        // Implementation for emergency pause
    }
}