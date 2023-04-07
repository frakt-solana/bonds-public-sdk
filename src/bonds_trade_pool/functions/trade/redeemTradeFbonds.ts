import { web3, BN } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';

import { returnAnchorProgram } from '../../helpers';
import { ENCODER, RETURN_FUNDS_OWNER_PREFIX, SOL_FUNDS_PREFIX, BOND_PROOGRAM_AUTHORITY_PREFIX } from '../../constants';
import { findAssociatedTokenAddress } from '../../../common';


type RedeemTradeFbonds = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    epoch: number;
  }

  accounts: {
    tradePool: web3.PublicKey;
    trade: web3.PublicKey;
    fbond: web3.PublicKey;
    fbondsTokenMint: web3.PublicKey;
    userPubkey: web3.PublicKey;
    tradeSettings: web3.PublicKey;
    bondsProgram: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[]
}>;

export const redeemTradeFbonds: RedeemTradeFbonds = async ({ programId, connection, args, accounts, sendTxn }) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const [tradeSolFundsVault, ] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(SOL_FUNDS_PREFIX), accounts.trade.toBuffer()],
    program.programId,
  );

  const [poolSolFundsVault, ] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(SOL_FUNDS_PREFIX), accounts.tradePool.toBuffer()],
    program.programId,
  );

  // const pairKey = new web3.PublicKey(tradeData.pair);
  const [bondProgramAuthority, ] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(BOND_PROOGRAM_AUTHORITY_PREFIX), accounts.fbond.toBuffer()],
    accounts.bondsProgram,
  );
  const [returnFundsOwner, ] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(RETURN_FUNDS_OWNER_PREFIX), accounts.fbond.toBuffer()],
    accounts.bondsProgram,
  );

  const userFbondTokenAccount = await findAssociatedTokenAddress(tradeSolFundsVault, accounts.fbondsTokenMint);


  instructions.push(
    await program.methods
      .redeemTradeFbonds(
        new BN(args.epoch)
      )
      .accounts({
        tradePool: accounts.tradePool,
        trade: accounts.trade,
        tradeSettings: accounts.tradeSettings,
        tradeFundsSolVault: tradeSolFundsVault,
        poolFundsSolVault: poolSolFundsVault,
        user: accounts.userPubkey,

        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,

        fbond: accounts.fbond,
        bondProgramAuthority: bondProgramAuthority,
        returnFundsOwner: returnFundsOwner,

        fbondTokenMint: accounts.fbondsTokenMint,
        userFbondTokenAccount: userFbondTokenAccount,

        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,

        bondsProgram: accounts.bondsProgram,
      })
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [];
  await sendTxn(transaction, signers);
  return { instructions, signers };
};
