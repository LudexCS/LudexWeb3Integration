module.exports = {
    contracts_directory: "./node_modules/ludex-contracts/contracts",
    contracts_build_directory: "./node_modules/ludex/contracts",
    networks: { 
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*", // Match any network id
            gas: 5000000
        }
    },
    compilers: {
        solc: {
            version: "0.8.21",
            settings: {
                optimizer: {
                    enabled: true, // Default: false
                    runs: 200      // Default: 200
                }
            }
        }
    }
};
