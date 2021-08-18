import Head from 'next/head'

import { useState, useEffect } from 'react';

import { ethers } from "ethers";

const EAS_CONTRACT = "0xBf49E19254DF70328C6696135958C94CD6cd0430"
const COMPETENCE_SCHEMA_UUID = "0x8978121879963d48b33ec2ad1f874c4888e46eec291c5e92415ab2261374fbaa"
const EAS_ABI = [{"inputs":[{"internalType":"contract IASRegistry","name":"registry","type":"address"},{"internalType":"contract IEIP712Verifier","name":"verifier","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":true,"internalType":"address","name":"attester","type":"address"},{"indexed":false,"internalType":"bytes32","name":"uuid","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"schema","type":"bytes32"}],"name":"Attested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":true,"internalType":"address","name":"attester","type":"address"},{"indexed":false,"internalType":"bytes32","name":"uuid","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"schema","type":"bytes32"}],"name":"Revoked","type":"event"},{"inputs":[],"name":"VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"bytes32","name":"schema","type":"bytes32"},{"internalType":"uint256","name":"expirationTime","type":"uint256"},{"internalType":"bytes32","name":"refUUID","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"attest","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"bytes32","name":"schema","type":"bytes32"},{"internalType":"uint256","name":"expirationTime","type":"uint256"},{"internalType":"bytes32","name":"refUUID","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"address","name":"attester","type":"address"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"attestByDelegation","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getASRegistry","outputs":[{"internalType":"contract IASRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"uuid","type":"bytes32"}],"name":"getAttestation","outputs":[{"components":[{"internalType":"bytes32","name":"uuid","type":"bytes32"},{"internalType":"bytes32","name":"schema","type":"bytes32"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"address","name":"attester","type":"address"},{"internalType":"uint256","name":"time","type":"uint256"},{"internalType":"uint256","name":"expirationTime","type":"uint256"},{"internalType":"uint256","name":"revocationTime","type":"uint256"},{"internalType":"bytes32","name":"refUUID","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct Attestation","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAttestationsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getEIP712Verifier","outputs":[{"internalType":"contract IEIP712Verifier","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"bytes32","name":"schema","type":"bytes32"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"},{"internalType":"bool","name":"reverseOrder","type":"bool"}],"name":"getReceivedAttestationUUIDs","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"bytes32","name":"schema","type":"bytes32"}],"name":"getReceivedAttestationUUIDsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"uuid","type":"bytes32"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"},{"internalType":"bool","name":"reverseOrder","type":"bool"}],"name":"getRelatedAttestationUUIDs","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"uuid","type":"bytes32"}],"name":"getRelatedAttestationUUIDsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"schema","type":"bytes32"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"},{"internalType":"bool","name":"reverseOrder","type":"bool"}],"name":"getSchemaAttestationUUIDs","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"schema","type":"bytes32"}],"name":"getSchemaAttestationUUIDsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"attester","type":"address"},{"internalType":"bytes32","name":"schema","type":"bytes32"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"},{"internalType":"bool","name":"reverseOrder","type":"bool"}],"name":"getSentAttestationUUIDs","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"bytes32","name":"schema","type":"bytes32"}],"name":"getSentAttestationUUIDsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"uuid","type":"bytes32"}],"name":"isAttestationValid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"uuid","type":"bytes32"}],"name":"revoke","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"uuid","type":"bytes32"},{"internalType":"address","name":"attester","type":"address"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"revokeByDelegation","outputs":[],"stateMutability":"nonpayable","type":"function"}]

export default function Home() {

  const [connected, setConnected] = useState(false)
  const [balance, setBalance] = useState(0)
  const [referralCount, setReferralCount] = useState(0)
  const [referralAddress, setReferralAddress] = useState('')
  const [referralRating, setReferralRating] = useState(0)

  useEffect(() => {
    setConnected(Boolean(window.ethereum.selectedAddress))
    getBalance()
    fetchReferrals()
  })

  async function connectWallet() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    setConnected(true)
  }

  async function fetchReferrals() {
    if (typeof window.ethereum !== 'undefined') {
      let account;
      if(connected) {
        account = window.ethereum.selectedAddress
      } else {
        setReferralCount(0)
        return
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(EAS_CONTRACT, EAS_ABI, provider)
      const data = await contract.getReceivedAttestationUUIDsCount(account, COMPETENCE_SCHEMA_UUID)
      setReferralCount(data.toNumber())
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined' & connected) {
      let account;
      if(connected) {
        account = window.ethereum.selectedAddress
      } else {
        setBalance(0)
        return
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(account)
      setBalance(balance.toString())
    }
  }

  async function sendReferral(e) {
    e.preventDefault()


    const AbiCoder = ethers.utils.AbiCoder;
    const abiCoder = new AbiCoder();
    const types = ["uint", "uint"]

    const encoded_data = abiCoder.encode(
      types,
      [1, referralRating]
    )

    if (typeof window.ethereum !== 'undefined') {
      await connectWallet()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(EAS_CONTRACT, EAS_ABI, signer)
      const transaction = await contract.attest(
        referralAddress,
        COMPETENCE_SCHEMA_UUID,
        100000000000000,
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        encoded_data
      )
      await transaction.wait()
      fetchReferrals()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Mazury Labs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold mb-10">
          Welcome to{' '}
          <a className="text-blue-600" href="#">
            Mazury
          </a>
        </h1>
        {connected
        ?
          <p className="text-green-500 font-semibold mb-10">
            Connected
          </p>
        :  
          <button onClick={connectWallet} className="underline focus:outline-none mb-10">
            Connect wallet
          </button>
        }
        
        <p className="focus:outline-none mb-2">
          Your balance is {balance} wei
        </p>
        <p className="focus:outline-none mb-10">
          You've got {referralCount} referrals
        </p>
        <form onSubmit={(e) => sendReferral(e)} className="flex flex-col">
          <label className="mb-1">Address</label>
          <input onChange={(e) => setReferralAddress(e.target.value)} className="border-2 mb-4 rounded-sm"></input>
          <label className="mb-1">Python rating</label>
          <input onChange={(e) => setReferralRating(e.target.value)} className="border-2 mb-4 rounded-sm"></input>
          <button type="submit" className="font-semibold text-gray-50 bg-blue-500 focus:outline-none mb-10 py-2 px-4 rounded-md">
            Refer them
          </button>
        </form>
      </main>
    </div>
  )
}
