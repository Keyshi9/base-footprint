import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { base } from 'wagmi/chains'

export function FootprintStamper() {
    const { data: hash, isPending, sendTransaction, error } = useSendTransaction()
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })
    const { address, chain } = useAccount()

    const handleStamp = async () => {
        if (!address) return

        sendTransaction({
            to: address,
            value: parseEther('0'),
            chainId: base.id,
        })
    }

    const isWrongNetwork = chain?.id !== base.id

    return (
        <div className="glass-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <h2 style={{ marginTop: 0 }}>Base DeFi Footprint</h2>
            <p className="subtitle">
                Execute a 0 ETH transaction to yourself to create an on-chain footprint on Base.
            </p>

            <div style={{ margin: '2rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👣</div>
                {isWrongNetwork ? (
                    <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>
                        Please switch to Base network
                    </div>
                ) : (
                    <button
                        className="btn-primary"
                        disabled={isPending || isConfirming}
                        onClick={handleStamp}
                        style={{ width: '100%', padding: '1rem' }}
                    >
                        {isPending ? 'Confirm in Wallet...' :
                            isConfirming ? 'Processing...' :
                                'Stamp Footprint (0 ETH)'}
                    </button>
                )}
            </div>

            {hash && (
                <div style={{ textAlign: 'left', fontSize: '0.9rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                    <div style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Transaction Hash:</div>
                    <a
                        href={`https://basescan.org/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--base-blue)', textDecoration: 'none', wordBreak: 'break-all' }}
                    >
                        {hash}
                    </a>
                </div>
            )}

            {isConfirmed && (
                <div style={{ marginTop: '1rem', color: 'var(--success)', fontWeight: 'bold' }}>
                    Transaction Confirmed! 🎉
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
