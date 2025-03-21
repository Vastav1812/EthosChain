import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import type { Address } from 'viem';
import CrossChainCharityABI from '../assets/CrossChainCharityABI.json';

interface CrossChainDonationParams {
    destinationChain: string;
    destinationAddress: string;
    charityId: string;
    amount: string;
}

export const useCrossChainDonation = () => {
    const { writeContract, isPending, data: hash } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({
        hash,
    });
    
    const donateAcrossChain = async ({
        destinationChain,
        destinationAddress,
        charityId,
        amount
    }: CrossChainDonationParams) => {
        try {
            if (!writeContract) {
                throw new Error('Contract not initialized');
            }
            
            const parsedAmount = parseEther(amount);
            
            const tx = await writeContract({
                abi: CrossChainCharityABI.abi,
                address: (import.meta.env.VITE_CROSS_CHAIN_CONTRACT_ADDRESS || '') as Address,
                functionName: 'donateAcrossChain',
                args: [destinationChain, destinationAddress, charityId],
                value: parsedAmount
            });
            
            return tx;
        } catch (error) {
            console.error('Cross-chain donation failed:', error);
            throw error;
        }
    };
    
    return {
        donateAcrossChain,
        isLoading: isPending || isConfirming,
        transactionHash: hash
    };
}; 