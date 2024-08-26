import React, { Children, useEffect, useState } from "react";
import Web3Modal from "web3model";
import { ethers } from "ethers";

// internal import
import contractABI from "./contractABI";
import contractABI from "./contractABI";

// declare contract address
const contractAddress = "0x26aA656d8a09A38746337497ED9004d31985e1e2";
// declare contract ABI
const contractABI = contractABI;

//............Fatch smart contract
// make arrow function with name fetchContract in this function call the ethers fuction contract provide the contract address,ABI and signerOrProvider retuurn contract instant
const fetchContract = (signerOrProvider) => {
  return new ethers.Contract(contractAddress, contractABI, signerOrProvider);
};

export const TrackingContext = React.createContext();
// use context management for managing the entire state
export const TrackingProvider = ({ children }) => {
  //state variable
  const DappName = "Product Tracking Dapp";
  const [currentUser, setCurrentUser] = useState("");
  const createShipment = async (items) => {
    console.log(items);
    const { receiver, pickupTime, distance, price } = items;
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const createItem = await contract.createShipment(
        receiver,
        new Date(pickupTime).getTime(),
        distance,
        ethers.utils.parseUnits(price, 18),
        {
          value: ethers.utils.parseUnits(price, 18),
        }
      );
      await createItem.wait();
      console.log(createItem);
    } catch (error) {
      console.log("went wrong something", error);
    }
  };

  const getAllShipment = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipments = await contract.getAllTransactions();
      const getAllShipments = shipments.map((shipment) => ({
        sender: shipment.sender,
        receiver: shipment.receiver,
        price: ethers.utils.formatEther(shipment.price.toString()),
        pickupTime: shipment.pickupTime.toNumber(),
        deliveryTime: shipment.deliveryTime.toNumber(),
        isPaid: isPaid,
        status: shipment.status,
      }));
    } catch (error) {
      console.log("error weant, getting wrong");
    }
  };

  const getShipmentCount = async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({
        method: "eth_account",
      });
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipmentsCount = await contract.getShipmentCount(accounts);
      return shipmentsCount.toNumber();
    } catch (error) {
      console.log("error want getting shipment");
    }
  };

  const completeShipment = async (completeShip) => {
    console.log(completeShip);
    const { receiver, index } = completeShip;
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({
        method: "eth_account",
      });
      const web3Model = new Web3Modal();
      const connection = await web3Model.connect();
      const provider = new ethers.providers(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const transaction = await contract.completeShipment(
        accounts[0],
        receiver,
        index,
        {
          gasLimit: 300000,
        }
      );
      transaction.wait();
      console.log(transaction);
    } catch (error) {
      console.log("wrong complete shipment", error);
    }
  };

  const getShipment = async (index) => {
    console.log(index + 1);
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipment = await contract.getShipment(accounts, index + 1);

      const SingleShipment = {
        sender: shipment[0],
        receiver: shipment[1],
        pickupTime: shipment[2].toNumber(),
        deliveryTime: shipment[3].toNumber(),
        distance: shipment[4].toNumber(),
        price: ethers.utils.formatEther(shipment[5].toString()),
        status: shipment[6],
        isPaid: shipment[7],
      };
    } catch (error) {
      console.log("Soory no Shipment");
    }
  };
  const startShipment = async (getProduct) => {
    const { receiver, index } = getProduct;
    try {
      if (!window.ethereum) return "Please Install metaMask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.utils.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const shipment = await contract.startShipment(
        accounts[0],
        receiver,
        index + 1
      );

      shipment.wait();
      console.log(shipment);
    } catch (error) {
      console.log("sorry no Shi shipment", error);
    }
  };

  //====check wallet connected
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        setCurrentUser(accounts[0]);
      } else {
        return "No account";
      }
    } catch (error) {
      console.log("Not account");
    }
  };
};
