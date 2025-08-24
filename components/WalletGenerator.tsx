"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { toast } from "sonner";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { ethers } from "ethers";
import {
  Copy,
  Eye,
  EyeOff,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Wallet {
  publicKey: string;
  privateKey: string;
  mnemonic: string;
  path: string;
}

const WalletGenerator = () => {
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [mnemonicInput, setMnemonicInput] = useState<string>("");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  // const pathTypesNames: { [key: string]: string } = {
  //   "501": "Solana",
  //   "61": " Etherium",
  // };
  const [mnemonicWords, setMnemonicWords] = useState<string[]>([]);
  const [showPrivateKeys, setShowPrivateKeys] = useState<{
    [key: number]: boolean;
  }>({});
  const [showSecretPhrase, setShowSecretPhrase] = useState<boolean>(false);

  const generateWalletFromMnemonic = (
    pathType: string,
    mnemonic: string,
    accountIndex: number
  ) => {
    try {
      const seed = mnemonicToSeedSync(mnemonic);

      console.log(pathType, accountIndex);

      const path = `m/44'/${pathType}'/0'/${accountIndex}'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;

      let publicKeyEncoded: string;
      let privateKeyEncoded: string;

      if (pathType === "501") {
        // Solana
        const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
        const keypair = Keypair.fromSecretKey(secretKey);

        privateKeyEncoded = bs58.encode(secretKey);
        publicKeyEncoded = keypair.publicKey.toBase58();
      } else if (pathType === "60") {
        // Ethereum
        const privateKey = Buffer.from(derivedSeed).toString("hex");
        privateKeyEncoded = privateKey;

        const wallet = new ethers.Wallet(privateKey);
        publicKeyEncoded = wallet.address;
      } else {
        toast.error("Unsupported path type.");
        return null;
      }

      return {
        publicKey: publicKeyEncoded,
        privateKey: privateKeyEncoded,
        mnemonic,
        path,
      };
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate wallet. Please try again.");
      return null;
    }
  };

  const handleGenerateWallet = () => {
    let mnemonic = mnemonicInput.trim();

    if (mnemonic) {
      if (!validateMnemonic(mnemonicInput)) {
        toast.error("Invalid recovery phrase. Please try again.");
        return;
      }
    } else {
      mnemonic = generateMnemonic();
    }

    const words = mnemonic.split(" ");
    setMnemonicWords(words);

    const wallet = generateWalletFromMnemonic(
      selectedPath,
      mnemonic,
      wallets.length
    );

    if (wallet) {
      const updatedWallets = [...wallets, wallet];
      setWallets(updatedWallets);
      toast.success("Wallet generated successfully!");
    }
  };

  const handleTogglePrivateKey = (index: number) => {
    setShowPrivateKeys((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleDeleteWallet = (index: number) => {
    setWallets((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // If the last wallet is deleted, reset selectedPath
      if (updated.length === 0) {
        setSelectedPath("");
      }
      return updated;
    });
    setShowPrivateKeys((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const handleClearWallets = () => {
    setWallets([]);
    setMnemonicWords([]);
    setMnemonicInput("");
    setShowPrivateKeys({});
    setSelectedPath("");
    toast.success("All wallets cleared!");
  };

  const handleAddWallet = () => {
    if (!mnemonicWords) {
      toast.error("No mnemonic found. Please generate a wallet first.");
      return;
    }

    const wallet = generateWalletFromMnemonic(
      selectedPath,
      mnemonicWords.join(" "),
      wallets.length
    );
    if (wallet) {
      const updatedWallets = [...wallets, wallet];

      setWallets(updatedWallets);
    }
  };

  return (
    <div className="py-12 text-black px-4">
      {wallets.length === 0 && (
        <div>
          {!selectedPath && (
            <div>
              <h1 className="text-xl font-montserrat tracking-tighter font-medium md:text-3xl mb-4">
                Choose a blockchain to get started
              </h1>

              <div className="flex flex-wrap items-center gap-3   ">
                <Button
                  onClick={() => {
                    setSelectedPath("501");
                  }}
                  className="bg-black/85 hover:opacity-90 cursor-pointer text-white rounded-none hover:bg-black/85"
                >
                  Solana
                </Button>
                <Button
                  className="bg-black/85 hover:opacity-90 cursor-pointer text-white rounded-none hover:bg-black/85"
                  onClick={() => {
                    setSelectedPath("60");
                  }}
                >
                  Etherium
                </Button>
              </div>
            </div>
          )}

          {selectedPath && (
            <div>
              <div>
                <h1 className="text-xl font-montserrat tracking-tighter font-medium md:text-3xl mb-2 ">
                  Secret Recovery Phrase
                </h1>

                <p>Save these words in a safe place.</p>
              </div>

              <div className="mt-6 w-full flex flex-col gap-2 sm:gap-0 sm:relative sm:block">
                <Input
                  type="password"
                  placeholder="Enter your secret phrase (or leave blank to generate)"
                  onChange={(e) => setMnemonicInput(e.target.value)}
                  value={mnemonicInput}
                  className="border-black focus-visible:ring-1 lg:tracking-widest rounded-none w-full h-12 text-xl sm:pr-36"
                />
                <Button
                  onClick={() => handleGenerateWallet()}
                  className="w-full sm:w-auto sm:absolute sm:right-1 sm:top-1 font-medium font-montserrat sm:bottom-1 h-auto bg-black/85 hover:opacity-90 cursor-pointer text-white rounded-none hover:bg-black/85 px-6"
                >
                  {mnemonicInput ? "Add Wallet" : "Generate Wallet"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      {mnemonicWords && wallets.length > 0 && (
        <div className="flex flex-col gap-6">
          <div
            className="border border-black/60 p-4 lg:p-6 cursor-pointer"
            onClick={() => copyToClipboard(mnemonicWords.join(" "))}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-medium tracking-tighter">
                Your Secret Phrase
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-black hover:bg-black/10"
                onClick={() => setShowSecretPhrase((prev) => !prev)}
                aria-label={
                  showSecretPhrase ? "Hide Secret Phrase" : "Show Secret Phrase"
                }
              >
                {showSecretPhrase ? (
                  <ChevronUp className="size-5" />
                ) : (
                  <ChevronDown className="size-5" />
                )}
              </Button>
            </div>
            {showSecretPhrase && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-center w-full items-center mx-auto my-4">
                  {mnemonicWords.map((item: string) => {
                    return (
                      <p
                        key={item}
                        className="md:text-base bg-black/10  transition-all duration-300  p-3"
                      >
                        {item}
                      </p>
                    );
                  })}
                </div>
                <div className="text-sm md:text-base flex w-full gap-2 items-center text-black">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto text-black"
                  >
                    <Copy className="size-4 mr-1" /> Click anywhere to copy
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-col gap-4 md:flex-row justify-between md:items-center ">
              <h2 className="text-2xl font-medium tracking-tighter">
                Solana Wallet
              </h2>

              <div className="flex items-center gap-4">
                <Button
                  onClick={() => {
                    handleAddWallet();
                  }}
                  className="bg-black/85 hover:opacity-90 cursor-pointer text-white rounded-none hover:bg-black/85 font-semibold px-6 py-2"
                >
                  + Add Wallet
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleClearWallets();
                  }}
                  className="rounded-none text-white hover:bg-red-900/10 font-semibold px-6 py-2 flex items-center gap-2"
                >
                  Clear Wallets
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {wallets.map((wallet, idx) => (
                <div
                  key={wallet.publicKey + idx}
                  className="bg-black/60 backdrop-blur-2xl shadow-lg p-5 flex flex-col gap-3 relative text-white"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold tracking-wide bg-white/10 px-2 py-1 rounded text-white">
                      Wallet {idx + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:bg-red-900/30"
                      onClick={() => handleDeleteWallet(idx)}
                      aria-label="Delete Wallet"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div>
                    <div className="text-sm text-white/70 mb-1 flex items-center gap-2">
                      Public Key
                    </div>
                    <div
                      className="font-mono text-sm break-all tracking-widest bg-white/10 px-2 py-1 rounded text-white cursor-pointer hover:bg-white/20 transition-colors"
                      onClick={() => copyToClipboard(wallet.publicKey)}
                      title="Click to copy public key"
                    >
                      {wallet.publicKey.length > 16
                        ? wallet.publicKey.slice(0, 8) +
                          "..." +
                          wallet.publicKey.slice(-8)
                        : wallet.publicKey}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-white/70 mb-1 flex items-center gap-2">
                      Private Key
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/60 hover:bg-white/10"
                        onClick={() => handleTogglePrivateKey(idx)}
                        aria-label={showPrivateKeys[idx] ? "Hide" : "Show"}
                      >
                        {showPrivateKeys[idx] ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>
                    <div
                      className="font-mono text-sm break-all tracking-widest bg-white/10 px-2  py-1 rounded s text-white cursor-pointer hover:bg-white/20 transition-colors"
                      onClick={() => copyToClipboard(wallet.privateKey)}
                      title="Click to copy private key"
                    >
                      {showPrivateKeys[idx]
                        ? wallet.privateKey
                        : "•".repeat(
                            Math.max(8, Math.min(wallet.privateKey.length, 24))
                          )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletGenerator;
