import NetworkSettings from './NetworkSettings'
import SendTransaction from './SendTransaction'
import './App.scss'
import { useEffect } from 'react'

const App = () => {
  useEffect(() => {
    const handleChainChanged = () => window.location.reload()

    if (typeof window.ethereum === 'undefined')
      return alert('MetaMask not installed!')

    window.ethereum.on('chainChanged', handleChainChanged)
  }, [])
  return (
    <>
      <SendTransaction />
      <NetworkSettings />
    </>
  )
}

export default App
