import NetworkSettings from './NetworkSettings'
import SendTransaction from './SendTransaction'
import './App.scss'
import { useEffect } from 'react'

const App = () => {
  useEffect(() => {
    if (window.ethereum === null) return alert('MetaMask not installed!')
    const handleChainChanged = () => window.location.reload()

    window.ethereum.on('chainChanged', handleChainChanged)
  })
  return (
    <>
      <SendTransaction />
      <NetworkSettings />
    </>
  )
}

export default App
