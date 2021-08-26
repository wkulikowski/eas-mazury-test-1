import Head from 'next/head'

import axios from "axios";

import { useState, useEffect } from 'react';

import { ethers } from "ethers";

const EAS_CONTRACT = "0xBf49E19254DF70328C6696135958C94CD6cd0430"
const COMPETENCE_SCHEMA_UUID = "0x8978121879963d48b33ec2ad1f874c4888e46eec291c5e92415ab2261374fbaa"
const EAS_ABI = [{"inputs":[{"internalType":"contract IASRegistry","name":"registry","type":"address"},{"internalType":"contract IEIP712Verifier","name":"verifier","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":true,"internalType":"address","name":"attester","type":"address"},{"indexed":false,"internalType":"bytes32","name":"uuid","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"schema","type":"bytes32"}],"name":"Attested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":true,"internalType":"address","name":"attester","type":"address"},{"indexed":false,"internalType":"bytes32","name":"uuid","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"schema","type":"bytes32"}],"name":"Revoked","type":"event"},{"inputs":[],"name":"VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"bytes32","name":"schema","type":"bytes32"},{"internalType":"uint256","name":"expirationTime","type":"uint256"},{"internalType":"bytes32","name":"refUUID","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"attest","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"bytes32","name":"schema","type":"bytes32"},{"internalType":"uint256","name":"expirationTime","type":"uint256"},{"internalType":"bytes32","name":"refUUID","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"address","name":"attester","type":"address"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"attestByDelegation","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getASRegistry","outputs":[{"internalType":"contract IASRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"uuid","type":"bytes32"}],"name":"getAttestation","outputs":[{"components":[{"internalType":"bytes32","name":"uuid","type":"bytes32"},{"internalType":"bytes32","name":"schema","type":"bytes32"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"address","name":"attester","type":"address"},{"internalType":"uint256","name":"time","type":"uint256"},{"internalType":"uint256","name":"expirationTime","type":"uint256"},{"internalType":"uint256","name":"revocationTime","type":"uint256"},{"internalType":"bytes32","name":"refUUID","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct Attestation","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAttestationsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getEIP712Verifier","outputs":[{"internalType":"contract IEIP712Verifier","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"bytes32","name":"schema","type":"bytes32"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"},{"internalType":"bool","name":"reverseOrder","type":"bool"}],"name":"getReceivedAttestationUUIDs","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"bytes32","name":"schema","type":"bytes32"}],"name":"getReceivedAttestationUUIDsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"uuid","type":"bytes32"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"},{"internalType":"bool","name":"reverseOrder","type":"bool"}],"name":"getRelatedAttestationUUIDs","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"uuid","type":"bytes32"}],"name":"getRelatedAttestationUUIDsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"schema","type":"bytes32"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"},{"internalType":"bool","name":"reverseOrder","type":"bool"}],"name":"getSchemaAttestationUUIDs","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"schema","type":"bytes32"}],"name":"getSchemaAttestationUUIDsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"attester","type":"address"},{"internalType":"bytes32","name":"schema","type":"bytes32"},{"internalType":"uint256","name":"start","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"},{"internalType":"bool","name":"reverseOrder","type":"bool"}],"name":"getSentAttestationUUIDs","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"bytes32","name":"schema","type":"bytes32"}],"name":"getSentAttestationUUIDsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"uuid","type":"bytes32"}],"name":"isAttestationValid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"uuid","type":"bytes32"}],"name":"revoke","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"uuid","type":"bytes32"},{"internalType":"address","name":"attester","type":"address"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"revokeByDelegation","outputs":[],"stateMutability":"nonpayable","type":"function"}]

export default function Home() {

  const [connected, setConnected] = useState(false)
  const [referrals, setReferrals] = useState([])
  const [referralAddress, setReferralAddress] = useState('')
  const [referralRating, setReferralRating] = useState(0)
  const [network, setNetwork] = useState("")
  const [provider, setProvider] = useState(undefined)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    window.ethereum.on('chainChanged', function (networkId) {
      // Time to reload your interface with the new networkId
      window.location.reload()
      getNetwork()
    })
    setConnected(Boolean(window.ethereum.selectedAddress))
  }, [])

  useEffect(() => {
    if(connected){
      getNetwork()
    }
  }, [connected])

  useEffect(() => {
    if(network == "rinkeby"){
      fetchReferrals()
    }
  }, [network])

  useEffect(() => {
    calculateScore()
  }, [referrals])

  async function connectWallet() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    setConnected(true)
  }

  async function fetchReferrals() {
    const result = await axios.post(
      "https://api.studio.thegraph.com/query/5950/mazury-test-1/v1.0.0",
      {
        query: `{
          attestations(where: {recipient: \"0xF417ACe7b13c0ef4fcb5548390a450A4B75D3eB3\", revoked: false}) {
            id
            data
            schema {
              id
            }
            recipient
            attester
          }
        }`,
      }
    );
    setReferrals(result.data.data.attestations)
  }

  async function getNetwork() {
    if (typeof window.ethereum !== 'undefined' & connected) {
      const network = await provider.getNetwork()
      if(network.name != network){
        setNetwork(network.name)
      }
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

  function calculateScore() {
    setScore(103.5) // figure out the actual score mechanics later
  }

  function parseReferralData(referralData){

    const programmingLangMapping = {
      1: "Python"
    }

    const AbiCoder = ethers.utils.AbiCoder;
    const abiCoder = new AbiCoder();
    const types = ["uint", "uint"]

    const data = abiCoder.decode(
      types,
      referralData
    )

    return [
      programmingLangMapping[data[0].toNumber()],
      data[1].toString()
    ]
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Mazury Labs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col w-full flex-1 text-center">
        <nav className="flex flex-row justify-between px-20 py-4">
          <p className="font-semibold font-sans text-green-600 text-xl">Mazury</p>
          <input placeholder="Search any ENS or ETH address" className="w-72 ml-24 text-left border-2 border-gray-300 pl-7 py-1 focus:outline-none rounded-lg text-gray-500"></input>
          {connected
          ?
            <p className="text-green-500 font-semibold">
              Connected to {`${network}`}
            </p>
          :  
            <button onClick={connectWallet} className="underline focus:outline-none">
              Connect wallet
            </button>
          }
        </nav>
        {network == "rinkeby"
        ?
          <div className="max-w-screen-md mx-auto">
            <div className="fixed right-40 top-1/3 w-52 border-2 border-gray-900 h-48 text-left py-2 px-4 rounded-lg">
              <h2 className="font-semibold text-2xl mb-2">Your scores</h2>
              <ul className="font-medium">
                <li className="flex flex-row justify-between mb-1 text-green-500">
                  <p>Python</p>
                  <p>{score}</p>
                </li>
                <li className="flex flex-row justify-between mb-1 text-yellow-400">
                  <p>JavaScript</p>
                  <p>—</p>
                </li>
                <li className="flex flex-row justify-between mb-1 text-yellow-400">
                  <p>Solidity</p>
                  <p>—</p>
                </li>
                <li className="flex flex-row justify-between mb-1 text-yellow-400">
                  <p>Rust</p>
                  <p>—</p>
                </li>
              </ul>
            </div>
            <h2 className="mt-6 mb-4 text-4xl font-semibold text-left">Your referrals</h2>
            <ul>
              {referrals.map((referral) =>
                <li key={referral.id} className="border-2 border-green-300 rounded-lg bg-green-50 p-4 mb-4">
                  <p className="text-sm font-light">Referrer: {referral.attester}</p>
                  <div className="flex flex-row justify-between mx-auto w-44 mt-4 font-semibold text-green-800">
                    <p>{parseReferralData(referral.data)[0]}</p>
                    <p>{parseReferralData(referral.data)[1]}</p>
                  </div>
                </li>
              )}
            </ul>
            <h2 className="mt-10 mb-4 text-4xl font-semibold text-left">Refer somebody</h2>
            <form onSubmit={(e) => sendReferral(e)} className="flex flex-col">
              <label className="mb-1">Address</label>
              <input onChange={(e) => setReferralAddress(e.target.value)} className="border-2 mb-4 rounded-sm"></input>
              <label className="mb-1">Python rating</label>
              <input onChange={(e) => setReferralRating(e.target.value)} className="border-2 mb-4 rounded-sm"></input>
              <button type="submit" className="font-semibold text-gray-50 bg-blue-500 focus:outline-none mb-10 py-2 px-4 rounded-md">
                Refer this address
              </button>
            </form>
          </div>
        :
          <p>Please connect to rinkeby to use this app</p>
        }
      </main>
    </div>
  )
}
