import './sendTransaction.scss'
import { useEffect, useRef, useState } from 'react'
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
  const [formError, setFormError] = useState('')

  const isValidateTransaction = () => {
    if (!toAddress.current?.value) {
      setFormError('To address is required.')
      return false
    }

    return true
  }

  const sendTransaction = async () => {
    if (!signer) return alert('please connect to metamask account')
    if (!toAddress.current || !isValidateTransaction()) return

    try {
      const transaction = {
        to: toAddress.current.value,
        value: ethers.parseEther('0.1'),
        ...(nonce ? { nonce: parseInt(nonce) } : {}),
        ...feeData,
        gasPrice: null,
      }

      const tx = await signer.sendTransaction(transaction)
      await tx.wait()
      if (tx) alert(`transaction succeed!`)
    } catch (error) {
      console.error('Error occurred when sending transaction:', error)
      alert(error)
    }
  }

  useEffect(() => {
    const connectToMetaMask = async () => {
      if (window.ethereum == null)
        return alert('MetaMask not installed; using read-only defaults')

      const provider = new ethers.BrowserProvider(window.ethereum)

      const connectedSigner = await provider.getSigner()
      const nextNonce = await connectedSigner.getNonce()
      const currentFeeData = await provider.getFeeData()

      setFeeData(currentFeeData)
      setSigner(connectedSigner)
      setNonce(nextNonce.toString())
    }
    connectToMetaMask()
  }, [])

  return (
    <div className='sendTransaction__container'>
      <h2>Send Transaction</h2>
      <h3>Enter [To address] and [Nonce] to send!</h3>
      <p className='address'>address: {signer?.address}</p> <hr />
      <div className='inputLabel__wrapper'>
        <label>Nonce:</label>
        <input
          type='text'
          placeholder='Nonce'
          value={nonce}
          onChange={(e) => setNonce(e.target.value)}
        />
      </div>
      <div className='inputLabel__wrapper required'>
        <label>To address:</label>
        <input type='text' placeholder='To Address' ref={toAddress} />
      </div>
      {formError && <p>{formError}</p>}
      <button onClick={sendTransaction}>Send</button>
    </div>
  )
}

export default SendTransaction
