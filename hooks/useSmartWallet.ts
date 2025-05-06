// hooks/useSmartWallet.ts
"use client";
import { useState, useEffect } from "react";
import { JsonRpcProvider, Wallet, Contract } from "ethers";
import WalletAbi from "../lib/abi/SmartWallet.json";

export function useSmartWallet() {
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    (async () => {
      // 1) Provider apuntando a tu RPC local
      const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC);

      // 2) Wallet “offline” con la private key
      const pk = process.env.NEXT_PUBLIC_PRIVATE_KEY!;
      const wallet = new Wallet(pk, provider);

      // 3) Instancia tu SmartWallet con ese signer
      const addr = process.env.NEXT_PUBLIC_WALLET_ADDR!;
      const ctr = new Contract(addr, WalletAbi.abi, wallet);

      setContract(ctr);
    })();
  }, []);

  return contract;
}
