import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi'
import { NFT_CONTRACT_ADDRESS, NFT_ABI } from '../contracts/nftConfig'
import { base } from 'wagmi/chains'
import { useState, useEffect } from 'react'

export function NFTMinter() {
    const { data: hash, isPending, writeContract, error } = useWriteContract()
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })
    const { address, chain } = useAccount()
    const [mintedTokenId, setMintedTokenId] = useState(null)
    const [tokenAttributes, setTokenAttributes] = useState(null)

    // Read total supply
    const { data: totalSupply } = useReadContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'totalSupply',
    })

    // Read user's NFT balance
    const { data: userBalance } = useReadContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
    })

    const handleMint = async () => {
        if (!address) return

        try {
            writeContract({
                address: NFT_CONTRACT_ADDRESS,
                abi: NFT_ABI,
                functionName: 'mint',
                chainId: base.id,
            })
        } catch (err) {
            console.error('Mint error:', err)
        }
    }

    // When transaction is confirmed, get the token ID from events
    useEffect(() => {
        if (isConfirmed && totalSupply) {
            const tokenId = Number(totalSupply) - 1
            setMintedTokenId(tokenId)

            // Fetch token attributes
            fetchTokenAttributes(tokenId)
        }
    }, [isConfirmed, totalSupply])

    const fetchTokenAttributes = async (tokenId) => {
        try {
            const response = await fetch(`https://mainnet.base.org`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_call',
                    params: [{
                        to: NFT_CONTRACT_ADDRESS,
                        data: `0x${NFT_ABI.find(f => f.name === 'getTokenAttributes').selector}${tokenId.toString(16).padStart(64, '0')}`
                    }, 'latest'],
                    id: 1
                })
            })
            // For simplicity, we'll just show the token ID
            setTokenAttributes({ tokenId })
        } catch (err) {
            console.error('Error fetching attributes:', err)
        }
    }

    const isWrongNetwork = chain?.id !== base.id
    const isContractNotDeployed = NFT_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000"

    return (
        <div className="glass-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <h2 style={{ marginTop: 0 }}>Mint Random NFT</h2>
            <p className="subtitle">
                Mint a unique Base Footprint NFT with random attributes!
            </p>

            {isContractNotDeployed && (
                <div style={{
                    background: 'rgba(255, 165, 0, 0.1)',
                    border: '1px solid rgba(255, 165, 0, 0.3)',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    color: '#FFA500'
                }}>
                    ⚠️ Contract not deployed yet. Please deploy the contract and update the address in <code>src/contracts/nftConfig.js</code>
                </div>
            )}

            <div style={{ margin: '2rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>

                {totalSupply !== undefined && (
                    <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        Total Minted: {totalSupply.toString()}
                    </div>
                )}

                {userBalance !== undefined && userBalance > 0 && (
                    <div style={{ marginBottom: '1rem', color: 'var(--success)' }}>
                        You own: {userBalance.toString()} NFT{userBalance > 1 ? 's' : ''}
                    </div>
                )}

                {isWrongNetwork ? (
                    <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>
                        Please switch to Base network
                    </div>
                ) : (
                    <button
                        className="btn-primary"
                        disabled={isPending || isConfirming || isContractNotDeployed}
                        onClick={handleMint}
                        style={{ width: '100%', padding: '1rem' }}
                    >
                        {isPending ? 'Confirm in Wallet...' :
                            isConfirming ? 'Minting...' :
                                'Mint NFT'}
                    </button>
                )}
            </div>

            {hash && (
                <div style={{
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '1rem',
                    borderRadius: '12px',
                    marginBottom: '1rem'
                }}>
                    <div style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Transaction Hash:</div>
                    <a
                        href={`https://basescan.org/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--base-blue)', textDecoration: 'none', wordBreak: 'break-all' }}
                    >
                        {hash.slice(0, 10)}...{hash.slice(-8)}
                    </a>
                </div>
            )}

            {isConfirmed && mintedTokenId !== null && (
                <div style={{
                    background: 'rgba(0, 200, 83, 0.1)',
                    border: '1px solid rgba(0, 200, 83, 0.3)',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginTop: '1rem'
                }}>
                    <div style={{ color: 'var(--success)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        NFT Minted Successfully! 🎉
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Token ID: #{mintedTokenId}
                    </div>
                    <a
                        href={`https://opensea.io/assets/base/${NFT_CONTRACT_ADDRESS}/${mintedTokenId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-block',
                            marginTop: '0.5rem',
                            color: 'var(--base-blue)',
                            textDecoration: 'none'
                        }}
                    >
                        View on OpenSea →
                    </a>
                </div>
            )}

            {error && (
                <div style={{ marginTop: '1rem', color: 'var(--error)', fontSize: '0.9rem' }}>
                    Error: {error.message.split('\n')[0]}
                </div>
            )}
        </div>
    )
}
