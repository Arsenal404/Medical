const CONTRACT_ADDRESS = "0x3760232778Ba49aFA59E049F307F17b8c7AD1939";
const CONTRACT_ABI = [ [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "addRecord",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_patient",
          "type": "address"
        }
      ],
      "name": "getRecords",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "ipfsHash",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct MedicalRecords.Record[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "patient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        }
      ],
      "name": "RecordAdded",
      "type": "event"
    }
  ]
   ];

let signer, contract;

document.getElementById("connectWallet").onclick = async () => {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    const address = await signer.getAddress();
    document.getElementById("walletAddress").innerText = `Connected: ${address}`;
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    loadRecords(address);
  } else {
    alert("Please install MetaMask!");
  }
};

document.getElementById("storeButton").onclick = async () => {
  const cid = document.getElementById("ipfsHash").value.trim();
  if (!cid) return alert("Please enter a valid IPFS hash (CID).");

  const tx = await contract.addRecord(cid);
  await tx.wait();
  alert("CID stored on blockchain!");
  loadRecords(await signer.getAddress());
};

async function loadRecords(address) {
  const records = await contract.getRecords(address);
  const list = document.getElementById("recordList");
  list.innerHTML = "";

  records.forEach((record, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="https://gateway.pinata.cloud/ipfs/${record.ipfsHash}" target="_blank">Record #${index + 1}</a> (uploaded on ${new Date(record.timestamp * 1000).toLocaleString()})`;
    list.appendChild(li);
  });
}
