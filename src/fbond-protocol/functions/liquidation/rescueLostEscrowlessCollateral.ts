import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../common';
import { ENCODER, METADATA_PROGRAM_PUBKEY } from '../../constants';
import { BOND_PROOGRAM_AUTHORITY_PREFIX, RETURN_FUNDS_OWNER_PREFIX, COLLATERAL_BOX_PREFIX } from '../../constants';

import { getMetaplexEditionPda, returnAnchorProgram } from '../../helpers';

type RescueLostEscrowlessCollateral = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  accounts: {
    userPubkey: web3.PublicKey;
    fbond: web3.PublicKey;
    collateralBox: web3.PublicKey;
    collateralTokenMint: web3.PublicKey;
    collateralTokenAccount: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}>;

export const rescueLostEscrowlessCollateral: RescueLostEscrowlessCollateral = async ({
  programId,
  connection,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const [bondProgramAuthority] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(BOND_PROOGRAM_AUTHORITY_PREFIX), accounts.fbond.toBuffer()],
    program.programId,
  );

  // let bondCollateralOrSolReceiver: web3.PublicKey;
  // if (typeof accounts.bondCollateralOrSolReceiver !== 'undefined') {
  //   bondCollateralOrSolReceiver = accounts.bondCollateralOrSolReceiver;
  // } else {
  //   bondCollateralOrSolReceiver = bondProgramAuthority;
  // }

  const bondCollateralOrSolReceiverTokenAccount = await findAssociatedTokenAddress(
    accounts.userPubkey,
    accounts.collateralTokenMint,
  );
  // const collateralTokenAccount = await findAssociatedTokenAddress(bondProgramAuthority, accounts.collateralTokenMint);
  const editionInfo = getMetaplexEditionPda(accounts.collateralTokenMint);

  // console.log('inside collateral token account: ', collateralTokenAccount.toBase58());
  instructions.push(
    await program.methods
      .rescueLostEscrowlessCollateral()
      .accounts({
        fbond: accounts.fbond,
        bondProgramAuthority: bondProgramAuthority,

        user: accounts.userPubkey,

        collateralBox: accounts.collateralBox,
        tokenMint: accounts.collateralTokenMint,
        bondCollateralOrSolReceiverTokenAccount: bondCollateralOrSolReceiverTokenAccount,
        collateralTokenAccount: accounts.collateralTokenAccount,

        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
        metadataProgram: METADATA_PROGRAM_PUBKEY,
        editionInfo: editionInfo,
      })
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [];
  await sendTxn(transaction, signers);
  return { instructions, signers };
};
