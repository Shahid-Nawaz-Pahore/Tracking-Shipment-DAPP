import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

// internal import
import contractABI from "./contractABI";

// declare contract address
const contractAddress = "0x26aA656d8a09A38746337497ED9004d31985e1e2";

// Fetch the smart contract
const fetchContract = (signerOrProvider) => {
  return new ethers.Contract(contractAddress, contractABI, signerOrProvider);
};

export const TrackingContext = React.createContext();

export const TrackingProvider = ({ children }) => {
  // State variables
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
      console.log("Something went wrong", error);
    }
  };

  const getAllShipment = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipments = await contract.getAllTransaction();
      const getAllShipments = shipments.map((shipment) => ({
        sender: shipment.sender,
        receiver: shipment.receiver,
        price: ethers.utils.formatEther(shipment.price.toString()),
        pickupTime: shipment.pickupTime.toNumber(),
        deliveryTime: shipment.deliveryTime.toNumber(),
        isPaid: shipment.paid,
        status: shipment.status,
      }));
      console.log(getAllShipments);
    } catch (error) {
      console.log("Error while fetching shipments", error);
    }
  };

  const getShipmentCount = async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipmentsCount = await contract.getShipmentCount(accounts[0]);
      return shipmentsCount.toNumber();
    } catch (error) {
      console.log("Error while fetching shipment count", error);
    }
  };

  const completeShipment = async (completeShip) => {
    console.log(completeShip);
    const { receiver, index } = completeShip;
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
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
      await transaction.wait();
      console.log(transaction);
    } catch (error) {
      console.log("Error while completing shipment", error);
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
      const shipment = await contract.getShipment(accounts[0], index + 1);

      const SingleShipment = {
        sender: shipment.sender,
        receiver: shipment.receiver,
        pickupTime: shipment.pickupTime.toNumber(),
        deliveryTime: shipment.deliveryTime.toNumber(),
        distance: shipment.distance.toNumber(),
        price: ethers.utils.formatEther(shipment.price.toString()),
        status: shipment.status,
        isPaid: shipment.isPaid,
      };
      console.log(SingleShipment);
    } catch (error) {
      console.log("No Shipment found", error);
    }
  };

  const startShipment = async (getProduct) => {
    const { receiver, index } = getProduct;
    try {
      if (!window.ethereum) return "Please Install MetaMask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const shipment = await contract.startShipment(
        accounts[0],
        receiver,
        index + 1
      );

      await shipment.wait();
      console.log(shipment);
    } catch (error) {
      console.log("Error while starting shipment", error);
    }
  };

  // Check if wallet is connected
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        setCurrentUser(accounts[0]);
      } else {
        return "No account found";
      }
    } catch (error) {
      console.log("No account found", error);
    }
  };

  // Connect wallet function
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentUser(accounts[0]);
    } catch (error) {
      console.log("Something went wrong while connecting wallet", error);
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <TrackingContext.Provider
      value={{
        connectWallet,
        createShipment,
        getAllShipment,
        completeShipment,
        getShipment,
        startShipment,
        getShipmentCount,
        DappName,
        currentUser,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
