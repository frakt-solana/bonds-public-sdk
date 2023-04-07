import { web3 } from '@project-serum/anchor';
import { anchorRawBNsAndPubkeysToNumsAndStrings, returnAnchorProgram } from '../../helpers';
import {
  BondsTradePool,
} from '../../types';

export const getTradePoolDataByPubkey = async (
  programId: web3.PublicKey,
  tradePoolPubkey: web3.PublicKey,
  connection: web3.Connection,
): Promise<BondsTradePool> => {
  const program = await returnAnchorProgram(programId, connection);

  const fbondData = anchorRawBNsAndPubkeysToNumsAndStrings({
        account: await program.account.bondsTradePool.fetch(tradePoolPubkey),
        publicKey: tradePoolPubkey,
      });
 

  return fbondData;
};