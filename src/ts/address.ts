import { Web3Error } from './error';
import { ethers } from 'ethers';

export class Address {

   public readonly stringValue: string;

   private constructor (stringValue: string)
   {
      this.stringValue = stringValue;
   }

   public static create(
      addressString: string
   ): Address
   {
      if (!ethers.isAddress(addressString))
         throw new Web3Error(`Invalid address of ${addressString}`)
      else
         return new Address(ethers.getAddress(addressString));
   }
}