import './sendTransaction.scss'
import { useRef, useState } from 'react'
import { ethers } from 'ethers'
import { JsonRpcSigner } from 'ethers'
import { FeeData } from 'ethers'

function SendTransaction() {
  const toAddress = useRef<HTMLInputElement | null>(null)
  const [nonce, setNonce] = useState('')
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [feeData, setFeeData] = useState<
    Pick<FeeData, 'maxFeePerGas' | 'maxPriorityFeePerGas'>
  >({
    maxFeePerGas: null,
    maxPriorityFeePerGas: null,
  })

  const connectToMetaMask = async () => {
    if (window.ethereum == null) return alert('MetaMask not installed!')

    const provider = new ethers.BrowserProvider(window.ethereum)

    const connectedSigner = await provider.getSigner()
    const nextNonce = await connectedSigner.getNonce()
    const currentFeeData = await provider.getFeeData()

    setFeeData(currentFeeData)
    setSigner(connectedSigner)
    setNonce(nextNonce.toString())
  }

  const isValidTransaction = () => {
    if (!toAddress.current?.value) {
      alert('To address is required.')
      return false
    }

    return true
  }

  const sendTransaction = async () => {
    if (!signer) return alert('Please connect to metamask account')
    if (!toAddress.current || !isValidTransaction()) return

    try {
      const transaction = {
        to: toAddress.current.value,
        value: ethers.parseEther('0.1'),
        ...(nonce ? { nonce: parseInt(nonce) } : {}),
        ...feeData,
        gasPrice: null,
      }

      const tx = await signer.sendTransaction(transaction)
      const receipt = await tx.wait()
      if (receipt?.status === 1) {
        alert(`transaction succeed!`)
      } else {
        alert(`transaction failed or reverted.`)
      }
    } catch (error) {
      console.error('Error occurred when sending transaction:', error)
      alert(error)
    }
  }

  return (
    <div className='sendTransaction__container'>
      <h2>Send Transaction</h2>
      <h3>Enter [To address] and [Nonce] to send!</h3>
      <p className='address'>address: {signer?.address}</p>
      <button onClick={connectToMetaMask}>Connect to metamask</button>
      <hr />
      <div className='inputLabel__wrapper'>
        <label>Nonce</label>
        <input
          type='number'
          value={nonce}
          onChange={(e) => setNonce(e.target.value)}
        />
      </div>
      <div className='inputLabel__wrapper required'>
        <label>To address </label>
        <input type='text' ref={toAddress} />
      </div>
      <button onClick={sendTransaction}>Send</button>
    </div>
  )
}

export default SendTransaction
