import { useRef } from 'react'

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
]

const NetworkSettings = () => {
  const selectElement = useRef<HTMLSelectElement | null>(null)

  const renderChainOptions = () => {
    return (
      <select ref={selectElement}>
        {defaultChains?.map(({ chainHexId, optionName }) => {
          return (
            <option key={chainHexId} value={chainHexId}>
              {optionName}
            </option>
          )
        })}
      </select>
    )
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

  // const addCustomNetwork = async () => {
  //   await window.ethereum.request({
  //     id: 1,
  //     jsonrpc: '2.0',
  //     method: 'wallet_addEthereumChain',
  //     params: [
  //       {
  //         chainId: '0x64',
  //         chainName: 'Gnosis',
  //         rpcUrls: ['https://rpc.ankr.com/gnosis'],
  //         iconUrls: [
  //           'https://xdaichain.com/fake/example/url/xdai.svg',
  //           'https://xdaichain.com/fake/example/url/xdai.png',
  //         ],
  //         nativeCurrency: {
  //           name: 'xDAI',
  //           symbol: 'xDAI',
  //           decimals: 18,
  //         },
  //         blockExplorerUrls: ['https://blockscout.com/poa/xdai/'],
  //       },
  //     ],
  //   })
  // }

  return (
    <>
      <h2>Network Setting</h2>
      <div className='selectLabel__wrapper'>
        <label> Chain ID (HEX / Decimal / Chain Name): </label>
        {renderChainOptions()}
        <button onClick={changeNetwork}>Change to test network</button>
      </div>

      {/* <button onClick={addCustomNetwork}>Add custom network</button> */}
    </>
  )
}

export default NetworkSettings
