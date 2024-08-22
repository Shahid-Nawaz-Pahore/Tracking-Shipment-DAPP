import React, {useEffect, useState} from "react";
import Web3Modal from "web3model"
import {ethers} from "ethers"

// internal import
import contractABI from "./contractABI";

// declare contract address 
const contractAddress = "0x26aA656d8a09A38746337497ED9004d31985e1e2";
// declare contract ABI

//............Fatch smart contract 
// make arrow function with name fetchContract in this function call the ethers fuction contract provide the contract address,ABI and signerOrProvider retuurn contract instant 
// const fetchContract = ()

// use context management for managing the entire state
