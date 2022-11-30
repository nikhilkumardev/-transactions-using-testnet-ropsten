import React, {useEffect, useState} from "react";
import {ethers} from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../utils/constants";

export const TransactionContext = React.createContext();
const { ethereum } = window;

const getEthereumContract = () =>{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI,signer);
    console.log({
        provider,
        signer,
        transactionContract
    });
    return transactionContract;
}
export const TransactionProvider = ({children}) =>{
    const [currentAccount, setCurrentAccount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''});
    const handleChange = async (e, name) => {
        setFormData((prevState)=>({
            ...prevState, [name]: e.target.value
        }))
    }
    const getAllTransactions = async () => {
        try {
            if(!ethereum) return alert('Please install metamask!');
            const transactionContract =  getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransaction();
            const structuredTransactions = availableTransactions.map((transaction)=>({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }))
            console.log('structuredTransactions ',structuredTransactions)
            setTransactions(structuredTransactions)
        } catch (error) {
            console.log(error)
            throw new Error('No Ethereum objects.')
        }
    }
    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert('Please install metamask!');
            const accounts = await ethereum.request({method: 'eth_accounts'});
            console.log('accounts ',accounts);
            if(accounts.length){
                setCurrentAccount(accounts[0]);
                getAllTransactions();
            }else{
                console.log('No Account Founds!')
            }
        } catch (error) {
            console.log(error)
            throw new Error('No Ethereum objects.')
        }
    }
    const checkIfTransactionsExist = async () => {
        try {
            const transactionContract =  getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount();
            window.localStorage.setItem('transactionCount',transactionCount);
        } catch (error) {
            console.log(error)
            throw new Error('No Ethereum objects.')
        }
    }
    const connectWallet = async () => {
        try {
            if(!ethereum) return alert('Please install metamask!');
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            console.log('accounts ',accounts);
            setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error)
            throw new Error('No Ethereum objects.')
        }
    }
    const sentTransaction = async () => {
        try {
            if(!ethereum) return alert('Please install metamask!');
            const {addressTo, amount, keyword, message} = formData;
            const transactionContract =  getEthereumContract();
            const parseAmount = ethers.utils.parseEther(amount)
            await ethereum.request({
                method: 'eth_sendTransaction',
                params:[{
                    from: currentAccount,
                    to:addressTo,
                    value: parseAmount._hex,
                    message, 
                    keyword,
                    gas: '0x5208'
                }]
            })
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parseAmount, message, keyword);
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);
            const transactionCount = await transactionContract.getTransactionCount();
            console.log(transactionCount)
            setTransactionCount(transactionCount.toNumber());
            window.location.reload();
            getAllTransactions();
        } catch (error) {
            console.log(error)
            throw new Error('No Ethereum objects.')
        }
    }
    useEffect(()=>{
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    },[]);
    return (
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData, setFormData, handleChange, sentTransaction, transactions, isLoading}}>
            {children}
        </TransactionContext.Provider>
    )
}