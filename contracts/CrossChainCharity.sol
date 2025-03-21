// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CrossChainCharity is AccessControl, ReentrancyGuard {
    IAxelarGateway public immutable gateway;
    IAxelarGasService public immutable gasService;
    
    bytes32 public constant CROSS_CHAIN_ROLE = keccak256("CROSS_CHAIN_ROLE");
    
    struct CrossChainDonation {
        address donor;
        uint256 amount;
        string destinationChain;
        string destinationAddress;
        bool completed;
        uint256 timestamp;
    }
    
    mapping(bytes32 => CrossChainDonation) public donations;
    uint256 public donationCount;
    
    event CrossChainDonationInitiated(
        bytes32 indexed donationId,
        address indexed donor,
        uint256 amount,
        string destinationChain,
        string destinationAddress
    );
    
    event CrossChainDonationCompleted(
        bytes32 indexed donationId,
        string destinationChain
    );
    
    constructor(address _gateway, address _gasService) {
        gateway = IAxelarGateway(_gateway);
        gasService = IAxelarGasService(_gasService);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(CROSS_CHAIN_ROLE, msg.sender);
    }
    
    function donateAcrossChain(
        string memory destinationChain,
        string memory destinationAddress,
        string memory charityId
    ) external payable nonReentrant {
        require(msg.value > 0, "Must send value");
        require(bytes(destinationChain).length > 0, "Invalid destination chain");
        require(bytes(destinationAddress).length > 0, "Invalid destination address");
        
        bytes32 donationId = keccak256(abi.encodePacked(
            msg.sender,
            msg.value,
            destinationChain,
            destinationAddress,
            block.timestamp
        ));
        
        donations[donationId] = CrossChainDonation({
            donor: msg.sender,
            amount: msg.value,
            destinationChain: destinationChain,
            destinationAddress: destinationAddress,
            completed: false,
            timestamp: block.timestamp
        });
        
        donationCount++;
        
        bytes memory payload = abi.encode(
            donationId,
            msg.sender,
            msg.value,
            charityId
        );
        
        gasService.payNativeGasForContractCall{value: msg.value}(
            address(this),
            destinationChain,
            destinationAddress,
            payload,
            msg.sender
        );
        
        gateway.callContract(
            destinationChain,
            destinationAddress,
            payload
        );
        
        emit CrossChainDonationInitiated(
            donationId,
            msg.sender,
            msg.value,
            destinationChain,
            destinationAddress
        );
    }
    
    function _execute(
        string memory sourceChain,
        string memory sourceAddress,
        bytes32 commandId,
        bytes memory payload
    ) internal {
        require(
            gateway.validateContractCall(
                commandId,
                sourceChain,
                sourceAddress,
                keccak256(payload)
            ),
            "Not approved by gateway"
        );
        
        (
            bytes32 donationId,
            address donor,
            uint256 amount,
            string memory charityId
        ) = abi.decode(payload, (bytes32, address, uint256, string));
        
        donations[donationId].completed = true;
        
        emit CrossChainDonationCompleted(donationId, sourceChain);
    }
    
    function execute(
        bytes32 commandId,
        string memory sourceChain,
        string memory sourceAddress,
        bytes32 payloadHash,
        string memory payload
    ) external {
        require(hasRole(CROSS_CHAIN_ROLE, msg.sender), "Not authorized");
        _execute(sourceChain, sourceAddress, commandId, bytes(payload));
    }
} 