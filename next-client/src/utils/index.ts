import axios from 'axios';
import { GetPoolsInfoApiResponse } from '../types';
import { Dispatch, SetStateAction } from 'react';
import { Magic } from '../context/MagicProvider';
import { PublicKey, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { SystemProgram } from '@solana/web3.js';
import { TransactionInstruction } from '@solana/web3.js';
import { Connection } from '@solana/web3.js';
import { Transaction } from '@solana/web3.js';
import { APP_CONNECTION } from '../constants';
const BASE_API_URL = 'https://api-v3.raydium.io/';

export const getPoolsInfo = async (ids: string): Promise<GetPoolsInfoApiResponse> => {
    try {
        const response = await axios.get<GetPoolsInfoApiResponse>(
            `${BASE_API_URL}pools/info/ids?ids=${encodeURIComponent(ids)}`,
            {
                headers: {
                    accept: 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        return {
            id: '',
            success: false,
            data: [],
        };
    }
};

export type LoginMethod = 'EMAIL' | 'SMS' | 'SOCIAL' | 'FORM';

export const logout = async (setMagicToken: Dispatch<SetStateAction<string>>, magic: Magic | null) => {
    if (await magic?.user.isLoggedIn()) {
        await magic?.user.logout();
    }
    localStorage.setItem('magic_token', '');
    setMagicToken('');
};

export const saveToken = (token: string, setMagicToken: Dispatch<SetStateAction<string>>, loginMethod: LoginMethod) => {
    localStorage.setItem('magic_token', token);
    setMagicToken(token);
    localStorage.setItem('isAuthLoading', 'false');
    localStorage.setItem('loginMethod', loginMethod);
};


export async function getBlockhashFromBlockNumber(blockNumber: number):Promise<{
    blockhash: string;
    lastValidBlockHeight: number;
}> {
    try {
        const block = await APP_CONNECTION.getBlock(blockNumber, {
            maxSupportedTransactionVersion: 0, // Ensure compatibility with older transactions
        });

        if (block && block.blockhash) {
            return {
                blockhash: block.blockhash,
                lastValidBlockHeight: blockNumber
            }
        } else {
            throw new Error(`Block data not found for block number ${blockNumber}`);
        }
    } catch (error) {
        console.error(`Error fetching blockhash for block number ${blockNumber}:`, error);
        throw error;
    }
}