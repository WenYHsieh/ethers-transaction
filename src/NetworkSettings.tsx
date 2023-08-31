import { useEffect, useRef, useState } from 'react'
import './networkSettings.scss'

// metamask default chains
const defaultChains = [
  {
    chainHexId: '0x1',
    optionName: `0x1 / 1 / Ethereum main network (Mainnet)`,
  },
  { chainHexId: '0x5', optionName: `0x5 / 5 / Goerli test network` },
  {
    chainHexId: '0xaa36a7',
    optionName: `0xaa36a7 / 11155111 / Sepolia test network`,
  },
  {
    chainHexId: '0xe704',
    optionName: `0xe704 / 59140 / Linea Goerli test network`,
  },
  {
    chainHexId: '0x539',
    optionName: `0x539 / 1337 / Localhost test networks (including Ganache)`,
  },
]

type FormData = {
  networkName?: string
  newRpcURL: string
  chainID: string
  currencySymbol: string
  currencyName: string
  currencyDecimals: string
  blockExplorerURL: string
}

const formConfig: Array<{
  name: keyof FormData
  label: string
  require: boolean
}> = [
  { name: 'networkName', label: 'Network Name', require: false },
  { name: 'newRpcURL', label: 'New RPC URL', require: true },
  { name: 'chainID', label: 'Chain ID', require: true },
  { name: 'currencySymbol', label: 'Native Currency Symbol', require: true },
  { name: 'currencyName', label: 'Native Currency Name', require: true },
  {
    name: 'currencyDecimals',
    label: 'Native Currency Decimals',
    require: true,
  },
  { name: 'blockExplorerURL', label: 'block Explorer URL', require: true },
]

const NetworkSettings = () => {
  const selectElement = useRef<HTMLSelectElement | null>(null)
  const [chainId, setChainId] = useState('')
  const [formData, setFormData] = useState<FormData>({
    networkName: '',
    newRpcURL: '',
    chainID: '',
    currencySymbol: '',
    currencyName: '',
    currencyDecimals: '',
    blockExplorerURL: '',
  })

  const renderChainOptions = () => {
    return (
      <select ref={selectElement}>
        {defaultChains?.map(({ chainHexId, optionName }) => {
          return (
            <option
              key={chainHexId}
              value={chainHexId}
              selected={chainId === chainHexId}
            >
              {optionName}
            </option>
          )
        })}
      </select>
    )
  }

  const renderFields = () => {
    return formConfig?.map(({ name, label, require }) => {
      return (
        <div
          key={name}
          className={`inputLabel__wrapper ${require ? 'required' : ''}`}
        >
          <label>{label} </label>
          <input
            type='text'
            name={name}
            value={formData[name]}
            onChange={handleOnChange}
          />
        </div>
      )
    })
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value = '' } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const changeNetwork = async () => {
    if (!selectElement.current) return

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: selectElement.current.value,
        },
      ],
    })
  }

  const validForm = () => {
    const invalidField: Array<string> = []
    const requiredFieldName = formConfig
      .filter((fieldConfig) => {
        return fieldConfig.require
      })
      .map((fieldConfig) => fieldConfig.name)
    requiredFieldName.forEach((fieldName) => {
      if (!formData[fieldName]) invalidField.push(`${fieldName} is required.`)
    })
    return invalidField.length === 0 ? '' : invalidField.join('\n')
  }

  const addCustomNetwork = async () => {
    const errorMsg = validForm()
    if (errorMsg) return alert(errorMsg)

    const {
      networkName,
      newRpcURL,
      chainID,
      currencySymbol,
      currencyDecimals,
      currencyName,
      blockExplorerURL,
    } = formData

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: chainID,
          chainName: networkName,
          rpcUrls: [newRpcURL],
          nativeCurrency: {
            name: currencyName,
            symbol: currencySymbol,
            decimals: parseInt(currencyDecimals),
          },
          blockExplorerUrls: [blockExplorerURL],
        },
      ],
    })
  }

  useEffect(() => {
    const getChainId = async () => {
      if (window.ethereum == null) return alert('MetaMask not installed!')

      const currentChainId = await window.ethereum.request({
        method: 'eth_chainId',
      })
      setChainId(currentChainId)
    }
    getChainId()
  }, [])

  return (
    <>
      <h2>Network Setting</h2>
      <h4> Switch NetWork</h4>
      <hr />
      <div className='selectLabel__wrapper'>
        <label> Chain ID: </label>
        {renderChainOptions()}
      </div>
      <button type='submit' onClick={changeNetwork}>
        Send
      </button>

      <h4> Add Network</h4>
      <hr />
      <form>{renderFields()}</form>
      <button type='submit' onClick={addCustomNetwork}>
        Send
      </button>
    </>
  )
}

export default NetworkSettings
