import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../../../../common';
import {
  EMPTY_PUBKEY,
  ENCODER,
  NFTS_OWNER_PREFIX,
  METADATA_PROGRAM_PUBKEY,
  SOL_FUNDS_PREFIX,
  LIQUIDITY_PROVISION_ORDER_PREFIX,
  NFT_PAIR_BOX_PREFIX,
} from '../../../../../constants';

import { getMetaplexEditionPda, getMetaplexMetadataPda, returnAnchorProgram } from '../../../../../helpers';

type DepositLiquidityToPair = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    amountOfTokensToDeposit: number;
    lpOrderCounter?: string;
  };

  accounts: {
    nftValidationAdapter: web3.PublicKey;
    pair: web3.PublicKey;
    authorityAdapter: web3.PublicKey;
    userPubkey: web3.PublicKey;
    nftMint: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  nftPairBox: web3.PublicKey;
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}>;

export const depositLiquidityToPair: DepositLiquidityToPair = async ({
  programId,
  connection,
  args,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const [fundsSolVault, solVaultSeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(SOL_FUNDS_PREFIX), accounts.pair.toBuffer()],
    program.programId,
  );
  const [nftsOwner, nftsOwnerSeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(NFTS_OWNER_PREFIX), accounts.pair.toBuffer()],
    program.programId,
  );

  // [LIQUIDITY_PROVISION_ORDER_PREFIX.as_bytes(), pair.key().as_ref(), pair.math_counter
  //   .checked_add((pair.buy_orders_quantity as i64).checked_mul(-1).unwrap()).unwrap().to_string().as_bytes()],

  const [nftPairBox] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(NFT_PAIR_BOX_PREFIX), accounts.pair.toBuffer(), accounts.nftMint.toBuffer()],
    program.programId,
  );
  // const liquidityProvisionOrder = web3.Keypair.generate();

  const userNftTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, accounts.nftMint);
  const vaultNftTokenAccount = await findAssociatedTokenAddress(nftsOwner, accounts.nftMint);

  const metadataInfo = getMetaplexMetadataPda(accounts.nftMint);
  const editionInfo = getMetaplexEditionPda(accounts.nftMint);

  instructions.push(
    await program.methods
      .depositLiquidityToPair(new BN(args.amountOfTokensToDeposit))
      .accounts({
        nftPairBox: nftPairBox,
        nftValidationAdapter: accounts.nftValidationAdapter,
        pair: accounts.pair,
        authorityAdapter: accounts.authorityAdapter,
        user: accounts.userPubkey,
        fundsSolVault: fundsSolVault,

        nftsOwner: nftsOwner,
        nftMint: accounts.nftMint,
        nftUserTokenAccount: userNftTokenAccount,

        vaultTokenAccount: vaultNftTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,

        metadataProgram: METADATA_PROGRAM_PUBKEY,

        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,

        // metadataInfo: metadataInfo,
        editionInfo: editionInfo,
      })
      .instruction(),
  );
  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [];
  await sendTxn(transaction, signers);
  return {
    nftPairBox: nftPairBox,

    instructions,
    signers,
  };
};
