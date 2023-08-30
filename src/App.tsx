import './App.css'
import { useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { JsonRpcSigner } from 'ethers'
import { TransactionResponse } from 'ethers'

function App() {
  const toAddress = useRef<HTMLInputElement | null>(null)
  const [nonce, setNonce] = useState('')
  const [tx, setTx] = useState<TransactionResponse | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)

  const sendTransaction = async () => {
    if (!signer) return console.log('please connect to metamask account')
    if (toAddress.current === null)
      return console.log('please enter To address')

    const transaction = {
      to: toAddress.current.value,
      value: ethers.parseEther('0.1'), // Example value: 0.1 ETH
      nonce: parseInt(nonce),
    }

    const tx = await signer.sendTransaction(transaction)
    await tx.wait()
    setTx(tx)
  }

  useEffect(() => {
    const connectToMetaMask = async () => {
      let provider
      if (window.ethereum == null) {
        console.log('MetaMask not installed; using read-only defaults')
      } else {
        provider = new ethers.BrowserProvider(window.ethereum)

        const connectedSigner = await provider.getSigner()
        const nextNonce = await connectedSigner.getNonce()
        setSigner(connectedSigner)
        setNonce(nextNonce.toString())
      }
    }
    connectToMetaMask()
  }, [])

  return (
    <div>
      <h2>Send Transaction</h2>
      <h3>Enter [To address] and [nonce] to send!</h3>
      <h4>address: {signer?.address}</h4>
      Nonce:
      <input
        type='text'
        placeholder='Nonce'
        value={nonce}
        onChange={(e) => setNonce(e.target.value)}
      />
      <input type='text' placeholder='To Address' ref={toAddress} />
      <button onClick={sendTransaction}>Send Transaction</button>
      {tx?.hash && <p>Transaction Hash: {tx?.hash}</p>}
    </div>
  )
}

export default App
