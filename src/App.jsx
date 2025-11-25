import { useAccount } from 'wagmi'
import { WalletConnect } from './components/WalletConnect'
import { FootprintStamper } from './components/FootprintStamper'
import { NFTMinter } from './components/NFTMinter'

function App() {
  const { isConnected } = useAccount()

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '3rem'
    }}>
      <header style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2rem' }}>🔵</div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Base Footprint</h1>
        </div>
        <WalletConnect />
      </header>

      <main style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        {!isConnected ? (
          <div className="glass-card" style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h2>Welcome to Base</h2>
            <p className="subtitle">
              Connect your wallet to start building your on-chain history on the Base network.
              Low fees, fast transactions.
            </p>
            <div style={{ fontSize: '4rem', margin: '2rem 0', opacity: 0.5 }}>🔗</div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Please connect your wallet using the button top right.
            </p>
          </div>
        ) : (
          <>
            <FootprintStamper />
            <NFTMinter />
          </>
        )}
      </main>

      <footer style={{
        marginTop: 'auto',
        color: 'var(--text-secondary)',
        fontSize: '0.8rem',
        textAlign: 'center'
      }}>
        <p>Built for the Base Ecosystem</p>
      </footer>
    </div>
  )
}

export default App
