import { base64, bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { PublicKey, Transaction } from '@solana/web3.js';
import {
  BondingCurveType,
  CollateralBox,
  FraktBond,
  FraktBondState,
  NftSwapPair,
  PairType,
} from '../fbond-protocol/types';
import { AccountLayout } from '@solana/spl-token';

import { BN, anchor, fbonds, frakt_market_registry } from './../index';
import {
  cartManager,
  getBondEvents,
  getBondEventsBySignatures,
  getTradeActivities,
  getTradeActivitiesBySignatures,
} from '../fbond-protocol/utils';
import { EMPTY_PUBKEY, ENCODER, RETURN_FUNDS_OWNER_PREFIX, VALIDATION_PREFIX } from '../fbond-protocol/constants';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import {
  BOND_DECIMAL_DELTA,
  Pair,
  getBestOrdersByBorrowValue,
  getBestOrdersForExit,
  getBondLoansCombinations,
  getBondLoansCombinationsSimple,
  getMaxBorrowValue,
  getMaxBorrowValueOptimized,
  getTopOrderSize,
  rolloutOrdersFromPair,
} from '../fbond-protocol/utils/cartManager';
import { isNative, now } from 'lodash';
// @ts-ignore
jest.setTimeout(1000000000);

const mainnetConnection = new anchor.web3.Connection(
  'https://polished-fragrant-dawn.solana-mainnet.quiknode.pro/8005e8943672dd7c0a751fe88526a6cca7954072/',
  'confirmed',
);
import { Metaplex, keypairIdentity, token } from '@metaplex-foundation/js';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';

const devnetConnection =
  // mainnetConnection;
  new anchor.web3.Connection('https://api.devnet.solana.com', 'confirmed');

const CROSS_TOKEN_AMM_DEVNET = new anchor.web3.PublicKey('AFnufgr188AiEMFji3D5GkB8vNyZybxC8PfcuD1wrfwA');

const FBONDS_DEVNET = new anchor.web3.PublicKey('4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt');
const BONDS_VALIDATION_ADAPTER_DEVNET = new anchor.web3.PublicKey('41eQiufrrjD5WXR7A39qsmQACYgHpNEdAUsaCmuhT439');
const FRAKT_MARKET_REGISTRY_DEVNET = new anchor.web3.PublicKey('regNrR9XpXkg6VCZXEyTwCGVETwKpZMtQxYx3zResJh');

const FRAKT_MARKET_REGISTRY_MAINNET = new anchor.web3.PublicKey('regNrR9XpXkg6VCZXEyTwCGVETwKpZMtQxYx3zResJh');
const CROSS_TOKEN_AMM_MAINNET = new anchor.web3.PublicKey('AFnufgr188AiEMFji3D5GkB8vNyZybxC8PfcuD1wrfwA');
const FBONDS_MAINNET = new anchor.web3.PublicKey('4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt');
const BONDS_VALIDATION_ADAPTER_MAINNET = new anchor.web3.PublicKey('41eQiufrrjD5WXR7A39qsmQACYgHpNEdAUsaCmuhT439');
// 6wPYbuGRXZjVw2tCeTxwRiQU7AzFDTeFEKuUFpJZpcix
// @ts-ignore
test('Examples', async () => {
  // void (await initializeHadoMarketScript());
  void (await getAllProgramAccountsScript());
  // void (await exampleDepositReturnedSolToLiquidatingBond());
  // void (await exampleUpdateActualReturnAmount());
  // void (await exampleLiquidateFbond());
  // getMaxBorrowValueTest();
  // await exampleRepayFbond();
  // await exampleRedeemCollateral();
  // void (await boundFraktMarketToHadoMarketScript());
  // void (await addMerkleTreeWhitelistEntryToFraktMarketScript());
  // void (await addToWhitelistEntryToFraktMarketScript());
  // void (await exampleCreateBondValidation());
  // void (await activateFraktMarketScript());
  // void (await initializeOracleFloor());
  // void (await updateOracleFloorScript());
  // void (await exampleFinalizePair());
  // void (await exampleAddCollateralFbond());
  // void (await exampleInitializeFbond());
  // void (await addToWhitelistToMarketScript());
  // void (await finalizeHadoMarketScript());
  // void (await exampleActivateFbond());
  // void (await exampleInitializeBuyPair());
  // void (await exampleCreateClassicAuthorityAdapter());
  // void (await exampleDepositSolToPair());
  // await initializeFraktMarketScript();
  // await exampleGetTradeActivities();
  // cartTest();
  // getBondLoansCombinationsTest();
  // getTopOrderSizeTest();
  // await CreateFullFraktMarketScript();
  // rolloutOrdersTest();
  // await updateFraktMetadata();
  // await updateGnomiesMetadata();
  // await getUsersTokenBalancesNew();
  // await getAllUserTokensModified();
  // await exampleGetBondActivities();
  // getBestOrdersForExitTest();
});

const getBestOrdersForExitTest = () => {
  const bestOrdersForExit = getBestOrdersForExit({
    pairs: getTestPairs2(),
    amountOfBonds: 807654,
    loanToValueFilter: 5605.907356516017,
  });
  console.log('bestOrdersForExit: ', bestOrdersForExit);
};

export enum SHAPE {
  WAVE = 'Wave',
  EYE = 'Eye',
  STAR = 'Star',
  PORTAL = 'Portal',
  NET = 'Net',
}

export enum COLOR {
  RAINBOW = 'Rainbow',
  MAGENTA = 'Magenta',
  RED = 'Red',
  ORANGE = 'Orange',
  WHITE = 'White',
}
const FRAKT_PARTNER_POINTS_MAPPING = {
  [COLOR.WHITE + SHAPE.NET]: 10,
  [COLOR.ORANGE + SHAPE.NET]: 13,
  [COLOR.WHITE + SHAPE.PORTAL]: 15,
  [COLOR.ORANGE + SHAPE.PORTAL]: 20,
  [COLOR.RED + SHAPE.NET]: 20,
  [COLOR.WHITE + SHAPE.STAR]: 22,
  [COLOR.ORANGE + SHAPE.STAR]: 29,
  [COLOR.RED + SHAPE.PORTAL]: 29,
  [COLOR.MAGENTA + SHAPE.NET]: 40,
  [COLOR.RED + SHAPE.STAR]: 44,
  [COLOR.MAGENTA + SHAPE.PORTAL]: 59,
  [COLOR.MAGENTA + SHAPE.STAR]: 88,
  [COLOR.WHITE + SHAPE.EYE]: 88,
  [COLOR.ORANGE + SHAPE.EYE]: 117,
  [COLOR.RED + SHAPE.EYE]: 176,
  [COLOR.MAGENTA + SHAPE.EYE]: 352,
  [COLOR.WHITE + SHAPE.WAVE]: 440,
  [COLOR.ORANGE + SHAPE.WAVE]: 587,
  [COLOR.RED + SHAPE.WAVE]: 880,
  [COLOR.RAINBOW + SHAPE.WAVE]: 1760,
};

const FRAKT_PLAYER_POINTS_MAPPING = {
  [COLOR.WHITE + SHAPE.NET]: 1,
  [COLOR.ORANGE + SHAPE.NET]: 1,
  [COLOR.WHITE + SHAPE.PORTAL]: 1,
  [COLOR.ORANGE + SHAPE.PORTAL]: 2,
  [COLOR.RED + SHAPE.NET]: 2,
  [COLOR.WHITE + SHAPE.STAR]: 2,
  [COLOR.ORANGE + SHAPE.STAR]: 2,
  [COLOR.RED + SHAPE.PORTAL]: 2,
  [COLOR.MAGENTA + SHAPE.NET]: 4,
  [COLOR.RED + SHAPE.STAR]: 4,
  [COLOR.MAGENTA + SHAPE.PORTAL]: 5,
  [COLOR.MAGENTA + SHAPE.STAR]: 8,
  [COLOR.WHITE + SHAPE.EYE]: 8,
  [COLOR.ORANGE + SHAPE.EYE]: 11,
  [COLOR.RED + SHAPE.EYE]: 17,
  [COLOR.MAGENTA + SHAPE.EYE]: 35,
  [COLOR.WHITE + SHAPE.WAVE]: 44,
  [COLOR.ORANGE + SHAPE.WAVE]: 58,
  [COLOR.RED + SHAPE.WAVE]: 88,
  [COLOR.RAINBOW + SHAPE.WAVE]: 176,
};

const getPlayerPointsFromFraktAttributes = (attributes: { trait_type: string; value: string }[]) => {
  const shapeAttribute: SHAPE = attributes.find((attribute) => attribute.trait_type === 'shape')?.value as any;
  const colorAttribute: COLOR = attributes.find((attribute) => attribute.trait_type === 'color')?.value as any;
  if (!shapeAttribute || !colorAttribute) throw Error('something is wrong with meta');

  return FRAKT_PLAYER_POINTS_MAPPING[colorAttribute + shapeAttribute];
};

const getPartnerPointsFromFraktAttributes = (attributes: { trait_type: string; value: string }[]) => {
  const shapeAttribute: SHAPE = attributes.find((attribute) => attribute.trait_type === 'shape')?.value as any;
  const colorAttribute: COLOR = attributes.find((attribute) => attribute.trait_type === 'color')?.value as any;
  if (!shapeAttribute || !colorAttribute) throw Error('something is wrong with meta');
  return FRAKT_PARTNER_POINTS_MAPPING[colorAttribute + shapeAttribute];
};

const PLAYER_POINTS = 'player points';
const PARTNER_POINTS = 'partner points';

const updateFraktMetadata = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/frakt_creator.json');
  const fraktWhitelist = JSON.parse(await lazyFs().readFile(__dirname + '/frakt_mintlist.json', { encoding: 'utf8' }));
  const metaplex = new Metaplex(mainnetConnection);
  metaplex.use(keypairIdentity(userKeypair));

  const start = 0;
  for (let i = start; i < fraktWhitelist.length; i++) {
    try {
      const fraktMint = fraktWhitelist[i];
      const mintAddress = new PublicKey(fraktMint);
      console.log('processing mint: ', fraktMint);

      const nft = await metaplex.nfts().findByMint({ mintAddress });
      if (nft.json?.attributes?.find((attribute) => attribute.trait_type === PLAYER_POINTS)) {
        console.log('already patched mint ', fraktMint, '...');
        continue;
      }
      if ((nft.json?.attributes?.length as any) > 4) {
        console.log('broken mint with old meta ', fraktMint, '...');
        continue;
      }
      const playerPoints = getPlayerPointsFromFraktAttributes(nft.json?.attributes as any);
      const partnerPoints = getPartnerPointsFromFraktAttributes(nft.json?.attributes as any);
      nft.json?.attributes?.push({ trait_type: PLAYER_POINTS, value: playerPoints.toString() });
      nft.json?.attributes?.push({ trait_type: PARTNER_POINTS, value: partnerPoints.toString() });
      // console.log('nft: ', nft.json);

      const uploadedMetadata = await metaplex.nfts().uploadMetadata(nft.json as any);
      console.log('uploadedMetadata: ', uploadedMetadata);

      await metaplex.nfts().update({
        nftOrSft: nft,
        uri: uploadedMetadata.uri,
      });
    } catch (err) {
      console.log(err);
      i--;
      await delay(1000);
    }
  }
};

const updateGnomiesMetadata = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/gnomies_creator.json');
  const gnomiesWhitelist = JSON.parse(
    await lazyFs().readFile(__dirname + '/gnomies_mintlist.json', { encoding: 'utf8' }),
  );
  const metaplex = new Metaplex(mainnetConnection);
  metaplex.use(keypairIdentity(userKeypair));

  const start = 400;
  for (let i = start; i < gnomiesWhitelist.length; i++) {
    try {
      const tokenMintAddress = gnomiesWhitelist[i];
      const mintAddress = new PublicKey(tokenMintAddress);
      console.log('processing mint: ', tokenMintAddress, ', count: ', i);

      const nft = await metaplex.nfts().findByMint({ mintAddress });
      if (nft.json?.attributes?.find((attribute) => attribute.trait_type === PLAYER_POINTS)) {
        console.log('already patched mint ', tokenMintAddress, '...');
        continue;
      }
      const playerPoints = 1;
      const partnerPoints = 63;
      nft.json?.attributes?.push({ trait_type: PLAYER_POINTS, value: playerPoints.toString() });
      nft.json?.attributes?.push({ trait_type: PARTNER_POINTS, value: partnerPoints.toString() });
      // console.log('nft: ', nft.json);

      const uploadedMetadata = await metaplex.nfts().uploadMetadata(nft.json as any);
      console.log('uploadedMetadata: ', uploadedMetadata);

      await metaplex.nfts().update({
        nftOrSft: nft,
        uri: uploadedMetadata.uri,
      });
    } catch (err) {
      console.log(err);
      i--;
      await delay(1000);
    }
  }
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const getTopOrderSizeTest = () => {
  const pair = {
    publicKey: '5DdUz77L9KWoc4mL2zY7s9p3h6hzSALGZrRVFwwSNQmc',
    assetReceiver: '6FjwAfAuNRYk6sAkViYumVCQPng9inAkQ58zDG1EK2FP',
    baseSpotPrice: 9900,
    bidCap: 70707,
    bidSettlement: -70707,
    bondingCurve: { delta: 0, bondingType: 'linear' },
    buyOrdersQuantity: 1,
    concentrationIndex: 0,
    createdAt: '2023-03-13T18:04:31.846Z',
    currentSpotPrice: 9900,
    edgeSettlement: 0,
    fee: 0,
    feeTokenAccount: '11111111111111111111111111111111',
    feeVaultSeed: 255,
    fundsSolOrTokenBalance: 501029100,
    fundsSolVaultSeed: 255,
    fundsTokenAccount: '11111111111111111111111111111111',
    hadoMarket: '6bUAJarFDjdQ7fFEe8DWf99FwNzdnM1Xr2HrrbGVkjA1',
    initialFundsSolOrTokenBalance: 699999300,
    isRemoved: false,
    lastTransactedAt: 1678730641,
    lpTokensInCirculation: 0,
    lpTokensMint: '11111111111111111111111111111111',
    mathCounter: 0,
    nftsSeed: 255,
    pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
    pairAuthorityType: 'classicAuthority',
    pairState: 'onMarketVirtual',
    pairType: 'tokenForNft',
    sellOrdersCount: 0,
    solOrTokenFeeAmount: 0,
    updatedAt: '2023-03-17T13:12:31.823Z',
    validation: {
      publicKey: 'CLvVmSavqVVPuTQiTdEt6kFW2ActJJsPwfsemsjgBEN7',
      bondFeatures: 'none',
      createdAt: '2023-03-13T18:04:31.801Z',
      durationFilter: 604800,
      isRemoved: false,
      loanToValueFilter: 4100,
      maxReturnAmountFilter: 17909851841,
      pair: '5DdUz77L9KWoc4mL2zY7s9p3h6hzSALGZrRVFwwSNQmc',
      updatedAt: '2023-03-13T18:04:31.801Z',
      user: '6FjwAfAuNRYk6sAkViYumVCQPng9inAkQ58zDG1EK2FP',
    },
    authorityAdapterPublicKey: 'H8Z1D9TBPHgigB8EMVgS6ynBBPeceyeyU2yqrt7TgyEZ',
  };

  const topSize = getTopOrderSize(pair as any);
  console.log('topSize: ', topSize);
};
const rolloutOrdersTest = () => {
  const nftMints = ['1', '2', '3'];
  // 2,999,997,000
  const pair: any = {
    publicKey: '2ZJZ41224FrpYhnws6KgLvF5sf7VQDUgnxFWPDiHVs4E',
    assetReceiver: '6JgexLq1STiDE3MvjvnsZqdevnoHMTeaM7FrJRNt2Mrg',
    baseSpotPrice: 9900,
    bidCap: 303030,
    bidSettlement: -238123,
    bondingCurve: {
      delta: 0,
      bondingType: 'linear',
    },
    buyOrdersQuantity: 2,
    concentrationIndex: 0,
    createdAt: '2023-03-13T14:08:32.203Z',
    currentSpotPrice: 9900,
    edgeSettlement: 0,
    fee: 0,
    feeTokenAccount: '11111111111111111111111111111111',
    feeVaultSeed: 253,
    fundsSolOrTokenBalance: 642579300,
    fundsSolVaultSeed: 255,
    fundsTokenAccount: '11111111111111111111111111111111',
    hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
    initialFundsSolOrTokenBalance: 4520005400,
    isRemoved: false,
    lastTransactedAt: 1678716479,
    lpTokensInCirculation: 0,
    lpTokensMint: '11111111111111111111111111111111',
    mathCounter: 0,
    nftsSeed: 252,
    pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
    pairAuthorityType: 'classicAuthority',
    pairState: 'onMarketVirtual',
    pairType: 'tokenForNft',
    sellOrdersCount: 0,
    solOrTokenFeeAmount: 0,
    updatedAt: '2023-03-13T16:09:16.572Z',
    validation: {
      publicKey: '8dvCWZbHT8eMst8Q8SxjVa48VWnQnNBbdT7znHZ7onTN',
      bondFeatures: 'none',
      createdAt: '2023-03-13T14:08:32.184Z',
      durationFilter: 604800,
      isRemoved: false,
      loanToValueFilter: 4700,
      maxReturnAmountFilter: 10987742929,
      pair: '2ZJZ41224FrpYhnws6KgLvF5sf7VQDUgnxFWPDiHVs4E',
      updatedAt: '2023-03-13T16:04:16.768Z',
      user: '6JgexLq1STiDE3MvjvnsZqdevnoHMTeaM7FrJRNt2Mrg',
    },
    authorityAdapterPublicKey: '9nH8gB6uwPueQiZvBr9vb9ghkkJj7QKSmkmy2Sgqz7yU',
  };

  const orders = rolloutOrdersFromPair({ pair: pair });

  console.log('orders: ', orders);
};

const getBondLoansCombinationsTest = () => {
  const nftMints = ['1', '2', '2'];
  const testPairs = getTestPairs();
  const testOrders = [];

  // const loansCombinations = getBondLoansCombinations({
  //   pairs: pairsWithValidation,
  //   collectionFloor: 1 * 1e9,
  //   durationFilter: 86400,
  //   nfts: nftMints,
  // });
  const res = getBondLoansCombinationsSimple({ pairs: testPairs, collectionFloor: 1 * 1e9, nfts: nftMints });

  console.log('res: ', res.loanBonds);
  // console.log('pairs before: ', testPairs);
  // console.log('pairs after: ', res.pairs);
  // console.log(
  //   'loansCombinations orders: ',
  //   loansCombinations[0].orders
  //     .map((order) => ({
  //       ...order,
  //       orderValue: order.pricePerShare * order.orderSize,
  //       orderFee: order.orderSize * BOND_DECIMAL_DELTA - order.pricePerShare * order.orderSize,
  //     }))
  //     .reduce(
  //       ({ loanValue, loanFee, orders }, order) => ({
  //         loanValue: loanValue + order.orderValue,
  //         loanFee: loanFee + order.orderFee,
  //         orders,
  //       }),
  //       { loanValue: 0, loanFee: 0, orders: loansCombinations[0].orders },
  //     ),
  // );
  // console.log('loansCombinations pairs: ', loansCombinations[0]);
};
// floor = 1 SOL
/// pairs = [{buyPrice: 0.9 SOL, loanToValueFilter: 20%,
/// {buyPrice: 0.7 SOL, loanToValueFilter: 70%}  ]
// nfts = ["1"]
// combinations  0: orders[{ buyPrice: 0.9, returnValue: 1 * 0.2 = 0.2 SOL, loanValue: returnValue *  buyPrice = 0.18 SOL, fee: 0.02 }, ]
// combinations  1: orders[{ buyPrice: 0.7 SOL, loanToValueFilter: 70%, returnValue: 1 * 0.7 = 0.7 SOL,
/// loanValue: returnValue *  buyPrice = 0.49 SOL, fee: 0.21  }]

const getMaxBorrowValueTest = () => {
  const nftMint = 'gt24h345hwredgrqweg';
  const testPairs = getTestPairs();
  const testOrders = [];
  const pairsWithValdidation: Pair[] = testPairs;
  const maxBorrowValue = getMaxBorrowValueOptimized({
    pairs: pairsWithValdidation,
    collectionFloor: 1 * 1e9,
  });

  console.log('maxBorrowValue: ', maxBorrowValue);

  const ordersAndMaxBorrowValue = getBestOrdersByBorrowValue({
    pairs: pairsWithValdidation,
    collectionFloor: 1 * 1e9,
    borrowValue: 200000000,
  });
  console.log('ordersAndMaxBorrowValue: ', ordersAndMaxBorrowValue);

  const bestOrdersForExit = getBestOrdersForExit({
    pairs: pairsWithValdidation,
    amountOfBonds: 22223,
    loanToValueFilter: 3000,
  });
  console.log('bestOrdersForExit: ', bestOrdersForExit);
};

const cartTest = () => {
  const nftMint = 'gt24h345hwredgrqweg';
  const testPairs = getTestPairs();
  const testOrders = [];

  const { pairs: updatedPairs, orders: updatedOrders } = cartManager.addOrder({
    state: {
      pairs: testPairs,
      orders: testOrders,
    },
    orderSize: 1000,
    pairPubkey: '7XTcZbMo9YdfUTbJTCZPoRxK5h8n9uFyGh5Afb73r9DH',
    nftMint,
  });

  const { pairs: updatedPairs2, orders: updatedOrders2 } = cartManager.addOrder({
    state: {
      pairs: updatedPairs,
      orders: updatedOrders,
    },
    orderSize: 9000,
    pairPubkey: '7XTcZbMo9YdfUTbJTCZPoRxK5h8n9uFyGh5Afb73r9DH',
    nftMint,
  });
  const { pairs: updatedPairs3, orders: updatedOrders3 } = cartManager.addOrder({
    state: {
      pairs: updatedPairs2,
      orders: updatedOrders2,
    },
    orderSize: 5000,
    pairPubkey: '7XTcZbMo9YdfUTbJTCZPoRxK5h8n9uFyGh5Afb73r9DH',
    nftMint,
  });

  // const { pairs: updatedPairs4, orders: updatedOrders4 } = cartManager.removeOrder({
  //   state: {
  //     pairs: updatedPairs3,
  //     orders: updatedOrders3,
  //   },
  //   order: {
  //     orderSize: 9000,
  //     pricePerShare: 100000,
  //     pairPubkey: '7XTcZbMo9YdfUTbJTCZPoRxK5h8n9uFyGh5Afb73r9DH',
  //     nftMint,
  //   },
  // });
  // const { pairs: updatedPairs5, orders: updatedOrders5 } = cartManager.removeOrder({
  //   state: {
  //     pairs: updatedPairs4,
  //     orders: updatedOrders4,
  //   },
  //   order: {
  //     orderSize: 5000,
  //     pricePerShare: 99000,
  //     pairPubkey: '7XTcZbMo9YdfUTbJTCZPoRxK5h8n9uFyGh5Afb73r9DH',
  //     nftMint,
  //   },
  // });

  // const { pairs: updatedPairs6, orders: updatedOrders6 } = cartManager.removeOrder({
  //   state: {
  //     pairs: updatedPairs5,
  //     orders: updatedOrders5,
  //   },
  //   order: {
  //     orderSize: 1000,
  //     pricePerShare: 100000,
  //     pairPubkey: '7XTcZbMo9YdfUTbJTCZPoRxK5h8n9uFyGh5Afb73r9DH',
  //     nftMint,
  //   },
  // });
  // console.log({
  //   updatedPairs3,
  // });
  // console.log({
  //   updatedPairs6,
  //   updatedOrders6,
  // });
};

const exampleGetTradeActivities = async () => {
  const activities = await getTradeActivities({
    programId: FBONDS_MAINNET,
    connection: mainnetConnection,
    // fromThisSignature: '3Vkh5r6dM4bhjhnQY2qrtEmnyE9GaNtkmEnd9UYo87MAnrq97vS4ix3t11XxVQLHtzaG4oX81yK3G25E5rTKhUwW', //lastTxSignature,
    // limit: 1000,
  });
  console.log('activities: ', activities);
  // const activitiesBySignatures = await getTradeActivitiesBySignatures({
  //   signatures: ['4Q3nHNL25FHV6TR8rHDZ6rhMydLMWoSswXWYwWCsJCsTHhDkwofQvH4GqNXmNiyvpWHsikPbdh1rPjspm7Cbs3iY'],
  //   connection: mainnetConnection,
  // });
  // console.log('activitiesBySignatures: ', activitiesBySignatures);
};

const exampleGetBondActivities = async () => {
  const activities =
    // await getBondEventsBySignatures({
    //   signatures: [
    //     // '5fjcK5s9J49fge4bNKrLQmTFMQaYDYqTjmERUteJdJr5C582NT8tTi3YjWnFJbB4TaMxFgDPk8A3sfnWZcbPdGXg',
    //     // '3FxYwtgaFGwT3hiUY77zBbPJbT1H2QNPNuCSMJ7da3srVNBRePVW9Taa5s87pjB7Xf6fpvvwQHdjDnHdjZ7ddQ6D',
    //     // '2J3QP9B9HGGYMErNCSwL8E5EEojJRNSZTekzW7EnJQGLtCA5oMUh7x5SixdnuEb76Yc9EL32LwnBLi9XkpBxFfeu',
    //     '2rZPh6RfHmfXoAzczHbw5CezcY4HjEM6UZmsZhiiXEZJKTB9xW9Xjc7TmPAzcLG83eM4XveqdGNWNPidWG45mYeB',
    //     '4fK8TDurBW6Z2o9QwG1jvif7r8xPqybDJPWsrmwci7CqF1xENMabdmZSSPM3zvpmr17gLq1GXpsGcJgCT8G9wvVg',
    //   ],
    //   connection: mainnetConnection,
    // });
    await getBondEvents({
      programId: FBONDS_MAINNET,
      connection: mainnetConnection,
      untilThisSignature: '2J3QP9B9HGGYMErNCSwL8E5EEojJRNSZTekzW7EnJQGLtCA5oMUh7x5SixdnuEb76Yc9EL32LwnBLi9XkpBxFfeu',
      eventslimit: 100,
    });
  console.log('activities: ', activities);
  // const activitiesBySignatures = await getTradeActivitiesBySignatures({
  //   signatures: ['4Q3nHNL25FHV6TR8rHDZ6rhMydLMWoSswXWYwWCsJCsTHhDkwofQvH4GqNXmNiyvpWHsikPbdh1rPjspm7Cbs3iY'],
  //   connection: mainnetConnection,
  // });
  // console.log('activitiesBySignatures: ', activitiesBySignatures);
};

const makeBondsValidationFilterScript = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/devnet_admin.json');
  const connection = devnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection
      .sendTransaction(txn, [userKeypair, ...signers], {
        skipPreflight: true,
      })
      .catch((err) => console.log(err)));
  const programId = CROSS_TOKEN_AMM_DEVNET;

  // await fbonds.functions.validation.validateFBond({
  //   programId: programId,
  //   connection: connection,
  //   accounts: {
  //     pair: new PublicKey('DU1NQeT6R6sRs5Dcah3PohrxmyyEMNeABHTAdJXsq5E3'),
  //     userPubkey: userKeypair.publicKey,
  //   },
  //   sendTxn: sendTxnUserDevnet,
  // });
};

const exampleCreateBondValidation = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/devnet_admin.json');
  const connection = devnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection
      .sendTransaction(txn, [userKeypair, ...signers], {
        skipPreflight: false,
      })
      .catch((err) => console.log(err)));
  const programId = BONDS_VALIDATION_ADAPTER_DEVNET;

  // console.log('gerweqw');
  // await fbonds.functions.validation.createValidationFilter({
  //   programId: programId,
  //   connection: connection,
  //   args: {
  //     loanToValueFilter: 8000,
  //     maxDurationFilter: 86400 * 30,
  //   },
  //   accounts: {
  //     pair: new PublicKey('DU1NQeT6R6sRs5Dcah3PohrxmyyEMNeABHTAdJXsq5E3'),
  //     authorityAdapter: new PublicKey('32h51Hz2YchyqwfzqhaD8qrL1YKHmi8yugxpcnMxkSys'),
  //     userPubkey: userKeypair.publicKey,
  //   },
  //   sendTxn: sendTxnUserDevnet,
  // });
};

const exampleFinalizePair = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/devnet_admin.json');
  const connection = devnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection
      .sendTransaction(txn, [userKeypair, ...signers], {
        skipPreflight: true,
      })
      .catch((err) => console.log(err)));
  const programId = CROSS_TOKEN_AMM_DEVNET;

  await fbonds.functions.marketFactory.pair.virtual.mutations.putPairOnMarket({
    programId: programId,
    connection: connection,
    accounts: {
      pair: new PublicKey('DU1NQeT6R6sRs5Dcah3PohrxmyyEMNeABHTAdJXsq5E3'),
      authorityAdapter: new PublicKey('32h51Hz2YchyqwfzqhaD8qrL1YKHmi8yugxpcnMxkSys'),
      userPubkey: userKeypair.publicKey,
    },
    sendTxn: sendTxnUserDevnet,
  });
};

const exampleDepositSolToPair = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/devnet_admin.json');
  const connection = devnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection
      .sendTransaction(txn, [userKeypair, ...signers], {
        skipPreflight: true,
      })
      .catch((err) => console.log(err)));
  const programId = CROSS_TOKEN_AMM_DEVNET;

  const {} = await fbonds.functions.marketFactory.pair.virtual.deposits.depositSolToPair({
    programId: programId,
    connection: connection,
    args: {
      amountOfTokensToBuy: 1.5 * 1e6,
    },
    accounts: {
      pair: new PublicKey('DU1NQeT6R6sRs5Dcah3PohrxmyyEMNeABHTAdJXsq5E3'),
      authorityAdapter: new PublicKey('32h51Hz2YchyqwfzqhaD8qrL1YKHmi8yugxpcnMxkSys'),

      userPubkey: userKeypair.publicKey,
    },
    sendTxn: sendTxnUserDevnet,
  });
};

const exampleCreateClassicAuthorityAdapter = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/devnet_admin.json');
  const connection = devnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = CROSS_TOKEN_AMM_DEVNET;

  const { account: classicAuthotityAdapter } =
    await fbonds.functions.marketFactory.pair.virtual.mutations.createClassicAuthorityAdapter({
      programId: programId,
      connection: connection,

      accounts: {
        pair: new PublicKey('DU1NQeT6R6sRs5Dcah3PohrxmyyEMNeABHTAdJXsq5E3'),
        userPubkey: userKeypair.publicKey,
      },
      sendTxn: sendTxnUserDevnet,
    });
};
const exampleInitializeBuyPair = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/devnet_admin.json');
  const connection = devnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = CROSS_TOKEN_AMM_DEVNET;

  const { account: newPair } = await fbonds.functions.marketFactory.pair.virtual.mutations.initializePair({
    programId: programId,
    connection: connection,
    args: {
      delta: 0,
      spotPrice: 0.9 * 1e3,
      fee: 0,
      bondingCurveType: BondingCurveType.Linear,
      pairType: PairType.TokenForNFT,
      bidCap: 1.5 * 1e6,
    },
    accounts: {
      hadoMarket: new PublicKey('CNXLsizNqZ3m5bAwhJpXkVkHFHRdrTekPWE3CgSRnEZm'),
      userPubkey: userKeypair.publicKey,
    },
    sendTxn: sendTxnUserDevnet,
  });
};

const exampleRedeemCollateral = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/master_dev_wallet.json');
  const connection = mainnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FBONDS_MAINNET;
  const admin = new PublicKey('9J4yDqU6wBkdhP5bmJhukhsEzBkaAXiBmii52kTdxpQq');
  const fbondsAllAccounts = await fbonds.functions.getters.getAllProgramAccounts(FBONDS_MAINNET, connection);

  const fbondStr = 'F4zConkqF1YsPW6QfUJfDDy9K2LNVk43nnB866CQNn1N';
  const collateralTokenMintStr = fbondsAllAccounts.collateralBoxes.find(
    (box) => box.fbond === fbondStr,
  )?.collateralTokenMint;
  // await fbonds.functions.management.getRepaidCollateral({
  //   programId: programId,
  //   connection: connection,

  //   args: { nextBoxIndex: '0' },
  //   accounts: {
  //     userPubkey: userKeypair.publicKey,
  //     fbond: new PublicKey(fbondStr),
  //     collateralTokenMint: new PublicKey(collateralTokenMintStr as any),
  //   },
  //   sendTxn: sendTxnUserDevnet,
  // });
};

const exampleRepayFbond = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/master_dev_wallet.json');
  const connection = mainnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FBONDS_MAINNET;
  const admin = new PublicKey('9J4yDqU6wBkdhP5bmJhukhsEzBkaAXiBmii52kTdxpQq');

  await fbonds.functions.management.repayFBond({
    programId: programId,
    connection: connection,

    accounts: {
      userPubkey: userKeypair.publicKey,
      fbondsTokenMint: new PublicKey('9pZxPxLeiiVoxpZHL5yAzz4gX67gEmNPa98F4T61Jnb7'),
      fbond: new PublicKey('5x9BUB1ThUXBcdkuPcAt8m8U4yhudyrWFLUP6Y6V3rnr'),
      adminPubkey: admin,
    },
    sendTxn: sendTxnUserDevnet,
  });
};
const exampleDepositReturnedSolToLiquidatingBond = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/mainnet_admin.json');
  console.log('user: ', userKeypair.publicKey.toBase58());
  const connection = mainnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FBONDS_MAINNET;
  const fbond = new PublicKey('7YswE8xLq8RzchNY9DJUAbB29bZ57XevH2V4ptxpx3gy');
  // const newAmountToReturn = 65.5 * 1e9;

  const { fraktBonds, hadoMarketRegistry, collateralBoxes } = await fbonds.functions.getters.getAllProgramAccounts(
    FBONDS_MAINNET,
    connection,
  );

  const fbondData: FraktBond = fraktBonds.find((fbondData) => fbond.toBase58() === fbondData.publicKey) as any;

  console.log('fbondData: ', fbondData);
  const collateralBoxData: CollateralBox = collateralBoxes.find((box) => box.fbond === fbond.toBase58()) as any;
  console.log('collateralBoxData: ', collateralBoxData);

  const { instructions: ix1, signers: signers1 } =
    await fbonds.functions.liquidation.depositReturnedSolToLiquidatingBond({
      programId: programId,
      connection: connection,
      args: {
        newAmountToReturn: 68.14 * 1e9,
      },
      accounts: {
        userPubkey: userKeypair.publicKey,
        fbond: fbond,
      },
      sendTxn: () => Promise.resolve(),
    });
  // const { instructions: ix1, signers: signers1 } = await fbonds.functions.liquidation.liquidateFBond({
  //   programId: programId,
  //   connection: connection,
  //   args: {
  //     newAmountToReturn: newAmountToReturn,
  //   },
  //   accounts: {
  //     userPubkey: userKeypair.publicKey,
  //     fbondsTokenMint: new PublicKey(fbondData.fbondTokenMint),
  //     fbond: fbond,
  //     collateralBox: new PublicKey(collateralBoxData.publicKey),
  //     collateralTokenMint: new PublicKey(collateralBoxData.collateralTokenMint),
  //     collateralTokenAccount: new PublicKey(collateralBoxData.collateralTokenAccount),
  //     bondCollateralOrSolReceiver: userKeypair.publicKey,
  //   },
  //   sendTxn: () => Promise.resolve(),
  // });

  const transaction = new Transaction();
  for (let ix of [...ix1]) transaction.add(ix);

  await sendTxnUserDevnet(transaction, [...signers1]);
};

const exampleLiquidateFbond = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/mainnet_admin.json');
  console.log('user: ', userKeypair.publicKey.toBase58());
  const connection = mainnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FBONDS_MAINNET;
  const fbond = new PublicKey('BytNTZNm9RGSs3TxzZdRUQSjzN1iqAy9iE1v5H5bcAfW');
  const newAmountToReturn = 65.5 * 1e9;

  const { fraktBonds, hadoMarketRegistry, collateralBoxes } = await fbonds.functions.getters.getAllProgramAccounts(
    FBONDS_MAINNET,
    connection,
  );

  const fbondData: FraktBond = fraktBonds.find((fbondData) => fbond.toBase58() === fbondData.publicKey) as any;

  console.log('fbondData: ', fbondData);
  const collateralBoxData: CollateralBox = collateralBoxes.find((box) => box.fbond === fbond.toBase58()) as any;
  console.log('collateralBoxData: ', collateralBoxData);

  const { instructions: ix1, signers: signers1 } = await fbonds.functions.liquidation.rescueLostEscrowlessCollateral({
    programId: programId,
    connection: connection,
    accounts: {
      userPubkey: userKeypair.publicKey,
      fbond: fbond,
      collateralBox: new PublicKey(collateralBoxData.publicKey),
      collateralTokenMint: new PublicKey(collateralBoxData.collateralTokenMint),
      collateralTokenAccount: new PublicKey(collateralBoxData.collateralTokenAccount),
    },
    sendTxn: () => Promise.resolve(),
  });
  // const { instructions: ix1, signers: signers1 } = await fbonds.functions.liquidation.liquidateFBond({
  //   programId: programId,
  //   connection: connection,
  //   args: {
  //     newAmountToReturn: newAmountToReturn,
  //   },
  //   accounts: {
  //     userPubkey: userKeypair.publicKey,
  //     fbondsTokenMint: new PublicKey(fbondData.fbondTokenMint),
  //     fbond: fbond,
  //     collateralBox: new PublicKey(collateralBoxData.publicKey),
  //     collateralTokenMint: new PublicKey(collateralBoxData.collateralTokenMint),
  //     collateralTokenAccount: new PublicKey(collateralBoxData.collateralTokenAccount),
  //     bondCollateralOrSolReceiver: userKeypair.publicKey,
  //   },
  //   sendTxn: () => Promise.resolve(),
  // });

  const transaction = new Transaction();
  for (let ix of [...ix1]) transaction.add(ix);

  await sendTxnUserDevnet(transaction, [...signers1]);
};

const exampleUpdateActualReturnAmount = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/mainnet_admin.json');
  console.log('user: ', userKeypair.publicKey.toBase58());
  const connection = mainnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FBONDS_MAINNET;
  const { fraktBonds, hadoMarketRegistry, collateralBoxes } = await fbonds.functions.getters.getAllProgramAccounts(
    FBONDS_MAINNET,
    connection,
  );
  const bondsToFix = fraktBonds.filter((bond) => bond.publicKey === 'yRCVigsFZCv8qKLwfz8RW4NLFWnV7nFWiUEgL3Qh2iP');
  // .filter(
  //   (bond) => bond.fraktBondState === FraktBondState.Liquidated && bond.amountToReturn < bond.actualReturnedAmount,
  // );
  // console.log('bondsToFix: ', bondsToFix);
  // const fbond = new PublicKey('FKmGypGgjEQUJj4vEikgiXzaerNPcN831DQ3pLDkiGj5');
  for (let fbondData of bondsToFix) {
    // const fbondData: FraktBond = fraktBonds.find((fbondData) => fbond.toBase58() === fbondData.publicKey) as any;
    console.log('fbondData: ', fbondData);
    const collateralBoxData: CollateralBox = collateralBoxes.find((box) => box.fbond === fbondData.publicKey) as any;
    console.log('collateralBoxData: ', collateralBoxData);
    const { instructions: ix1, signers: signers1 } = await fbonds.functions.liquidation.updateActualReturnedAmount({
      programId: programId,
      connection: connection,
      args: {
        newAmountToReturn: 0,
      },
      accounts: {
        userPubkey: userKeypair.publicKey,
        fbond: new PublicKey(fbondData.publicKey),
      },
      sendTxn: () => Promise.resolve(),
    });
    const transaction = new Transaction();
    for (let ix of [...ix1]) transaction.add(ix);
    await sendTxnUserDevnet(transaction, [...signers1]);
  }
};

const exampleActivateFbond = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/devnet_admin.json');
  const connection = devnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FBONDS_DEVNET;

  await fbonds.functions.fbondFactory.activateFBond({
    programId: programId,
    connection: connection,
    args: {
      amountToReturn: 1e6,
      bondDuration: 86000 * 7,
    },
    accounts: {
      userPubkey: userKeypair.publicKey,
      fbondsTokenMint: new PublicKey('GsBdUNQxurgH6FW2AXKPyxgy3XWwTBaxTV2PXyyLTNXP'),
      fbond: new PublicKey('5Pg18UhW1rjRB2YWah9ivPC43MhSLKuV1vFdvY2ZGxx8'),
    },
    sendTxn: sendTxnUserDevnet,
  });
};
const exampleAddCollateralFbond = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/devnet_admin.json');
  const connection = devnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FBONDS_DEVNET;

  const nftMint = new PublicKey('2nE46otycFFFDRyzyLMjur5oNBYp84jP78f4RUdP1P62');

  const { collateralBox } = await fbonds.functions.fbondFactory.addCollateralBox({
    programId: programId,
    connection: connection,
    args: {
      amountToDeposit: 1,
      nextBoxIndex: '0',
    },
    accounts: {
      userPubkey: userKeypair.publicKey,
      tokenMint: nftMint,
      fbond: new PublicKey('5Pg18UhW1rjRB2YWah9ivPC43MhSLKuV1vFdvY2ZGxx8'),
    },
    sendTxn: sendTxnUserDevnet,
  });
};

const exampleInitializeFbond = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/devnet_admin.json');
  const connection = devnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FBONDS_DEVNET;
  const { fbond, fbondTokenMint } = await fbonds.functions.fbondFactory.initializeFBond({
    programId: programId,
    connection: connection,
    accounts: {
      userPubkey: userKeypair.publicKey,
    },
    sendTxn: sendTxnUserDevnet,
  });
  await new Promise((f) => setTimeout(f, 600));
};
const finalizeHadoMarketScript = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/frakt_market_admin.json');
  const connection = mainnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FBONDS_MAINNET;
  //  new anchor.web3.PublicKey('DFsZgwKM3SvkvMwVRPQhhEnkYZCS1hZ2g2u6ehmAWjyc');
  // console.log('userKeypair: ', userKeypair.publicKey.toBase58());
  const hadoMarket = new anchor.web3.PublicKey('6rY1rB7tFgffuUzQQ1f71fDtdHCYSXAyeLm5UUqQcThp');

  await fbonds.functions.marketFactory.hadoMarket.finishHadoMarket({
    programId,
    connection: connection,
    accounts: {
      hadoMarket: hadoMarket,
      userPubkey: userKeypair.publicKey,
    },
    sendTxn: sendTxnUserDevnet,
  });
};

const decodedTokenBuffersToUI = (decodedTokenState, tokenAddress: PublicKey) => {
  let amountNum = -1;
  try {
    amountNum = new BN(decodedTokenState.amount, 10, 'le').toNumber();
  } catch (err) {}

  return {
    tokenAccountPubkey: tokenAddress.toBase58(),
    mint: new PublicKey(decodedTokenState.mint).toBase58(),
    owner: new PublicKey(decodedTokenState.owner).toBase58(),
    amount: amountNum,
    amountBN: new BN(decodedTokenState.amount, 10, 'le'),
    delegateOption: !!decodedTokenState.delegateOption,
    delegate: new PublicKey(decodedTokenState.delegate).toBase58(),
    state: !!decodedTokenState.state,
    isNativeOption: !!decodedTokenState.isNativeOption,
    isNative: new BN(decodedTokenState.isNative, 10, 'le').toNumber(),
    delegatedAmount: new BN(decodedTokenState.delegatedAmount, 10, 'le'),
    closeAuthorityOption: !!decodedTokenState.closeAuthorityOption,
    closeAuthority: new PublicKey(decodedTokenState.closeAuthority).toBase58(),
  };
};

const getAllUserTokensModified = async () => {
  const connection = mainnetConnection;

  const userPubkey = new PublicKey('6CnQUFVk2d8TRvQa2Lr7KDvx9zK12Q4jkA7mmDtzj71e');
  const tokenAccounts = (
    await connection.getTokenAccountsByOwner(
      userPubkey,
      { programId: TOKEN_PROGRAM_ID },
      { commitment: 'singleGossip' },
    )
  ).value;
  const parsedAddresses = tokenAccounts
    .map((tokenAccount) =>
      decodedTokenBuffersToUI(AccountLayout.decode(tokenAccount.account.data), tokenAccount.pubkey),
    )
    .filter((token) => token.amount !== 0);

  console.log('parsedAddresses: ', parsedAddresses);
  // return parsedAddresses;
};
const getUsersTokenBalancesNew = async (userPubkey: PublicKey) => {
  const connection = mainnetConnection;
  const tokensRaw = await connection.getTokenAccountsByOwner(userPubkey, {
    programId: TOKEN_PROGRAM_ID,
  });
  const parsedTokens = tokensRaw.value
    .map((tokenRaw) => ({
      ...AccountLayout.decode(tokenRaw.account.data),
      tokenAccountPubkey: tokenRaw.pubkey.toBase58(),
    }))
    .map((tokenParsed) => ({
      ...tokenParsed,
      amount: Number(tokenParsed.amount.valueOf()),
      amountBN: new BN(Number(tokenParsed.amount.valueOf())),
      isNative: Number(tokenParsed.isNative.valueOf()),
      delegatedAmount: Number(tokenParsed.delegatedAmount.valueOf()),

      mint: tokenParsed.mint.toBase58(),
      owner: tokenParsed.owner.toBase58(),
      delegate: tokenParsed.delegate.toBase58(),
      closeAuthority: tokenParsed.closeAuthority.toBase58(),
    }))
    .filter((token) => token.amount > 0);

  return parsedTokens;
};

const getAllProgramAccountsScript = async () => {
  // new anchor.web3.PublicKey('DFsZgwKM3SvkvMwVRPQhhEnkYZCS1hZ2g2u6ehmAWjyc');
  // console.log('userKeypair: ', userKeypair.publicKey.toBase58());
  const connection = mainnetConnection;
  const { fraktBonds, hadoMarketRegistry, collateralBoxes, nftSwapPairs, hadoMarkets, autocompoundDeposits } =
    await fbonds.functions.getters.getAllProgramAccounts(FBONDS_MAINNET, connection);

  console.log(
    'offers: ',
    nftSwapPairs.filter(
      (pair) =>
        pair.assetReceiver === 'FPNMQhpGtXRdh4LcMBQs35KZsGpwQYJDRicPgD63gUj' &&
        pair.hadoMarket === '9n9z83jBXzcmv1Hy5348qpbWRsAnwXwP1sW1mWFuvfYG',
    ),
  );
  // console.log(
  //   'liquidated bonds: ',
  //   JSON.stringify(
  //     fraktBonds
  //       .filter(
  //         (bond) =>
  //           // bond.fbondIssuer === '6JgexLq1STiDE3MvjvnsZqdevnoHMTeaM7FrJRNt2Mrg' &&
  //           bond.fraktBondState === FraktBondState.Liquidated &&
  //           bond.bondCollateralOrSolReceiver === '11111111111111111111111111111111',
  //       )
  //       .map((bond) => {
  //         const [returnFundsOwner, returnFundsOwnerSeed] = findProgramAddressSync(
  //           [ENCODER.encode(RETURN_FUNDS_OWNER_PREFIX), new PublicKey(bond.publicKey).toBuffer()],
  //           FBONDS_MAINNET,
  //         );
  //         return {
  //           ...bond,
  //           returnFundsOwner: returnFundsOwner.toBase58(),
  //           autocompounds: autocompoundDeposits.filter((deposit) => deposit.fbondTokenMint === bond.fbondTokenMint),
  //         };
  //       })
  //       // .filter(bond => bond.autocompounds.find(autocompoundDeposit => autocompoundDeposit))
  //       .sort((bondA, bondB) => bondB.liquidatingAt - bondA.liquidatingAt)
  //       .slice(0, 1),
  //     null,
  //     2,
  //   ),
  // );
  // console.log('fraktBonds: ', Math.min(fraktBonds[0].amountToReturn, sumOfSolFromTradeActivity));
  // console.log(
  //   'autocompound deposits: ',
  //   autocompoundDeposits
  //     .filter((deposit) => deposit.fraktBondState == 'active')
  //     .map((deposit) => ({
  //       deposit,
  //       fbond: fraktBonds.find((fbond) => fbond.fbondTokenMint == deposit.fbondTokenMint),
  //     })),
  // );
  // console.log(
  //   'targetPair: ',
  //   nftSwapPairs.filter(
  //     (pair) =>
  //       pair.assetReceiver === '6FjwAfAuNRYk6sAkViYumVCQPng9inAkQ58zDG1EK2FP' && pair.fundsSolOrTokenBalance > 0,
  //   ),
  // );
  // console.log('autocompoundDeposits: ', autocompoundDeposits);
  // console.log(
  //   'hadoOkb: ',
  //   hadoMarketRegistry.find((registry) => registry.hadoMarket === '6rY1rB7tFgffuUzQQ1f71fDtdHCYSXAyeLm5UUqQcThp'),
  // );
  // console.log(
  //   'hadoOkb: ',
  //   hadoMarkets.find((market) => market.publicKey === '6rY1rB7tFgffuUzQQ1f71fDtdHCYSXAyeLm5UUqQcThp'),
  // );
  // // console.log(
  // //   'pair: ',
  // //   nftSwapPairs.find((pair) => pair.publicKey === '4KFrQ3t9yNdiUJufcJ3cPMbhCsHKQAS1XyxobRkBsPbC'),
  // // );
  // // console.log('hadoMarkets: ', hadoMarkets);
  // const { fraktMarkets, whitelistEntries, oracleFloors } =
  //   await frakt_market_registry.functions.getters.getAllProgramAccounts(FRAKT_MARKET_REGISTRY_MAINNET, connection);

  // console.log(
  //   'fraktBonds: ',
  //   fraktBonds
  //     .filter((bond) => bond.liquidatingAt < Date.now() / 1000 && bond.fraktBondState === 'active')
  //     .map((bond) => ({ ...bond, box: collateralBoxes.find((box) => box.fbond == bond.publicKey) })),
  // );
  //liq
  // const now = Math.ceil(Date.now() / 1000);
  // const grace = 86400;
  // console.log(
  //   'liquidated fraktBonds: ',
  //   fraktBonds
  //     // .filter((bond) => bond.fraktBondState === FraktBondState.Liquidated)
  //     // .filter((bond, i) => !fraktBonds.find((theBond, r) => r !== i && bond.fbondIssuer === theBond.fbondIssuer)),
  //     .map((bond) => ({ ...bond, box: collateralBoxes.find((box) => box.fbond == bond.publicKey) }))
  //     // .filter((bond) => bond.bondCollateralOrSolReceiver !== '11111111111111111111111111111111'),
  //     // .filter((bond) => bond.publicKey === '7YswE8xLq8RzchNY9DJUAbB29bZ57XevH2V4ptxpx3gy'),

  //     // .slice(0, 2),
  //     .filter((bond) => bond.box?.collateralTokenMint === '33gCfaYV9CcadoHMFieVCuykwcp28Bvnm4CywKrVUPSN'),
  // );
  //liq
  // console.log(
  //   hadoMarketRegistry.find((registry) => registry.hadoMarket === 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq'),
  // );
  // console.log('fraktMarkets: ', fraktMarkets);
  // console.log('whitelistEntries: ', whitelistEntries);
  // console.log(
  //   'oracleFloors: ',t
  //   oracleFloors.filter(
  //     (oracle) =>
  //       oracle.fraktMarket ==
  //       hadoMarketRegistry.find((registry) => registry.hadoMarket === '9n9z83jBXzcmv1Hy5348qpbWRsAnwXwP1sW1mWFuvfYG')
  //         ?.fraktMarket,
  //   ),
  // );

  // console.log(allAccounts.classicValidationWhitelists[0]);
  // const { hadoMarkets, hadoMarketRegistry } = await fbonds.functions.getters.getAllProgramAccounts(
  //   FBONDS_MAINNET,
  //   connection,
  // );

  // console.log('hadoMarkets: ', hadoMarkets);
  // console.log('hadoMarketRegistry: ', hadoMarketRegistry);

  // const fbondsAllAccounts = await fbonds.functions.getters.getAllProgramAccounts(FBONDS_MAINNET, connection);
  // const fraktMarketAllAccounts = await frakt_market_registry.functions.getters.getAllProgramAccounts(
  //   FRAKT_MARKET_REGISTRY_MAINNET,
  //   connection,
  // );
  // console.log('fraktMarketAllAccounts: ', fraktMarketAllAccounts);
  // const fbondsValidationAdapterAllAccounts = await fbonds.functions.getters.getAllProgramAccounts(
  //   BONDS_VALIDATION_ADAPTER_MAINNET,
  //   connection,
  // );
  // console.log('fbondsValidationAdapterAllAccounts: ', fbondsValidationAdapterAllAccounts);

  // const pair = new PublicKey('9dwrQ92jrevqXwgcXo7igHa7UHmXZ6e6zW1uuXdv7HUj');
  // console.log(
  //   'fbondsValidationAdapterAllAccounts: ',
  //   fbondsValidationAdapterAllAccounts.validations.find((validation) => validation.pair === pair.toBase58()),
  // );

  // const [validation] = await PublicKey.findProgramAddress(
  //   [ENCODER.encode(VALIDATION_PREFIX), pair.toBuffer()],
  //   BONDS_VALIDATION_ADAPTER_MAINNET,
  // );

  // console.log('validation: ', validation.toBase58());

  // console.log('fraktMarketAllAccounts: ', fraktMarketAllAccounts);
  // console.log('crossMintAllAccounts: ', crossMintAllAccounts.nftSwapPairs);
  // console.log(
  //   fbondsAllAccounts.collateralBoxes.filter(
  //     (box) => box.collateralTokenMint === '9LHM4WNhKZSGxWPDEu3nVrkVTC6uswVGLeECNAAy6NQi',
  //   ),
  // );
  // console.log(
  //   fbondsAllAccounts.fraktBonds.filter(
  //     (bond) => bond.fbondIssuer === '6FjwAfAuNRYk6sAkViYumVCQPng9inAkQ58zDG1EK2FP' && bond.fraktBondState === 'active',
  //   ),
  // );
};

const addMerkleTreeWhitelistEntryToFraktMarketScript = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/frakt_market_admin.json');
  const connection = mainnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FRAKT_MARKET_REGISTRY_MAINNET;
  // new anchor.web3.PublicKey('DFsZgwKM3SvkvMwVRPQhhEnkYZCS1hZ2g2u6ehmAWjyc');
  // console.log('userKeypair: ', userKeypair.publicKey.toBase58());
  const whitelistType = fbonds.types.NftValidationWhitelistType.MerkleTree;
  const fraktMarket = new anchor.web3.PublicKey('CA97Eq4gLoXVkY5Y7UAZTyh1s4bHWWTikwy4kJZCHhCL');

  // const fraktWhitelist = whitelists.find((wl) => wl.name === 'FRAKT');
  const funnyBearsWhitelist = JSON.parse(
    await lazyFs().readFile(__dirname + '/funny_bears_mintlist.json', { encoding: 'utf8' }),
  );
  const leaves: any = funnyBearsWhitelist
    .sort((a, b) => ('' + a).localeCompare(b))
    .map((leaf) => new PublicKey(leaf).toBuffer());
  // console.log(leaves.slice(0, 10));

  const tree = new MerkleTree(leaves, keccak256, {
    sortPairs: true,
    hashLeaves: true,
  });
  const root = tree.getRoot();
  console.log('root: ', root.toJSON());
  console.log('hashes length: ', funnyBearsWhitelist.length);

  const { account: whitelistPubkey } = await frakt_market_registry.functions.marketFactory.addWhitelistToMarket({
    programId,
    connection: connection,
    args: {
      whitelistType,
      root,
    },
    accounts: {
      fraktMarket: fraktMarket,
      whitelistedAddress: EMPTY_PUBKEY,
      userPubkey: userKeypair.publicKey,
    },
    sendTxn: sendTxnUserDevnet,
  });

  // console.log('whitelistPubkey: ', whitelistPubkey.toBase58());
};

const addToWhitelistEntryToFraktMarketScript = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/frakt_market_admin.json');
  const connection = mainnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FRAKT_MARKET_REGISTRY_MAINNET;
  // new anchor.web3.PublicKey('DFsZgwKM3SvkvMwVRPQhhEnkYZCS1hZ2g2u6ehmAWjyc');
  // console.log('userKeypair: ', userKeypair.publicKey.toBase58());
  const whitelistType = fbonds.types.NftValidationWhitelistType.Creator;
  const fraktMarket = new anchor.web3.PublicKey('7ytHEEN2PPczNYLE4X66u15ZMUGDqvUrVFpuPS3Vgj2F');

  const whitelisted_address = new anchor.web3.PublicKey('GVkb5GuwGKydA4xXLT9PNpx63h7bhFNrDLQSxi6j5NuF');

  const { account: whitelistPubkey } = await frakt_market_registry.functions.marketFactory.addWhitelistToMarket({
    programId,
    connection: connection,
    args: {
      whitelistType,
    },
    accounts: {
      fraktMarket: fraktMarket,
      whitelistedAddress: whitelisted_address,
      userPubkey: userKeypair.publicKey,
    },
    sendTxn: sendTxnUserDevnet,
  });

  // console.log('whitelistPubkey: ', whitelistPubkey.toBase58());
};

const activateFraktMarketScript = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/frakt_market_admin.json');
  const connection = mainnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FRAKT_MARKET_REGISTRY_MAINNET;
  const fraktMarket = new anchor.web3.PublicKey('7ytHEEN2PPczNYLE4X66u15ZMUGDqvUrVFpuPS3Vgj2F');

  const {} = await frakt_market_registry.functions.marketFactory.activateFraktMarket({
    programId,
    connection: connection,
    accounts: {
      fraktMarket: fraktMarket,
      userPubkey: userKeypair.publicKey,
    },
    sendTxn: sendTxnUserDevnet,
  });
};

const boundFraktMarketToHadoMarketScript = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/frakt_market_admin.json');
  const connection = mainnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FBONDS_MAINNET;
  const fraktMarket = new anchor.web3.PublicKey('8dsh69DQp37zLSQ2Ky6HwxMe2M7vEmNFVHdGkjYWjucD');
  const hadoMarket = new anchor.web3.PublicKey('6rY1rB7tFgffuUzQQ1f71fDtdHCYSXAyeLm5UUqQcThp');

  const {} = await fbonds.functions.validation.boundHadoMarketToFraktMarket({
    programId,
    connection: connection,
    accounts: {
      hadoMarket: hadoMarket,
      fraktMarket: fraktMarket,
      userPubkey: userKeypair.publicKey,
    },
    sendTxn: sendTxnUserDevnet,
  });
};

const initializeOracleFloor = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/frakt_market_admin.json');
  const connection = mainnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FRAKT_MARKET_REGISTRY_MAINNET;
  const fraktMarket = new anchor.web3.PublicKey('8JYNs4Xab34FsJCkG63BSwVA5P3Nzqk3G6PF8he9DqJM');

  const {} = await frakt_market_registry.functions.oracle.initializeOracle({
    programId,
    connection: connection,
    args: {
      oracleAuthority: userKeypair.publicKey,
      oracleInfo: new PublicKey('11111111111111111111111111111111'),
      floor: 0,
    },
    accounts: {
      fraktMarket: fraktMarket,
      userPubkey: userKeypair.publicKey,
    },
    sendTxn: sendTxnUserDevnet,
  });
};

const updateOracleFloorScript = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/frakt_market_admin.json');
  const connection = mainnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FRAKT_MARKET_REGISTRY_MAINNET;
  const fraktMarket = new anchor.web3.PublicKey('GpYUdS9ZGgizSmuRqf52nM6MkA3SsUawV3Ck8j6y7mdT');

  const {} = await frakt_market_registry.functions.oracle.setOracleFloor({
    programId,
    connection: connection,
    args: {
      newFloor: 23 * 1e9,
    },
    accounts: {
      fraktMarket: fraktMarket,
      userPubkey: userKeypair.publicKey,
    },
    sendTxn: sendTxnUserDevnet,
  });
};

const addToWhitelistToMarketScript = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/frakt_market_admin.json');
  const connection = mainnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = CROSS_TOKEN_AMM_DEVNET;
  // new anchor.web3.PublicKey('DFsZgwKM3SvkvMwVRPQhhEnkYZCS1hZ2g2u6ehmAWjyc');
  // console.log('userKeypair: ', userKeypair.publicKey.toBase58());
  const whitelistType = fbonds.types.NftValidationWhitelistType.Creator;
  const hadoMarket = new anchor.web3.PublicKey('CNXLsizNqZ3m5bAwhJpXkVkHFHRdrTekPWE3CgSRnEZm');

  const whitelisted_address = new anchor.web3.PublicKey('omwrmabCHoErnUeYaZA6NQQWduQB9ECxBiDJfWLi27t');

  const { account: whitelistPubkey } = await fbonds.functions.marketFactory.hadoMarket.addClassicWhitelistToMarket({
    programId,
    connection: connection,
    args: {
      whitelistType,
    },
    accounts: {
      hadoMarket: hadoMarket,
      whitelisted_address: whitelisted_address,
      userPubkey: userKeypair.publicKey,
    },
    sendTxn: sendTxnUserDevnet,
  });

  console.log('whitelistPubkey: ', whitelistPubkey.toBase58());
};

const CreateFullFraktMarketScript = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/frakt_market_admin.json');
  const connection = mainnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FRAKT_MARKET_REGISTRY_MAINNET;
  // new anchor.web3.PublicKey('DFsZgwKM3SvkvMwVRPQhhEnkYZCS1hZ2g2u6ehmAWjyc');
  // console.log('userKeypair: ', userKeypair.publicKey.toBase58());

  const whitelistType = fbonds.types.NftValidationWhitelistType.CollectionId;

  const whitelisted_address = new anchor.web3.PublicKey('3saAedkM9o5g1u5DCqsuMZuC4GRqPB4TuMkvSsSVvGQ3');

  const {
    account: fraktMarket,
    instructions: ixs1,
    signers: signers1,
  } = await frakt_market_registry.functions.marketFactory.initializeFraktMarket({
    programId,
    connection: connection,
    accounts: {
      userPubkey: userKeypair.publicKey,
      adminPubkey: userKeypair.publicKey,
    },

    sendTxn: () => Promise.resolve(),
  });

  const {
    account: whitelistPubkey,
    instructions: ixs2,
    signers: signers2,
  } = await frakt_market_registry.functions.marketFactory.addWhitelistToMarket({
    programId,
    connection: connection,
    args: {
      whitelistType,
    },
    accounts: {
      fraktMarket: fraktMarket,
      whitelistedAddress: whitelisted_address,
      userPubkey: userKeypair.publicKey,
    },
    sendTxn: () => Promise.resolve(),
  });

  const { instructions: ixs3, signers: signers3 } =
    await frakt_market_registry.functions.marketFactory.activateFraktMarket({
      programId,
      connection: connection,
      accounts: {
        fraktMarket: fraktMarket,
        userPubkey: userKeypair.publicKey,
      },
      sendTxn: () => Promise.resolve(),
    });

  const bondsProgramId = FBONDS_MAINNET;
  const {
    account: hadoMarket,
    instructions: ixs4,
    signers: signers4,
  } = await fbonds.functions.marketFactory.hadoMarket.initializeHadoMarket({
    programId: bondsProgramId,
    connection: connection,
    accounts: {
      userPubkey: userKeypair.publicKey,
      validationAdapterProgram: bondsProgramId,
    },
    args: {
      marketDecimals: 5,
      minBidCap: 1,
    },
    sendTxn: () => Promise.resolve(),
  });

  const { instructions: ixs5, signers: signers5 } = await fbonds.functions.validation.boundHadoMarketToFraktMarket({
    programId: bondsProgramId,
    connection: connection,
    accounts: {
      hadoMarket: hadoMarket,
      fraktMarket: fraktMarket,
      userPubkey: userKeypair.publicKey,
    },
    sendTxn: () => Promise.resolve(),
  });

  const { instructions: ixs6, signers: singers6 } = await fbonds.functions.marketFactory.hadoMarket.finishHadoMarket({
    programId: bondsProgramId,
    connection: connection,
    accounts: {
      hadoMarket: hadoMarket,
      userPubkey: userKeypair.publicKey,
    },
    sendTxn: () => Promise.resolve(),
  });

  const { instructions: ixs7, signers: signers7 } = await frakt_market_registry.functions.oracle.initializeOracle({
    programId,
    connection: connection,
    args: {
      oracleAuthority: userKeypair.publicKey,
      oracleInfo: new PublicKey('11111111111111111111111111111111'),
      floor: 0,
    },
    accounts: {
      fraktMarket: fraktMarket,
      userPubkey: userKeypair.publicKey,
    },
    sendTxn: () => Promise.resolve(),
  });

  const transaction = new Transaction();
  for (let ix of [...ixs1, ...ixs2, ...ixs3, ...ixs4, ...ixs5, ...ixs6, ...ixs7]) transaction.add(ix);

  await sendTxnUserDevnet(transaction, [
    ...signers1,
    ...signers2,
    ...signers3,
    ...signers4,
    ...signers5,
    ...singers6,
    ...signers7,
  ]);
  console.log('hadoMarket: ', hadoMarket.toBase58());

  console.log('fraktMarket: ', fraktMarket.toBase58());
};

const initializeFraktMarketScript = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/frakt_market_admin.json');
  const connection = mainnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FRAKT_MARKET_REGISTRY_MAINNET;
  // new anchor.web3.PublicKey('DFsZgwKM3SvkvMwVRPQhhEnkYZCS1hZ2g2u6ehmAWjyc');
  // console.log('userKeypair: ', userKeypair.publicKey.toBase58());

  const { account: fraktMarket } = await frakt_market_registry.functions.marketFactory.initializeFraktMarket({
    programId,
    connection: connection,
    accounts: {
      userPubkey: userKeypair.publicKey,
      adminPubkey: userKeypair.publicKey,
    },

    sendTxn: sendTxnUserDevnet,
  });

  console.log('fraktMarket: ', fraktMarket.toBase58());
};

const initializeHadoMarketScript = async () => {
  const userKeypair = await createKeypairFromFile(__dirname + '/keys/frakt_market_admin.json');
  const connection = mainnetConnection;
  const sendTxnUserDevnet = async (txn, signers) =>
    void (await connection.sendTransaction(txn, [userKeypair, ...signers]).catch((err) => console.log(err)));
  const programId = FBONDS_MAINNET;
  // new anchor.web3.PublicKey('DFsZgwKM3SvkvMwVRPQhhEnkYZCS1hZ2g2u6ehmAWjyc');
  // console.log('userKeypair: ', userKeypair.publicKey.toBase58());
  // CROSS_TOKEN_AMM_DEVNET;
  const { account: hadoMarket } = await fbonds.functions.marketFactory.hadoMarket.initializeHadoMarket({
    programId,
    connection: connection,
    accounts: {
      userPubkey: userKeypair.publicKey,
      validationAdapterProgram: FBONDS_MAINNET,
    },
    args: {
      marketDecimals: 5,
      minBidCap: 1,
    },
    sendTxn: sendTxnUserDevnet,
  });

  console.log('hadoMarket: ', hadoMarket.toBase58());
};

const lazyFs = () => {
  const fs = require('fs/promises');
  return fs;
};
const createKeypairFromFile = async (filePath: string) => {
  const secretKeyString = await lazyFs().readFile(filePath, { encoding: 'utf8' });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return anchor.web3.Keypair.fromSecretKey(secretKey);
};

function getTestPairs(): Pair[] {
  const pairs = [
    // {
    //   hadoMarket: 'ANvFFdHqB7MLvWebewhohzzNvCRdDNAFKSmbEA8bhL5g',
    //   pairType: PairType.TokenForNFT,
    //   pairState: 'onMarketVirtual',
    //   pairAuthorityType: 'classicAuthority',
    //   pairAuthorityAdapterProgram: 'AFnufgr188AiEMFji3D5GkB8vNyZybxC8PfcuD1wrfwA',
    //   lpTokensMint: '11111111111111111111111111111111',
    //   lpTokensInCirculation: 0,
    //   bondingCurve: { delta: 1000, bondingType: 'linear' },
    //   baseSpotPrice: 7000,
    //   fee: 0,
    //   mathCounter: -1,
    //   currentSpotPrice: 6000,
    //   bidCap: 25000,
    //   bidSettlement: 0,
    //   edgeSettlement: 0,
    //   feeTokenAccount: '11111111111111111111111111111111',
    //   feeVaultSeed: 254,
    //   solOrTokenFeeAmount: 0,
    //   fundsTokenAccount: '11111111111111111111111111111111',
    //   fundsSolVaultSeed: 254,
    //   fundsSolOrTokenBalance: 0,
    //   initialFundsSolOrTokenBalance: 40800000,
    //   buyOrdersQuantity: 2,
    //   nftsSeed: 255,
    //   sellOrdersCount: 0,
    //   lastTransactedAt: 1675139041,
    //   concentrationIndex: 0,
    //   assetReceiver: '4VjiR1ei5MDs47pBf4Grcz81UiuWcsDCKDAGaquwdRUV',
    //   publicKey: Math.random().toString(),
    //   validation: {
    //     loanToValueFilter: 5000,
    //     durationFilter: 86400,
    //   },
    // },
    // {
    //   hadoMarket: 'ANvFFdHqB7MLvWebewhohzzNvCRdDNAFKSmbEA8bhL5g',
    //   pairType: PairType.TokenForNFT,
    //   pairState: 'onMarketVirtual',
    //   pairAuthorityType: 'classicAuthority',
    //   pairAuthorityAdapterProgram: 'AFnufgr188AiEMFji3D5GkB8vNyZybxC8PfcuD1wrfwA',
    //   lpTokensMint: '11111111111111111111111111111111',
    //   lpTokensInCirculation: 0,
    //   bondingCurve: { delta: 1000, bondingType: 'linear' },
    //   baseSpotPrice: 7000,
    //   fee: 0,
    //   mathCounter: -2,
    //   currentSpotPrice: 5000,
    //   bidCap: 10000000000,
    //   bidSettlement: 0,
    //   edgeSettlement: 0,
    //   feeTokenAccount: '11111111111111111111111111111111',
    //   feeVaultSeed: 254,
    //   solOrTokenFeeAmount: 0,
    //   fundsTokenAccount: '11111111111111111111111111111111',
    //   fundsSolVaultSeed: 254,
    //   fundsSolOrTokenBalance: 0,
    //   initialFundsSolOrTokenBalance: 40800000,
    //   buyOrdersQuantity: 2,
    //   nftsSeed: 255,
    //   sellOrdersCount: 0,
    //   lastTransactedAt: 1675139041,
    //   concentrationIndex: 0,
    //   assetReceiver: '4VjiR1ei5MDs47pBf4Grcz81UiuWcsDCKDAGaquwdRUV',
    //   publicKey: Math.random().toString(),
    //   validation: {
    //     loanToValueFilter: 5000,
    //     durationFilter: 86400,
    //   },
    // },
    {
      hadoMarket: 'ANvFFdHqB7MLvWebewhohzzNvCRdDNAFKSmbEA8bhL5g',
      pairType: PairType.TokenForNFT,
      pairState: 'onMarketVirtual',
      pairAuthorityType: 'classicAuthority',
      pairAuthorityAdapterProgram: 'AFnufgr188AiEMFji3D5GkB8vNyZybxC8PfcuD1wrfwA',
      lpTokensMint: '11111111111111111111111111111111',
      lpTokensInCirculation: 0,
      bondingCurve: { delta: 1000, bondingType: 'linear' },
      baseSpotPrice: 9000,
      fee: 0,
      mathCounter: 0,
      currentSpotPrice: 10000,
      bidCap: 100000,
      bidSettlement: 0,
      edgeSettlement: 50000,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 254,
      solOrTokenFeeAmount: 0,
      fundsTokenAccount: '11111111111111111111111111111111',
      fundsSolVaultSeed: 254,
      fundsSolOrTokenBalance: 0,
      initialFundsSolOrTokenBalance: 40800000,
      buyOrdersQuantity: 2,
      nftsSeed: 255,
      sellOrdersCount: 0,
      lastTransactedAt: 1675139041,
      concentrationIndex: 0,
      assetReceiver: '4VjiR1ei5MDs47pBf4Grcz81UiuWcsDCKDAGaquwdRUV',
      publicKey: Math.random().toString(),
      validation: {
        loanToValueFilter: 9000,
        durationFilter: 86400,
      },
    },
    // {
    //   hadoMarket: 'ANvFFdHqB7MLvWebewhohzzNvCRdDNAFKSmbEA8bhL5g',
    //   pairType: PairType.TokenForNFT,
    //   pairState: 'onMarketVirtual',
    //   pairAuthorityType: 'classicAuthority',
    //   pairAuthorityAdapterProgram: 'AFnufgr188AiEMFji3D5GkB8vNyZybxC8PfcuD1wrfwA',
    //   lpTokensMint: '11111111111111111111111111111111',
    //   lpTokensInCirculation: 0,
    //   bondingCurve: { delta: 1000, bondingType: 'linear' },
    //   baseSpotPrice: 10000,
    //   fee: 0,
    //   mathCounter: -2,
    //   currentSpotPrice: 8000,
    //   bidCap: 10000,
    //   bidSettlement: 0,
    //   edgeSettlement: 0,
    //   feeTokenAccount: '11111111111111111111111111111111',
    //   feeVaultSeed: 254,
    //   solOrTokenFeeAmount: 0,
    //   fundsTokenAccount: '11111111111111111111111111111111',
    //   fundsSolVaultSeed: 254,
    //   fundsSolOrTokenBalance: 0,
    //   initialFundsSolOrTokenBalance: 40800000,
    //   buyOrdersQuantity: 2,
    //   nftsSeed: 255,
    //   sellOrdersCount: 0,
    //   lastTransactedAt: 1675139041,
    //   concentrationIndex: 0,
    //   assetReceiver: '4VjiR1ei5MDs47pBf4Grcz81UiuWcsDCKDAGaquwdRUV',
    //   publicKey: Math.random().toString(),
    //   validation: {
    //     loanToValueFilter: 6000,
    //     durationFilter: 86400,
    //   },
    // }, // floor = 5 SOL, returnAmount = 6 SOL, loanToValue = returnAmount / floor => 1.25 = 125%
    // {
    //   hadoMarket: 'ANvFFdHqB7MLvWebewhohzzNvCRdDNAFKSmbEA8bhL5g',
    //   pairType: PairType.TokenForNFT,
    //   pairState: 'onMarketVirtual',
    //   pairAuthorityType: 'classicAuthority',
    //   pairAuthorityAdapterProgram: 'AFnufgr188AiEMFji3D5GkB8vNyZybxC8PfcuD1wrfwA',
    //   lpTokensMint: '11111111111111111111111111111111',
    //   lpTokensInCirculation: 0,
    //   bondingCurve: { delta: 1000, bondingType: 'linear' },
    //   baseSpotPrice: 10000,
    //   fee: 0,
    //   mathCounter: -1,
    //   currentSpotPrice: 9000,
    //   bidCap: 10000000000,
    //   bidSettlement: 0,
    //   edgeSettlement: 0,
    //   feeTokenAccount: '11111111111111111111111111111111',
    //   feeVaultSeed: 254,
    //   solOrTokenFeeAmount: 0,
    //   fundsTokenAccount: '11111111111111111111111111111111',
    //   fundsSolVaultSeed: 254,
    //   fundsSolOrTokenBalance: 0,
    //   initialFundsSolOrTokenBalance: 40800000,
    //   buyOrdersQuantity: 2,
    //   nftsSeed: 255,
    //   sellOrdersCount: 0,
    //   lastTransactedAt: 1675139041,
    //   concentrationIndex: 0,
    //   assetReceiver: '4VjiR1ei5MDs47pBf4Grcz81UiuWcsDCKDAGaquwdRUV',
    //   publicKey: Math.random().toString(),
    //   validation: {
    //     loanToValueFilter: 3000,
    //     durationFilter: 86400,
    //   },
    // },
  ];
  return pairs as any;
}

function getTestPairs2(): Pair[] {
  const pairs = [
    {
      publicKey: '9N1iYZRNEdiyBCqyNWA3hUuoyxMcz1vaHfaPHAGjqmTy',
      assetReceiver: 'max1BwR6HXgqTptvhRJy2Rv4sEn4gMC41uATsDRgEU7',
      baseSpotPrice: 9000,
      bidCap: 111111,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-02-13T14:23:30.244Z',
      currentSpotPrice: 9000,
      edgeSettlement: 111111,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 999999000,
      isRemoved: false,
      lastTransactedAt: 1676298385,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 254,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-02-13T14:26:45.237Z',
      validation: {
        publicKey: '8buvHCQWCqZtnLher7VuPY4sr1Vaem426dRYM66GDfUF',
        bondFeatures: 'none',
        createdAt: '2023-02-13T14:23:30.242Z',
        durationFilter: 1209600,
        isRemoved: false,
        loanToValueFilter: 3000,
        maxReturnAmountFilter: 1000000000000,
        pair: '9N1iYZRNEdiyBCqyNWA3hUuoyxMcz1vaHfaPHAGjqmTy',
        updatedAt: '2023-02-13T14:23:30.242Z',
        user: 'max1BwR6HXgqTptvhRJy2Rv4sEn4gMC41uATsDRgEU7',
      },
    },
    {
      publicKey: 'z4nUo8Rw7Z7CfEuKAAqYQim6axiBX3oBtfJBWPdKbE2',
      assetReceiver: 'max1BwR6HXgqTptvhRJy2Rv4sEn4gMC41uATsDRgEU7',
      baseSpotPrice: 9000,
      bidCap: 111111,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-02-13T15:25:15.252Z',
      currentSpotPrice: 9000,
      edgeSettlement: 111111,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 254,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 999999000,
      isRemoved: false,
      lastTransactedAt: 1676302038,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-02-13T15:28:00.249Z',
      validation: {
        publicKey: 'CRtCSNhrYTPzBKnmLdNchc6XBwgdzibD5jQVQe72fM5v',
        bondFeatures: 'none',
        createdAt: '2023-02-13T15:25:15.248Z',
        durationFilter: 1209600,
        isRemoved: false,
        loanToValueFilter: 3300,
        maxReturnAmountFilter: 1000000000000,
        pair: 'z4nUo8Rw7Z7CfEuKAAqYQim6axiBX3oBtfJBWPdKbE2',
        updatedAt: '2023-02-13T15:25:15.248Z',
        user: 'max1BwR6HXgqTptvhRJy2Rv4sEn4gMC41uATsDRgEU7',
      },
    },
    {
      publicKey: 'G7FzLkxLvhs5V8j8de7mxrBjHpDcYqSBUg53VvgYR6Cf',
      assetReceiver: 'max1BwR6HXgqTptvhRJy2Rv4sEn4gMC41uATsDRgEU7',
      baseSpotPrice: 9000,
      bidCap: 111111,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-02-13T17:07:45.251Z',
      currentSpotPrice: 9000,
      edgeSettlement: 111111,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 250,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 253,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 999999000,
      isRemoved: false,
      lastTransactedAt: 1676308156,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 254,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-02-13T17:09:45.246Z',
      validation: {
        publicKey: '67i7aboNTkZvPeXMvDCNGvniYyr3KZuqGrpzgH39vXbf',
        bondFeatures: 'none',
        createdAt: '2023-02-13T17:07:45.248Z',
        durationFilter: 1209600,
        isRemoved: false,
        loanToValueFilter: 3000,
        maxReturnAmountFilter: 1000000000000,
        pair: 'G7FzLkxLvhs5V8j8de7mxrBjHpDcYqSBUg53VvgYR6Cf',
        updatedAt: '2023-02-13T17:07:45.248Z',
        user: 'max1BwR6HXgqTptvhRJy2Rv4sEn4gMC41uATsDRgEU7',
      },
    },
    {
      publicKey: 'HJDkU5kk7YyfY9by7MV9EVM7WHUaoxzc8mXKj7iidL2u',
      assetReceiver: 'max1BwR6HXgqTptvhRJy2Rv4sEn4gMC41uATsDRgEU7',
      baseSpotPrice: 9000,
      bidCap: 111111,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-02-13T18:11:30.257Z',
      currentSpotPrice: 9000,
      edgeSettlement: 111111,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 250,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 254,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 999999000,
      isRemoved: false,
      lastTransactedAt: 1676311931,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-02-13T18:13:00.243Z',
      validation: {
        publicKey: 'B3M7DHWh9XqCXBTDxzwAorTBJpZpRRseruWCs6m2KByr',
        bondFeatures: 'none',
        createdAt: '2023-02-13T18:11:30.254Z',
        durationFilter: 1209600,
        isRemoved: false,
        loanToValueFilter: 3000,
        maxReturnAmountFilter: 1000000000000,
        pair: 'HJDkU5kk7YyfY9by7MV9EVM7WHUaoxzc8mXKj7iidL2u',
        updatedAt: '2023-02-13T18:11:30.254Z',
        user: 'max1BwR6HXgqTptvhRJy2Rv4sEn4gMC41uATsDRgEU7',
      },
    },
    {
      publicKey: 'BHp7zdNdezZ7ckU3AjnHQYb8KuY6v7FqSj1dm2PAdSKj',
      assetReceiver: '9hFYKCAUNzRkrjfgUPuTKHuxEcqE1fQkSaH3m37brSAD',
      baseSpotPrice: 9600,
      bidCap: 2083333,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-02-13T18:31:00.261Z',
      currentSpotPrice: 9600,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 253,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 254,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 19999996800,
      isRemoved: false,
      lastTransactedAt: 1676313032,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 253,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-02-21T06:27:45.293Z',
      validation: {
        publicKey: 'De8SuvhoHH9QkeEeKnXyneD9au66DHSXqtbWX83PUe8z',
        bondFeatures: 'none',
        createdAt: '2023-02-13T18:31:00.266Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 7500,
        maxReturnAmountFilter: 1000000000000,
        pair: 'BHp7zdNdezZ7ckU3AjnHQYb8KuY6v7FqSj1dm2PAdSKj',
        updatedAt: '2023-02-13T18:31:00.266Z',
        user: '9hFYKCAUNzRkrjfgUPuTKHuxEcqE1fQkSaH3m37brSAD',
      },
    },
    {
      publicKey: '3EFNh2KBYE6aiAfgMcff6Xw4KvoaKNLzhLdt48XyVSzv',
      assetReceiver: 'tioEGUcmaUSRJwGkddEYZHuhnUG47uirBmds6aELE1x',
      baseSpotPrice: 9500,
      bidCap: 2105263,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-02-15T20:24:15.277Z',
      currentSpotPrice: 9500,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 249,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 253,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 19999998500,
      isRemoved: false,
      lastTransactedAt: 1676492624,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-02-21T06:27:45.293Z',
      validation: {
        publicKey: 'Fd1PeVjUDeG12qmivrkuZcaAyZUvsGQADK31jdMe9fzX',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-02-15T20:24:15.275Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 6900,
        maxReturnAmountFilter: 1000000000000,
        pair: '3EFNh2KBYE6aiAfgMcff6Xw4KvoaKNLzhLdt48XyVSzv',
        updatedAt: '2023-02-15T20:24:15.275Z',
        user: 'tioEGUcmaUSRJwGkddEYZHuhnUG47uirBmds6aELE1x',
      },
    },
    {
      publicKey: '5dATBH7iWfkiihj4bPzBrLuw5SdQPrcmH3oy37dk6oyv',
      assetReceiver: '71kG5LnbjVFp3Grj7VZ8WCqTNU6XRihoPuHRTMvmZGKb',
      baseSpotPrice: 9900,
      bidCap: 10101,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-02-17T00:17:45.267Z',
      currentSpotPrice: 9900,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 99999900,
      isRemoved: false,
      lastTransactedAt: 1676593038,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 253,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-10T16:29:16.480Z',
      validation: {
        publicKey: 'AjuRT7STjPerFHQ2oaKNqnpy3bpi5j9sWjoh6JeDVyde',
        bondFeatures: 'none',
        createdAt: '2023-02-17T00:17:45.272Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 1000,
        maxReturnAmountFilter: 1000000000000,
        pair: '5dATBH7iWfkiihj4bPzBrLuw5SdQPrcmH3oy37dk6oyv',
        updatedAt: '2023-02-17T00:17:45.272Z',
        user: '71kG5LnbjVFp3Grj7VZ8WCqTNU6XRihoPuHRTMvmZGKb',
      },
    },
    {
      publicKey: 'Ad1NZCEDuHvGwJezGiPov2iGUsLuje3wTyn4wqrnkB1Y',
      assetReceiver: '2AKGwkLhFgNqKbfuakrjFvvYaTERJ1C91pjDDqKfX2wi',
      baseSpotPrice: 9820,
      bidCap: 1425661,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-02-17T17:15:30.289Z',
      currentSpotPrice: 9820,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 248,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 13999991020,
      isRemoved: false,
      lastTransactedAt: 1676654104,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-02-21T06:27:45.293Z',
      validation: {
        publicKey: '5mEX8Zfd2HhkHTbEKwHo1JuRfr6cjw4XcWzahozkXeYK',
        bondFeatures: 'none',
        createdAt: '2023-02-17T17:15:30.279Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 6700,
        maxReturnAmountFilter: 1000000000000,
        pair: 'Ad1NZCEDuHvGwJezGiPov2iGUsLuje3wTyn4wqrnkB1Y',
        updatedAt: '2023-02-17T17:15:30.279Z',
        user: '2AKGwkLhFgNqKbfuakrjFvvYaTERJ1C91pjDDqKfX2wi',
      },
    },
    {
      publicKey: '6h1D3tFoT8VHEvAgUXWGGpVX93hwzMPvKkRPwn9P97qy',
      assetReceiver: 'BK1W2fphfja4TcZE7D58mzh9vuRUVbxNcFQXS7vzgWih',
      baseSpotPrice: 9726,
      bidCap: 5140859,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-02-20T12:33:45.297Z',
      currentSpotPrice: 9726,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 254,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 252,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 49999994634,
      isRemoved: false,
      lastTransactedAt: 1676896394,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 253,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-02-21T06:27:45.293Z',
      validation: {
        publicKey: '3b5TzbJZX7gLACNgKsJmkKvfKrXo3wgXaMf5bgBBLq15',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-02-20T12:33:45.309Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 9000,
        maxReturnAmountFilter: 1000000000000,
        pair: '6h1D3tFoT8VHEvAgUXWGGpVX93hwzMPvKkRPwn9P97qy',
        updatedAt: '2023-02-20T12:33:45.309Z',
        user: 'BK1W2fphfja4TcZE7D58mzh9vuRUVbxNcFQXS7vzgWih',
      },
    },
    {
      publicKey: '6pv94RYRrPrPU88S2nLix2Y2B2duyL3mAwmJkztukrn2',
      assetReceiver: 'tioEGUcmaUSRJwGkddEYZHuhnUG47uirBmds6aELE1x',
      baseSpotPrice: 9310,
      bidCap: 2148227,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-02-22T17:50:30.339Z',
      currentSpotPrice: 9310,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 254,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 252,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 19999993370,
      isRemoved: false,
      lastTransactedAt: 1677088207,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-02-26T22:31:30.598Z',
      validation: {
        publicKey: 'FC7nYMH1wUXakCwcX8jUPGzkAGJAZPcy9P2cA7mfv4Lu',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-02-22T17:50:30.347Z',
        durationFilter: 1209600,
        isRemoved: false,
        loanToValueFilter: 6900,
        maxReturnAmountFilter: 1000000000000,
        pair: '6pv94RYRrPrPU88S2nLix2Y2B2duyL3mAwmJkztukrn2',
        updatedAt: '2023-02-22T17:50:30.347Z',
        user: 'tioEGUcmaUSRJwGkddEYZHuhnUG47uirBmds6aELE1x',
      },
    },
    {
      publicKey: 'J2dQLkYT7Jx4EkGBNghVU29kVrSbAU3Zp4q6Uq9WGoJp',
      assetReceiver: 'GZPR6mod1ucHQt2TxGjgwQR527xZ4x1NBV5aNyZ7dFNs',
      baseSpotPrice: 9500,
      bidCap: 2105263,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-02-24T11:30:45.549Z',
      currentSpotPrice: 9500,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 252,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 19999998500,
      isRemoved: false,
      lastTransactedAt: 1677238221,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 254,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-02-26T22:41:45.611Z',
      validation: {
        publicKey: '4Zki1xG6UKqJKUEgLyfS4CBXiPXUD7viasgdk9eHbwT2',
        bondFeatures: 'none',
        createdAt: '2023-02-24T11:30:45.649Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 5000,
        maxReturnAmountFilter: 1000000000000,
        pair: 'J2dQLkYT7Jx4EkGBNghVU29kVrSbAU3Zp4q6Uq9WGoJp',
        updatedAt: '2023-02-24T11:30:45.649Z',
        user: 'GZPR6mod1ucHQt2TxGjgwQR527xZ4x1NBV5aNyZ7dFNs',
      },
    },
    {
      publicKey: 'Cqs4vY6DznyChTbAkPrsBp2tN3S3dw8bBRmdXvCQSSrH',
      assetReceiver: '5DEWTcT2PU4dDsDLoZxhGhZTE87tSMD8pJ3K1XV1uo6C',
      baseSpotPrice: 9850,
      bidCap: 1015228,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-02-26T13:05:45.565Z',
      currentSpotPrice: 9850,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 9999995800,
      isRemoved: false,
      lastTransactedAt: 1677416719,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 254,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-02-26T22:41:45.611Z',
      validation: {
        publicKey: '7QVHLGuC6LcrTdGhksz6JJaQHEz6FKSUoXYuUqxaR7Hg',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-02-26T13:05:45.606Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 5000,
        maxReturnAmountFilter: 1000000000000,
        pair: 'Cqs4vY6DznyChTbAkPrsBp2tN3S3dw8bBRmdXvCQSSrH',
        updatedAt: '2023-02-26T13:05:45.606Z',
        user: '5DEWTcT2PU4dDsDLoZxhGhZTE87tSMD8pJ3K1XV1uo6C',
      },
    },
    {
      publicKey: '5XpWHRfYiornE5WxN59oqvZWv3awRs7n5hfahBswq1YG',
      assetReceiver: 'GAHb7LbGXx41HEMHY46qDM65VmrXWYJjs5fPJU2iXzo5',
      baseSpotPrice: 9800,
      bidCap: 1020,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-02-27T07:59:30.625Z',
      currentSpotPrice: 9800,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 254,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 9996000,
      isRemoved: false,
      lastTransactedAt: 1677484743,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 252,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-13T10:53:16.960Z',
      validation: {
        publicKey: '2nUZyRXxsScDoMxBh6fS632x1ymikpiLrfHWH3tus2GE',
        bondFeatures: 'none',
        createdAt: '2023-02-27T07:59:30.617Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 3000,
        maxReturnAmountFilter: 1000000000000,
        pair: '5XpWHRfYiornE5WxN59oqvZWv3awRs7n5hfahBswq1YG',
        updatedAt: '2023-02-27T07:59:30.617Z',
        user: 'GAHb7LbGXx41HEMHY46qDM65VmrXWYJjs5fPJU2iXzo5',
      },
    },
    {
      publicKey: 'AFhDNHgrJrp6osKPvpYeFazLYrny81ThbzdVvFrZQFNR',
      assetReceiver: 'EkExbysCPaWtPyvKYKsPnpuZxzfFubVKg9Ri6qrV5gTm',
      baseSpotPrice: 9831,
      bidCap: 5594547,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-02-27T14:08:45.462Z',
      currentSpotPrice: 9831,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 252,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 54999991557,
      isRemoved: false,
      lastTransactedAt: 1677506897,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-10T16:34:01.678Z',
      validation: {
        publicKey: '7DhZsUsaSE18y5Wf53QT7Hwc4rxXedXn1nGS5xurcpcG',
        bondFeatures: 'none',
        createdAt: '2023-02-27T14:08:45.479Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 7600,
        maxReturnAmountFilter: 1000000000000,
        pair: 'AFhDNHgrJrp6osKPvpYeFazLYrny81ThbzdVvFrZQFNR',
        updatedAt: '2023-02-27T14:08:45.479Z',
        user: 'EkExbysCPaWtPyvKYKsPnpuZxzfFubVKg9Ri6qrV5gTm',
      },
    },
    {
      publicKey: 'qn6FKUgsRY5mN74pJiEoUEUiidE2bf6NPTMCAafSqE2',
      assetReceiver: '41RM36JUkmyYTYwX75eDekHTSh7pJeCshbFRau5YUbqZ',
      baseSpotPrice: 9850,
      bidCap: 1015228,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-02-27T22:44:45.616Z',
      currentSpotPrice: 9850,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 253,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 9999995800,
      isRemoved: false,
      lastTransactedAt: 1677537863,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-10T13:43:31.034Z',
      validation: {
        publicKey: '4NZJhE53U2Eve6tPDRZCSYc6HUSR4irpHrpzkYFcYwCQ',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-02-27T22:44:45.596Z',
        durationFilter: 1209600,
        isRemoved: false,
        loanToValueFilter: 6900,
        maxReturnAmountFilter: 1000000000000,
        pair: 'qn6FKUgsRY5mN74pJiEoUEUiidE2bf6NPTMCAafSqE2',
        updatedAt: '2023-02-27T22:44:45.596Z',
        user: '41RM36JUkmyYTYwX75eDekHTSh7pJeCshbFRau5YUbqZ',
      },
    },
    {
      publicKey: 'A8ZxpVgnTahxfEcXVdQuBpSUozJoFi7jCPSiEAq74qJp',
      assetReceiver: '41RM36JUkmyYTYwX75eDekHTSh7pJeCshbFRau5YUbqZ',
      baseSpotPrice: 9831,
      bidCap: 1017190,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-02-27T22:46:00.497Z',
      currentSpotPrice: 9831,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 253,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 9999994890,
      isRemoved: false,
      lastTransactedAt: 1677537940,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 253,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-10T17:19:02.347Z',
      validation: {
        publicKey: '2feyZkWBj2QxhwVhkZmA4hVbZAewHkm6iUnYnjcsRLws',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-02-27T22:46:00.472Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 7900,
        maxReturnAmountFilter: 1000000000000,
        pair: 'A8ZxpVgnTahxfEcXVdQuBpSUozJoFi7jCPSiEAq74qJp',
        updatedAt: '2023-02-27T22:46:00.472Z',
        user: '41RM36JUkmyYTYwX75eDekHTSh7pJeCshbFRau5YUbqZ',
      },
    },
    {
      publicKey: 'CcxMQuZ6fqxAmRuUv1qew1BaHVT7vqHXrdC2yANhmL2R',
      assetReceiver: '41RM36JUkmyYTYwX75eDekHTSh7pJeCshbFRau5YUbqZ',
      baseSpotPrice: 9600,
      bidCap: 729166,
      bidSettlement: -143617,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 1,
      concentrationIndex: 0,
      createdAt: '2023-03-06T17:15:30.903Z',
      currentSpotPrice: 9600,
      edgeSettlement: 585549,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 254,
      fundsSolOrTokenBalance: 5621270400,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 6999993600,
      isRemoved: false,
      lastTransactedAt: 1678122915,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: 0,
      nftsSeed: 253,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-15T11:03:16.654Z',
      validation: {
        publicKey: '72EchKujgta4YPBH79LWXjNkUt7ZokdXY2o4oFTWanvj',
        bondFeatures: 'none',
        createdAt: '2023-03-06T17:15:30.889Z',
        durationFilter: 1209600,
        isRemoved: false,
        loanToValueFilter: 1000,
        maxReturnAmountFilter: 1000000000000,
        pair: 'CcxMQuZ6fqxAmRuUv1qew1BaHVT7vqHXrdC2yANhmL2R',
        updatedAt: '2023-03-06T17:15:30.889Z',
        user: '41RM36JUkmyYTYwX75eDekHTSh7pJeCshbFRau5YUbqZ',
      },
    },
    {
      publicKey: 'HBzo8Y7hq4F6ZW9kfuMkbAfxJLw6E5CsePNB9G2yhwbd',
      assetReceiver: 'F36TEMRHdUDEYiytUFHfuZQskepU7V1i2gwfApqH1HcE',
      baseSpotPrice: 9400,
      bidCap: 212765,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-03-06T17:21:16.310Z',
      currentSpotPrice: 9400,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 1999991000,
      isRemoved: false,
      lastTransactedAt: 1678123246,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 254,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-15T10:55:46.553Z',
      validation: {
        publicKey: 'A4kzZvX3kuS28eWd9sWhA3ybCWJMYtExn15choct6bqx',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-03-06T17:21:16.280Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 8900,
        maxReturnAmountFilter: 1000000000000,
        pair: 'HBzo8Y7hq4F6ZW9kfuMkbAfxJLw6E5CsePNB9G2yhwbd',
        updatedAt: '2023-03-06T17:21:16.280Z',
        user: 'F36TEMRHdUDEYiytUFHfuZQskepU7V1i2gwfApqH1HcE',
      },
    },
    {
      publicKey: 'GgUF9UFD6ZM6zRQQEQixyXpnUujmJWH97e6NUB1Edvb2',
      assetReceiver: 'max1BwR6HXgqTptvhRJy2Rv4sEn4gMC41uATsDRgEU7',
      baseSpotPrice: 9900,
      bidCap: 202020,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-03-13T10:39:31.879Z',
      currentSpotPrice: 9900,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 252,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 254,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 1999998000,
      isRemoved: false,
      lastTransactedAt: 1678703954,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 253,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-13T10:46:16.511Z',
      validation: {
        publicKey: 'Enve3CQwqZCkf7Y8tAzWdfnA6f488zWQr9mg8yiyPwtm',
        bondFeatures: 'none',
        createdAt: '2023-03-13T10:39:31.819Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 9500,
        maxReturnAmountFilter: 41948380942,
        pair: 'GgUF9UFD6ZM6zRQQEQixyXpnUujmJWH97e6NUB1Edvb2',
        updatedAt: '2023-03-13T10:39:31.819Z',
        user: 'max1BwR6HXgqTptvhRJy2Rv4sEn4gMC41uATsDRgEU7',
      },
    },
    {
      publicKey: 'GWrNwAHN1u5qbL2DMkBhxCKWH1WC32yv2MCVcemimJ4n',
      assetReceiver: '6JgexLq1STiDE3MvjvnsZqdevnoHMTeaM7FrJRNt2Mrg',
      baseSpotPrice: 9900,
      bidCap: 202020,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-03-13T13:52:46.198Z',
      currentSpotPrice: 9900,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 253,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 254,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 1919446800,
      isRemoved: false,
      lastTransactedAt: 1678715529,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 253,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-13T14:03:49.013Z',
      validation: {
        publicKey: '9eAhzpXeACnm7DkgnJKjzz9Vuba7SRNTmnVYNSUt22Mj',
        bondFeatures: 'none',
        createdAt: '2023-03-13T13:52:46.162Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 3000,
        maxReturnAmountFilter: 10987742929,
        pair: 'GWrNwAHN1u5qbL2DMkBhxCKWH1WC32yv2MCVcemimJ4n',
        updatedAt: '2023-03-13T14:02:31.577Z',
        user: '6JgexLq1STiDE3MvjvnsZqdevnoHMTeaM7FrJRNt2Mrg',
      },
    },
    {
      publicKey: '131Yo9VLjQ3yeqxLsBhhSxR5avzXomwUCczEVBBaXBwF',
      assetReceiver: '6StcuetFJAbE7L14MwxpDvSekhK1YEoCZkG5WTieVvy',
      baseSpotPrice: 9800,
      bidCap: 1020408,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-03-13T16:27:47.176Z',
      currentSpotPrice: 9800,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 254,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 9999998400,
      isRemoved: false,
      lastTransactedAt: 1678724836,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 253,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-13T17:35:32.805Z',
      validation: {
        publicKey: '7wKsdLA4f7ZVfwHEKoSkGU3Hwzun19JyF7F7Lghmiktm',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-03-13T16:27:47.202Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 7000,
        maxReturnAmountFilter: 30538447076,
        pair: '131Yo9VLjQ3yeqxLsBhhSxR5avzXomwUCczEVBBaXBwF',
        updatedAt: '2023-03-13T16:27:47.202Z',
        user: '6StcuetFJAbE7L14MwxpDvSekhK1YEoCZkG5WTieVvy',
      },
    },
    {
      publicKey: '75E7fdy8GTBjfDfRLchVkn6d34qQhgVwPA7sGqkVUNMB',
      assetReceiver: '6StcuetFJAbE7L14MwxpDvSekhK1YEoCZkG5WTieVvy',
      baseSpotPrice: 9650,
      bidCap: 1036269,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-03-13T16:28:46.966Z',
      currentSpotPrice: 9650,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 253,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 9999995850,
      isRemoved: false,
      lastTransactedAt: 1678724895,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-15T10:55:46.553Z',
      validation: {
        publicKey: 'DZRZF8WQJL6TVkTsDg67LE8aLK2cP9syfKTx9wx3wvxx',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-03-13T16:28:46.892Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 7000,
        maxReturnAmountFilter: 30538447076,
        pair: '75E7fdy8GTBjfDfRLchVkn6d34qQhgVwPA7sGqkVUNMB',
        updatedAt: '2023-03-13T16:28:46.892Z',
        user: '6StcuetFJAbE7L14MwxpDvSekhK1YEoCZkG5WTieVvy',
      },
    },
    {
      publicKey: 'H6QXmGjcYoKiFRM6fxcGXGiUsNGnB3hELz7LNXhT2TUE',
      assetReceiver: '41RM36JUkmyYTYwX75eDekHTSh7pJeCshbFRau5YUbqZ',
      baseSpotPrice: 9800,
      bidCap: 1530612,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-03-13T19:13:46.219Z',
      currentSpotPrice: 9800,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 14999997600,
      isRemoved: false,
      lastTransactedAt: 1678734792,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-14T11:21:18.138Z',
      validation: {
        publicKey: '2BgSZ1xJDbvCUQHmDM1pZYf8Jyq55DAWP9RTFmirGtHd',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-03-13T19:13:46.187Z',
        durationFilter: 1209600,
        isRemoved: false,
        loanToValueFilter: 8500,
        maxReturnAmountFilter: 36959184176,
        pair: 'H6QXmGjcYoKiFRM6fxcGXGiUsNGnB3hELz7LNXhT2TUE',
        updatedAt: '2023-03-13T19:13:46.187Z',
        user: '41RM36JUkmyYTYwX75eDekHTSh7pJeCshbFRau5YUbqZ',
      },
    },
    {
      publicKey: 'NwgzNeiG2Vnv8dc9U9f9RwTdSAMU68QLpTfhBdYveR5',
      assetReceiver: 'tioEGUcmaUSRJwGkddEYZHuhnUG47uirBmds6aELE1x',
      baseSpotPrice: 9580,
      bidCap: 4070981,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-03-15T11:05:02.321Z',
      currentSpotPrice: 9580,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 252,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 38999997980,
      isRemoved: false,
      lastTransactedAt: 1678878273,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 254,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-15T21:08:16.730Z',
      validation: {
        publicKey: 'A1NnMVQKb8pGEadnf15SkkC6KvSaSAFt1TmxLUeiUUpL',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-03-15T11:05:02.303Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 6900,
        maxReturnAmountFilter: 29728864818,
        pair: 'NwgzNeiG2Vnv8dc9U9f9RwTdSAMU68QLpTfhBdYveR5',
        updatedAt: '2023-03-15T11:05:02.303Z',
        user: 'tioEGUcmaUSRJwGkddEYZHuhnUG47uirBmds6aELE1x',
      },
    },
    {
      publicKey: '7HzUB41kawtH7aVuF62Kvx5Ntk7RpLBDR1wUcJfKU2a6',
      assetReceiver: '6StcuetFJAbE7L14MwxpDvSekhK1YEoCZkG5WTieVvy',
      baseSpotPrice: 9600,
      bidCap: 520833,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-03-15T14:52:46.411Z',
      currentSpotPrice: 9600,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 254,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 4999996800,
      isRemoved: false,
      lastTransactedAt: 1678891933,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 254,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-15T20:15:32.447Z',
      validation: {
        publicKey: 'RR8pLWPQh3RCJpvYaC94TxYfKwbjQ7thb4tfRxm9Vvu',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-03-15T14:52:31.481Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 7000,
        maxReturnAmountFilter: 30159717931,
        pair: '7HzUB41kawtH7aVuF62Kvx5Ntk7RpLBDR1wUcJfKU2a6',
        updatedAt: '2023-03-15T14:52:31.481Z',
        user: '6StcuetFJAbE7L14MwxpDvSekhK1YEoCZkG5WTieVvy',
      },
    },
    {
      publicKey: 'GELoDQ5u5Z4S1RLW4Pj4JmrF83QyiqDunzjKxK6oiWHD',
      assetReceiver: '6StcuetFJAbE7L14MwxpDvSekhK1YEoCZkG5WTieVvy',
      baseSpotPrice: 9700,
      bidCap: 1030927,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-03-15T14:53:16.625Z',
      currentSpotPrice: 9700,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 252,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 14453310400,
      isRemoved: false,
      lastTransactedAt: 1678891978,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 254,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-15T20:54:32.310Z',
      validation: {
        publicKey: '7qbA4uY385m8P2T6urGAxL7PKyqVYVQJxLv24naM8azX',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-03-15T14:53:16.650Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 6000,
        maxReturnAmountFilter: 25851186798,
        pair: 'GELoDQ5u5Z4S1RLW4Pj4JmrF83QyiqDunzjKxK6oiWHD',
        updatedAt: '2023-03-15T14:53:16.650Z',
        user: '6StcuetFJAbE7L14MwxpDvSekhK1YEoCZkG5WTieVvy',
      },
    },
    {
      publicKey: '7sCwXGBtuq5bqrms34kKHEUPSZe8AotizHHXa6Dnsgu2',
      assetReceiver: '5HrpAPrH9aoqH3gVYDQcmGuq2y7EgpBN7d6Cfkt1JLA4',
      baseSpotPrice: 9735,
      bidCap: 1540832,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-03-15T18:42:46.734Z',
      currentSpotPrice: 9735,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 252,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 253,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 14999999520,
      isRemoved: false,
      lastTransactedAt: 1678905745,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-15T20:58:02.462Z',
      validation: {
        publicKey: 'H3vGuGcnigfB2wtMSUxE5GNEjGM9NbAVXiBGuJohshxM',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-03-15T18:42:46.673Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 5500,
        maxReturnAmountFilter: 23463000000,
        pair: '7sCwXGBtuq5bqrms34kKHEUPSZe8AotizHHXa6Dnsgu2',
        updatedAt: '2023-03-15T18:42:46.673Z',
        user: '5HrpAPrH9aoqH3gVYDQcmGuq2y7EgpBN7d6Cfkt1JLA4',
      },
    },
    {
      publicKey: 'Dv9eq1qt98p5FyZE6HBkVx7iZhwm5fxvr6b6gAFwSywf',
      assetReceiver: '6StcuetFJAbE7L14MwxpDvSekhK1YEoCZkG5WTieVvy',
      baseSpotPrice: 9700,
      bidCap: 1030927,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-03-16T09:53:01.500Z',
      currentSpotPrice: 9700,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 9999991900,
      isRemoved: false,
      lastTransactedAt: 1678960354,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 254,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-17T13:10:17.494Z',
      validation: {
        publicKey: 'Fb1ijEbQDPfhoqBcqGAeuC5vRWY25KfxdysQxcJCALNt',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-03-16T09:53:01.482Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 7000,
        maxReturnAmountFilter: 28675150000,
        pair: 'Dv9eq1qt98p5FyZE6HBkVx7iZhwm5fxvr6b6gAFwSywf',
        updatedAt: '2023-03-16T09:53:01.482Z',
        user: '6StcuetFJAbE7L14MwxpDvSekhK1YEoCZkG5WTieVvy',
      },
    },
    {
      publicKey: 'H6sfrSfFSPeApKpBKkb5mfvVkg5ach2WZ9m7UaEZy42W',
      assetReceiver: 'tUdwY6weXNEiwJvwae9hpAxEcJDTgN3TvPFsUE1JGkK',
      baseSpotPrice: 9500,
      bidCap: 2473684,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-03-20T15:53:48.231Z',
      currentSpotPrice: 9500,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 24999991000,
      isRemoved: false,
      lastTransactedAt: 1679880222,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -2,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-27T01:24:01.515Z',
      validation: {
        publicKey: 'HVPmEsYisvef8LhTj69EHBvJGATH1EFkk9b3wXSVkTQQ',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-03-20T15:53:48.253Z',
        durationFilter: 1209600,
        isRemoved: false,
        loanToValueFilter: 9000,
        maxReturnAmountFilter: 35138875740,
        pair: 'H6sfrSfFSPeApKpBKkb5mfvVkg5ach2WZ9m7UaEZy42W',
        updatedAt: '2023-03-20T15:53:48.253Z',
        user: 'tUdwY6weXNEiwJvwae9hpAxEcJDTgN3TvPFsUE1JGkK',
      },
    },
    {
      publicKey: '56fQoB3ChoYKZmem2ehWqhgwvhj9aNLHUttjs2euEsDM',
      assetReceiver: '6hiKjRUJ4rAqJJBwrkximSuCHhGj8NfeDJdC4ZW6a2P6',
      baseSpotPrice: 9700,
      bidCap: 2061855,
      bidSettlement: -265821,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 1,
      concentrationIndex: 0,
      createdAt: '2023-03-21T12:55:32.047Z',
      currentSpotPrice: 9700,
      edgeSettlement: 1796034,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 17421529800,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 66786343000,
      isRemoved: false,
      lastTransactedAt: 1679403314,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: 0,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-04-01T16:49:32.320Z',
      validation: {
        publicKey: 'DWgNTTiiuGYEVCxyVjCuaCH6roM2VqZDm52puUkLKAYp',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-03-21T12:55:31.983Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 8500,
        maxReturnAmountFilter: 31094291383,
        pair: '56fQoB3ChoYKZmem2ehWqhgwvhj9aNLHUttjs2euEsDM',
        updatedAt: '2023-03-21T12:55:31.983Z',
        user: '6hiKjRUJ4rAqJJBwrkximSuCHhGj8NfeDJdC4ZW6a2P6',
      },
    },
    {
      publicKey: '9Z7s9N26FbPCQ3jwRpkbxKC6P4RgCbhYKvkNEAPs7G7Q',
      assetReceiver: '6hiKjRUJ4rAqJJBwrkximSuCHhGj8NfeDJdC4ZW6a2P6',
      baseSpotPrice: 9600,
      bidCap: 2187500,
      bidSettlement: -1129401,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 1,
      concentrationIndex: 0,
      createdAt: '2023-03-21T13:00:46.803Z',
      currentSpotPrice: 9600,
      edgeSettlement: 1058099,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 10157750400,
      fundsSolVaultSeed: 254,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 61051382400,
      isRemoved: false,
      lastTransactedAt: 1679403624,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: 0,
      nftsSeed: 252,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-29T10:41:48.053Z',
      validation: {
        publicKey: '5XtJVuHQ2MqWXhM8sx1XpCy5K2xLCLumNjAG1bUS6EW2',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-03-21T13:00:46.824Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 9000,
        maxReturnAmountFilter: 32923367347,
        pair: '9Z7s9N26FbPCQ3jwRpkbxKC6P4RgCbhYKvkNEAPs7G7Q',
        updatedAt: '2023-03-21T13:00:46.824Z',
        user: '6hiKjRUJ4rAqJJBwrkximSuCHhGj8NfeDJdC4ZW6a2P6',
      },
    },
    {
      publicKey: 'FJHthTQHn66mNskHBNrYzaq2kT5BYjevrGSeYzDzKT73',
      assetReceiver: 'EitZCN2PacavMjTMNdfgtnuGEhn3WqEtxHGtTNhhvek',
      baseSpotPrice: 9667,
      bidCap: 1551670,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-03-22T04:30:16.593Z',
      currentSpotPrice: 9667,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 253,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 14999993890,
      isRemoved: false,
      lastTransactedAt: 1679459387,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-22T18:15:17.481Z',
      validation: {
        publicKey: 'DiVXrip5tr15i8sh6ps7cGBdFrBWpcxuCFSh8Bfytp9X',
        bondFeatures: 'none',
        createdAt: '2023-03-22T04:30:16.575Z',
        durationFilter: 1209600,
        isRemoved: false,
        loanToValueFilter: 8800,
        maxReturnAmountFilter: 32191736962,
        pair: 'FJHthTQHn66mNskHBNrYzaq2kT5BYjevrGSeYzDzKT73',
        updatedAt: '2023-03-22T04:30:16.575Z',
        user: 'EitZCN2PacavMjTMNdfgtnuGEhn3WqEtxHGtTNhhvek',
      },
    },
    {
      publicKey: '5ZXLNE6ALTzQp2ykm6Wo7isYbGFvGN4edoMJMfUy7Gzp',
      assetReceiver: '41RM36JUkmyYTYwX75eDekHTSh7pJeCshbFRau5YUbqZ',
      baseSpotPrice: 9600,
      bidCap: 531250,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-03-22T13:47:01.936Z',
      currentSpotPrice: 9600,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 5100000000,
      isRemoved: false,
      lastTransactedAt: 1679492795,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-22T18:15:17.481Z',
      validation: {
        publicKey: 'E1M8Xu3YuNes7jeyBvt66fgS9dYMP3XQss7QepPACmoM',
        bondFeatures: 'none',
        createdAt: '2023-03-22T13:47:02.010Z',
        durationFilter: 1209600,
        isRemoved: false,
        loanToValueFilter: 9000,
        maxReturnAmountFilter: 34226999999,
        pair: '5ZXLNE6ALTzQp2ykm6Wo7isYbGFvGN4edoMJMfUy7Gzp',
        updatedAt: '2023-03-22T13:47:02.010Z',
        user: '41RM36JUkmyYTYwX75eDekHTSh7pJeCshbFRau5YUbqZ',
      },
    },
    {
      publicKey: '3YVVNRDNco4JrqXQC7qnVUcP8PSspCX5CtbeMzhHY8cx',
      assetReceiver: '41RM36JUkmyYTYwX75eDekHTSh7pJeCshbFRau5YUbqZ',
      baseSpotPrice: 9800,
      bidCap: 969387,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-03-28T16:04:31.426Z',
      currentSpotPrice: 9800,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 9499992600,
      isRemoved: false,
      lastTransactedAt: 1680019448,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 248,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-28T16:12:16.659Z',
      validation: {
        publicKey: 'GBFoCq3fi5Q4a17AdD3SXWugEnLj89XLh4jLcrfTZsrr',
        bondFeatures: 'receiveNftOnLiquidation',
        createdAt: '2023-03-28T16:04:31.339Z',
        durationFilter: 1209600,
        isRemoved: false,
        loanToValueFilter: 9000,
        maxReturnAmountFilter: 33920328874,
        pair: '3YVVNRDNco4JrqXQC7qnVUcP8PSspCX5CtbeMzhHY8cx',
        updatedAt: '2023-03-28T16:04:31.339Z',
        user: '41RM36JUkmyYTYwX75eDekHTSh7pJeCshbFRau5YUbqZ',
      },
    },
    {
      publicKey: '5B28WfGhBkLrrtRP65zvXfaKoQ9Lignrq2HRS1cJSUoR',
      assetReceiver: '6JgexLq1STiDE3MvjvnsZqdevnoHMTeaM7FrJRNt2Mrg',
      baseSpotPrice: 9300,
      bidCap: 1075260,
      bidSettlement: -967734,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 1,
      concentrationIndex: 0,
      createdAt: '2023-03-30T05:50:31.286Z',
      currentSpotPrice: 9300,
      edgeSettlement: 107526,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 999991800,
      fundsSolVaultSeed: 254,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 999991800,
      isRemoved: false,
      lastTransactedAt: 1680155408,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: 0,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-30T05:50:31.286Z',
      validation: {
        publicKey: 'F3bCsBcBXvfbQSBtq25UA1zFGqMseaXUm5TvB9m1X8c2',
        bondFeatures: 'autoCompoundAndReceiveNft',
        createdAt: '2023-03-30T05:50:31.228Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 3800,
        maxReturnAmountFilter: 14381010960,
        pair: '5B28WfGhBkLrrtRP65zvXfaKoQ9Lignrq2HRS1cJSUoR',
        updatedAt: '2023-03-30T05:50:31.228Z',
        user: '6JgexLq1STiDE3MvjvnsZqdevnoHMTeaM7FrJRNt2Mrg',
      },
    },
    {
      publicKey: 'BXCVFiACyN5gksEv7reNLR5c5T1SvbWwTR2k2TjsWqBx',
      assetReceiver: '8gpJoXXcYHKKe7ZVihEmP99SRAkqEmbsEb4Qr5fqFQga',
      baseSpotPrice: 9700,
      bidCap: 15463910,
      bidSettlement: -14910123,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 1,
      concentrationIndex: 0,
      createdAt: '2023-03-30T09:36:17.723Z',
      currentSpotPrice: 9700,
      edgeSettlement: 553787,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 5371733900,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 14999992700,
      isRemoved: false,
      lastTransactedAt: 1680168948,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: 0,
      nftsSeed: 252,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-30T16:09:32.841Z',
      validation: {
        publicKey: 'BLsiNHBaLjB4ewEEWk8LFuie9if7jALapoCQP1Qyzmra',
        bondFeatures: 'autocompound',
        createdAt: '2023-03-30T09:36:17.677Z',
        durationFilter: 1209600,
        isRemoved: false,
        loanToValueFilter: 7900,
        maxReturnAmountFilter: 29851506290,
        pair: 'BXCVFiACyN5gksEv7reNLR5c5T1SvbWwTR2k2TjsWqBx',
        updatedAt: '2023-03-30T09:36:17.677Z',
        user: '8gpJoXXcYHKKe7ZVihEmP99SRAkqEmbsEb4Qr5fqFQga',
      },
    },
    {
      publicKey: 'FL7XbBhu5pwWrwPgYGzLPv5J2gC8K4CqBNjoZyx888Xb',
      assetReceiver: '41RM36JUkmyYTYwX75eDekHTSh7pJeCshbFRau5YUbqZ',
      baseSpotPrice: 9670,
      bidCap: 8273000,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-03-30T09:49:32.594Z',
      currentSpotPrice: 9670,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 254,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 254,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 7999991000,
      isRemoved: false,
      lastTransactedAt: 1680169755,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 254,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-30T16:09:32.841Z',
      validation: {
        publicKey: 'BneRKf2U1r1vKW75YDxdg7Lmu5AGKeNoAeK64n1yHhjK',
        bondFeatures: 'autoCompoundAndReceiveNft',
        createdAt: '2023-03-30T09:49:32.559Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 8700,
        maxReturnAmountFilter: 32836590098,
        pair: 'FL7XbBhu5pwWrwPgYGzLPv5J2gC8K4CqBNjoZyx888Xb',
        updatedAt: '2023-03-30T09:49:32.559Z',
        user: '41RM36JUkmyYTYwX75eDekHTSh7pJeCshbFRau5YUbqZ',
      },
    },
    {
      publicKey: 'EqGF15padMmaopPBNcLg3czEv2k8UaQfBnAAkbbJbYqT',
      assetReceiver: 'BkCppbURzsJsbmYdxFRkyQ6sf8shWYK67DwWQak9GVbY',
      baseSpotPrice: 9650,
      bidCap: 51813470,
      bidSettlement: -46632123,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 1,
      concentrationIndex: 0,
      createdAt: '2023-03-31T15:20:32.326Z',
      currentSpotPrice: 9650,
      edgeSettlement: 5181347,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 253,
      fundsSolOrTokenBalance: 49999998550,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 49999998550,
      isRemoved: false,
      lastTransactedAt: 1680276006,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: 0,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-31T15:20:32.326Z',
      validation: {
        publicKey: 'G4iBgLysTriSmuVq9EV7zW9WwWTFo4yChFpcASQW5vMN',
        bondFeatures: 'autoReceiveAndReceiveNft',
        createdAt: '2023-03-31T15:20:32.353Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 8600,
        maxReturnAmountFilter: 34284706985,
        pair: 'EqGF15padMmaopPBNcLg3czEv2k8UaQfBnAAkbbJbYqT',
        updatedAt: '2023-03-31T15:20:32.353Z',
        user: 'BkCppbURzsJsbmYdxFRkyQ6sf8shWYK67DwWQak9GVbY',
      },
    },
    {
      publicKey: '4H2KMNfgMCZPTjivaY3Ak3dL41MeWx5G7ueYVHbsDZkg',
      assetReceiver: '6StcuetFJAbE7L14MwxpDvSekhK1YEoCZkG5WTieVvy',
      baseSpotPrice: 9700,
      bidCap: 8247420,
      bidSettlement: -7422678,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 1,
      concentrationIndex: 0,
      createdAt: '2023-03-31T17:42:03.168Z',
      currentSpotPrice: 9700,
      edgeSettlement: 824742,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 7999997400,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 7999997400,
      isRemoved: false,
      lastTransactedAt: 1680284498,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: 0,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-03-31T17:42:03.168Z',
      validation: {
        publicKey: 'AtxfsvmUdaH5uUMktBNoQqWE45UeRieJWReTVe3hvzDC',
        bondFeatures: 'autoCompoundAndReceiveNft',
        createdAt: '2023-03-31T17:42:03.018Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 8000,
        maxReturnAmountFilter: 32204719174,
        pair: '4H2KMNfgMCZPTjivaY3Ak3dL41MeWx5G7ueYVHbsDZkg',
        updatedAt: '2023-03-31T17:42:03.018Z',
        user: '6StcuetFJAbE7L14MwxpDvSekhK1YEoCZkG5WTieVvy',
      },
    },
    {
      publicKey: 'CFqdaiXs9qKu3hBBLbP3wYQxaP2upsRM5JeTQPB1N9NU',
      assetReceiver: 'G5Dn7xhaPeCc3jn2e9NZWxHQdsVyCnMaHL1nq6zPo9zf',
      baseSpotPrice: 9655,
      bidCap: 31071980,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-04-01T04:15:02.767Z',
      currentSpotPrice: 9655,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 251,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 29999997200,
      isRemoved: false,
      lastTransactedAt: 1680322478,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 254,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-04-01T13:43:17.566Z',
      validation: {
        publicKey: 'HHsSh1pzsR9bH7HyPqwZUkbXbt9VFVHGz2doJcmtEwAG',
        bondFeatures: 'autoReceiveAndReceiveNft',
        createdAt: '2023-04-01T04:15:02.710Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 9000,
        maxReturnAmountFilter: 38877265667,
        pair: 'CFqdaiXs9qKu3hBBLbP3wYQxaP2upsRM5JeTQPB1N9NU',
        updatedAt: '2023-04-01T04:15:02.710Z',
        user: 'G5Dn7xhaPeCc3jn2e9NZWxHQdsVyCnMaHL1nq6zPo9zf',
      },
    },
    {
      publicKey: 'SXBBcTR4eJhj9t3thVaYmuzLiZ8AFWZnXWcAKiMzFRC',
      assetReceiver: '71kG5LnbjVFp3Grj7VZ8WCqTNU6XRihoPuHRTMvmZGKb',
      baseSpotPrice: 9655,
      bidCap: 20714650,
      bidSettlement: 0,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 0,
      concentrationIndex: 0,
      createdAt: '2023-04-01T08:02:47.162Z',
      currentSpotPrice: 9655,
      edgeSettlement: 0,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 0,
      fundsSolVaultSeed: 253,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 19999994575,
      isRemoved: false,
      lastTransactedAt: 1680336146,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: -1,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-04-01T17:07:32.170Z',
      validation: {
        publicKey: '9V6RbGSZEAMuqiwjJNdUnG6tP3z5b3uvvwrJcGFwSVdp',
        bondFeatures: 'autoreceiveSol',
        createdAt: '2023-04-01T08:02:47.098Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 9000,
        maxReturnAmountFilter: 39208926153,
        pair: 'SXBBcTR4eJhj9t3thVaYmuzLiZ8AFWZnXWcAKiMzFRC',
        updatedAt: '2023-04-01T08:02:47.098Z',
        user: '71kG5LnbjVFp3Grj7VZ8WCqTNU6XRihoPuHRTMvmZGKb',
      },
    },
    {
      publicKey: 'CP14FCFweAHSYfgdYrddc3qHQtrL9E88qLsP3p9ZQM5R',
      assetReceiver: '8ptCGbccjJD7WaNLtjHZRkLkxGtPWH1if2u17z9oog8K',
      baseSpotPrice: 9930,
      bidCap: 32225570,
      bidSettlement: -29385536,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 1,
      concentrationIndex: 0,
      createdAt: '2023-04-01T08:04:02.324Z',
      currentSpotPrice: 9930,
      edgeSettlement: 2840034,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 253,
      fundsSolOrTokenBalance: 28201537620,
      fundsSolVaultSeed: 255,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 31999991010,
      isRemoved: false,
      lastTransactedAt: 1680336222,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: 0,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-04-01T14:25:17.491Z',
      validation: {
        publicKey: '2FcTQStYiuQgSZP8SyqAXwRtNSXhQGcJ6SaQDHBkmcCs',
        bondFeatures: 'autoReceiveAndReceiveNft',
        createdAt: '2023-04-01T08:04:02.419Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 6800,
        maxReturnAmountFilter: 29624521983,
        pair: 'CP14FCFweAHSYfgdYrddc3qHQtrL9E88qLsP3p9ZQM5R',
        updatedAt: '2023-04-01T08:04:02.419Z',
        user: '8ptCGbccjJD7WaNLtjHZRkLkxGtPWH1if2u17z9oog8K',
      },
    },
    {
      publicKey: 'H51orHwpqKddTL4sqQ2D5pFLD36zXGppHAgrNMbULr5U',
      assetReceiver: '6hiKjRUJ4rAqJJBwrkximSuCHhGj8NfeDJdC4ZW6a2P6',
      baseSpotPrice: 9650,
      bidCap: 31088080,
      bidSettlement: -27979272,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 1,
      concentrationIndex: 0,
      createdAt: '2023-04-01T14:26:48.188Z',
      currentSpotPrice: 9650,
      edgeSettlement: 3108808,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 255,
      fundsSolOrTokenBalance: 29999997200,
      fundsSolVaultSeed: 253,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 29999997200,
      isRemoved: false,
      lastTransactedAt: 1680359179,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: 0,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-04-01T14:26:48.188Z',
      validation: {
        publicKey: 'FDXixjHKbCsLdUbowxxq1hqmHQsRNdrNSwMZT9KXNs1J',
        bondFeatures: 'autoCompoundAndReceiveNft',
        createdAt: '2023-04-01T14:26:48.122Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 9000,
        maxReturnAmountFilter: 39269423941,
        pair: 'H51orHwpqKddTL4sqQ2D5pFLD36zXGppHAgrNMbULr5U',
        updatedAt: '2023-04-01T14:26:48.122Z',
        user: '6hiKjRUJ4rAqJJBwrkximSuCHhGj8NfeDJdC4ZW6a2P6',
      },
    },
    {
      publicKey: 'HFJQ8ZXqxNDbacfvHUdm3N7KEgaoHHYsvAcPFWTft4ar',
      assetReceiver: 'G5Dn7xhaPeCc3jn2e9NZWxHQdsVyCnMaHL1nq6zPo9zf',
      baseSpotPrice: 9655,
      bidCap: 31071980,
      bidSettlement: -28015095,
      bondingCurve: {
        delta: 0,
        bondingType: 'linear',
      },
      buyOrdersQuantity: 1,
      concentrationIndex: 0,
      createdAt: '2023-04-01T16:59:48.270Z',
      currentSpotPrice: 9655,
      edgeSettlement: 3056885,
      fee: 0,
      feeTokenAccount: '11111111111111111111111111111111',
      feeVaultSeed: 251,
      fundsSolOrTokenBalance: 29514224675,
      fundsSolVaultSeed: 252,
      fundsTokenAccount: '11111111111111111111111111111111',
      hadoMarket: 'AUnj4vmhekw3T7gzKmQgwga48wqQzRogRLDvtdgwWoSq',
      initialFundsSolOrTokenBalance: 29999996690,
      isRemoved: false,
      lastTransactedAt: 1680368354,
      lpTokensInCirculation: 0,
      lpTokensMint: '11111111111111111111111111111111',
      mathCounter: 0,
      nftsSeed: 255,
      pairAuthorityAdapterProgram: '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
      pairAuthorityType: 'classicAuthority',
      pairState: 'onMarketVirtual',
      pairType: 'tokenForNft',
      sellOrdersCount: 0,
      solOrTokenFeeAmount: 0,
      updatedAt: '2023-04-01T17:07:32.170Z',
      validation: {
        publicKey: '7jNmmDbCpfkXyvJJvueWEMaTYjsL9G2sb4JhtYh3y5mR',
        bondFeatures: 'autoReceiveAndReceiveNft',
        createdAt: '2023-04-01T16:59:48.109Z',
        durationFilter: 604800,
        isRemoved: false,
        loanToValueFilter: 9000,
        maxReturnAmountFilter: 38811789522,
        pair: 'HFJQ8ZXqxNDbacfvHUdm3N7KEgaoHHYsvAcPFWTft4ar',
        updatedAt: '2023-04-01T16:59:48.109Z',
        user: 'G5Dn7xhaPeCc3jn2e9NZWxHQdsVyCnMaHL1nq6zPo9zf',
      },
    },
  ];
  return pairs as any;
}
