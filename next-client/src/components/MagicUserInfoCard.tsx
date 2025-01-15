import { useCallback, useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { LoginProps } from '../types';
import { getNetworkName, useMagic } from '../context/MagicProvider';
import { logout } from '../utils';
import SpinnerWithStyles from './Spinner';
import showToast from '../utils/showToast';
import { APP_CONNECTION } from '../constants';
import { Transaction } from '@solana/web3.js';
import { SystemProgram } from '@solana/web3.js';
// import Divider from '@/components/ui/Divider';
// import { LoginProps } from '@/utils/types';
// import { logout } from '@/utils/common';
// import { useMagic } from '../MagicProvider';
// import Card from '@/components/ui/Card';
// import CardHeader from '@/components/ui/CardHeader';
// import CardLabel from '@/components/ui/CardLabel';
// import Spinner from '@/components/ui/Spinner';
// import { getNetworkName } from '@/utils/network';

const MagicUserInfoCard = ({ magicToken, setMagicToken }: LoginProps) => {
    const { magic, connection: MAGIC_APP_CONNECTION } = useMagic();

    const [balance, setBalance] = useState('...');
    const [copied, setCopied] = useState('Copy');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [magicPublicAddress, setMagicPublicAddress] = useState<string | null>(null);

    useEffect(() => {
        const checkLoginandGetBalance = async () => {
            const isLoggedIn = await magic?.user.isLoggedIn();
            if (isLoggedIn) {
                try {
                    const metadata = await magic?.user.getInfo();
                    if (metadata) {
                        setMagicPublicAddress(metadata?.publicAddress!);
                    }
                } catch (e) {
                    console.log('error in fetching address: ' + e);
                }
            }
        };
        setTimeout(() => checkLoginandGetBalance(), 5000);
    }, []);

    const getBalance = useCallback(async () => {
        if (magicPublicAddress && MAGIC_APP_CONNECTION) {
            const balance = await MAGIC_APP_CONNECTION.getBalance(new PublicKey(magicPublicAddress));
            if (balance == 0) {
                setBalance('0');
            } else {
                setBalance((balance / LAMPORTS_PER_SOL).toString());
            }
            console.log('BALANCE: ', balance);
        }
    }, [MAGIC_APP_CONNECTION, magicPublicAddress]);

    const refresh = useCallback(async () => {
        setIsRefreshing(true);
        await getBalance();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 500);
    }, [getBalance]);

    useEffect(() => {
        if (MAGIC_APP_CONNECTION) {
            refresh();
        }
    }, [MAGIC_APP_CONNECTION, refresh]);

    useEffect(() => {
        setBalance('...');
    }, [magic]);

    const disconnect = useCallback(async () => {
        if (magic) {
            await logout(setMagicToken, magic);
        }
    }, [magic, setMagicToken]);

    const copy = useCallback(() => {
        if (magicPublicAddress && copied === 'Copy') {
            setCopied('Copied!');
            navigator.clipboard.writeText(magicPublicAddress);
            setTimeout(() => {
                setCopied('Copy');
            }, 1000);
        }
    }, [copied, magicPublicAddress]);

    const revealPrivateKey = useCallback(async () => {
        if (magic) {
            try {
                console.log({ magic: magic.wallet });
                // magic.wallet.connectWithUI(); // Simple Email OTP login form
                // magic.wallet.showUI(); // Full end-user wallet experience
                // magic.wallet.showAddress();
                // magic.wallet.showSendTokensUI();
                // magic.wallet.showBalances();
                // magic.wallet.showNFTs();
                // magic.wallet.showOnRamp();
                await magic.user.revealPrivateKey();
                

                  
                  // Ensure you have Magic initialized with the Solana extension
                  // Ensure that user is already authenticated
                  
                  
                //   const metadata = await magic.user.getMetadata();
                //   if (!metadata.publicAddress) return   
                //   const userPublicKey = new PublicKey(metadata.publicAddress);
                //   const recipientPubkey = new PublicKey("EK5muBBA1m329PGigZoqwHrDHpCFzkxLANGre1ZXPc7W");
 
                  
                //   const blockhash = await APP_CONNECTION.getLatestBlockhash()
                //   if (!blockhash) return      
                  
                //   const transaction = new Transaction({        
                //     ...blockhash,        
                //     feePayer: userPublicKey,     
                //   })      
                  
                //   const transferIx = SystemProgram.transfer({        
                //     fromPubkey: userPublicKey,        
                //     toPubkey: recipientPubkey,        
                //     lamports: 0.0000001 * LAMPORTS_PER_SOL,      
                //   })      
                  
                //   transaction.add(transferIx)      
                  
                //   const signedTransaction = await magic.solana.signTransaction(        
                //     transaction,        
                //     {        
                //       requireAllSignatures: false,        
                //       verifySignatures: true,      
                //     }     
                //   )      
                  
                //   const signature = await APP_CONNECTION.sendRawTransaction(        
                //     Buffer.from(Buffer.from(signedTransaction.rawTransaction).toString('base64'), "base64")      
                //   );
                  
                  
                //   console.log(signature);
                //   showToast({ message: "Tx success", type: 'success' });
            } catch (error: any) {
                console.log('🚀 ~ handleShowWalletUi ~ error:', error);
                // showToast({ message: error.message, type: 'error' });
            }
        }
    }, [magic]);

    return (
        <div>
            <h3 id="Wallet">Wallet</h3>
            <button onClick={disconnect}>Disconnect Magic</button>
            <div className="flex-row">
                <div className="green-dot" />
                <button className="connected">Connected to {getNetworkName()}</button>
            </div>

            {!magicPublicAddress ? <SpinnerWithStyles /> : <button onClick={copy}>{copied}</button>}
            <div className="code">{magicPublicAddress?.length == 0 ? 'Fetching address..' : magicPublicAddress}</div>
            {magicPublicAddress && <button onClick={revealPrivateKey}>Reveal Private Key</button>}

            {isRefreshing ? (
                <div className="loading-container">
                    <SpinnerWithStyles />
                </div>
            ) : (
                <button onClick={refresh}>Refresh</button>
            )}
            <div className="code">{balance} SOL</div>
        </div>
    );
};

export default MagicUserInfoCard;
