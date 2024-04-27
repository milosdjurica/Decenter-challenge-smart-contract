# Decenter challenge - Milos Djurica

### Steps to run code on your machine -> 

1. Clone repository
```
git clone https://github.com/milosdjurica/Decenter-challenge-smart-contract
```


2. Install dependencies
```
yarn
```

3. Create .env file and add your MAINNET_RPC_URL


4. Run tests on hardhat local network
```
yarn hardhat test
```

5. Run tests on forked mainnet
    1. In hardhat.config.ts uncomment -> 	
        ```
        // forking: {
        // 	url: MAINNET_RPC_URL,
        // 	blockNumber: BLOCK_NUMBER,
        // },
        ```

    2. Run command : 
    ```
    yarn hardhat test
    ```


