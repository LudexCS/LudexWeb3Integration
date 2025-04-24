import { Address } from './address';
import { ethers } from 'ethers';
import { EthereumError, Web3Error } from './error';
import { ChainConfig } from './configs';

declare global {
   interface Window {
      ethereum?: any
   }
}

async function connectBrowserWallet (config: ChainConfig)
: Promise<void>
{
   if (!window.ethereum)
   {
      throw new Web3Error("No MetaMask found");
   }

   let currentChainId = await window.ethereum.request({ method: "eth_chainId" });

   if (currentChainId == config.chainId) 
   {
      return;
   }

   try 
   {
      await window.ethereum.request({ 
         method: "wallet_switchEthereumChain",
         params: [{chainId: config.chainId}]});
      return;
   }
   catch (switchError: any)
   {
      if (switchError.code === 4902)
      {
         try {
            await window.ethereum.request({
               method: "wallet_addEthereumChain",
               params: [config]
            });
            return;
         }
         catch (addError)
         {
            throw new Web3Error("LowLevelFailure: Add Chain");
         }
      }
      else
      {
         throw new Web3Error("LowLevelFailure: Add Chain");
      }
   }
}

export class BrowserWalletConnection 
{

   private readonly provider: ethers.BrowserProvider;

   private constructor (
      provider: ethers.BrowserProvider
   ){
      this.provider = provider;
   }

   public static async create (config: ChainConfig)
   : Promise<BrowserWalletConnection>
   {
      await connectBrowserWallet(config);

      if (typeof window.ethereum === 'undefined')  
      {
         throw new Web3Error("No provider detected");
      }
      else
      {
         let provider = new ethers.BrowserProvider(window.ethereum);
         return new BrowserWalletConnection(provider);
      }
   }
  
   public async getSigner()
   : Promise<ethers.Signer>
   {
      return this.provider.getSigner();
   }

   public async getCurrentAddress ()
   : Promise<Address>
   {
      return (
         this.provider.getSigner(0)
         .then(signer => signer.address)
         .then(currentAddress => Address.create(currentAddress)));
   }

}

