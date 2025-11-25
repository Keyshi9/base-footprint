import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function WalletConnect() {
    const { address, isConnected } = useAccount()
    const { connectors, connect } = useConnect()
    const { disconnect } = useDisconnect()

    if (isConnected) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <button
                    className="btn-primary"
                    onClick={() => disconnect()}
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                    Disconnect
                </button>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            {connectors.map((connector) => (
                <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    className="btn-primary"
                >
                    Connect {connector.name}
                </button>
            ))}
        </div>
    )
}
