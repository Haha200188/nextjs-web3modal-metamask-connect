import Web3Modal from "web3modal"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { abi } from "@/constants/abi"

let web3Modal

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: { 1: process.env.NEXT_PUBLIC_RPC_URL } // rpc: { [chainId]: rpcUrl }
    }
  }
}

if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions
  })
}

export default function Home () {
  const [isConnected, setIsConnected] = useState(false)
  const [hasMetamask, setHasMetamask] = useState(false)
  const [signer, setSigner] = useState(undefined)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasMetamask(true)
    }
  })
  async function connect () {
    if (typeof window !== "undefined") {
      try {
        const web3ModalProvider = await web3Modal.connect()
        setIsConnected(true)
        const provider = new ethers.providers.Web3Provider(web3ModalProvider)
        setSigner(provider.getSigner())
      } catch (e) {
        console.log(e)
      }
    } else {
      setIsConnected(false)
    }
  }

  async function execute () {
    if (typeof window !== "undefined") {
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        await contract.store(88)
      } catch (e) {
        console.log(e)
      }
    } else {
      console.log("Please install Metamask")
    }
  }

  return (
    <>
      {hasMetamask ?
        (isConnected ?
          ("Connected!"
          ) : (
            <button onClick={() => connect()}>Connect</button>)
        ) : (
          "Please install metamask"
        )}

      {isConnected ? (<button onClick={() => execute()}>Execute</button>) : ""}
    </>
  )
}
