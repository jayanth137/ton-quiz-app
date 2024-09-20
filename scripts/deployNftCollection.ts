import { beginCell, toNano } from 'ton-core';
import { NftCollection } from '../wrappers/NftCollection';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const metadata_link =
        'https://teal-late-haddock-980.mypinata.cloud/ipfs/QmUYRfi6nMpBA4jcoa2JH5HYsuF8Hsnnt9LgxqKsb9hyha/';

    let content = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(metadata_link).endCell();

    let owner = provider.sender().address!;

    const nftCollection = provider.open(
        await NftCollection.fromInit(owner, content, {
            $$type: 'RoyaltyParams',
            numerator: 10n, // 350n = 35%
            denominator: 1000n,
            destination: owner,
        })
    );

    await nftCollection.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(nftCollection.address);

    // run methods on `nftCollection`
}

// import { getHttpEndpoint } from '@orbs-network/ton-access';
// import { CHAIN } from '@tonconnect/ui-react';
// import { Cell, Address, fromNano, toNano } from 'ton-core';
// import { useAsyncInitialize } from './useAsyncInitialize';
// import { useTonConnect } from './useTonConnect';
// import { Mint, NftCollection } from '../wrappers/NftCollection';
// import { useEffect, useState } from 'react';
// import { useTonClient } from './useTonClient';

// const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

// export default function useNftCollection() {
//     const client = useTonClient();
//     const [contractData, setContractData] = useState<null | {
//         collection_content: Cell;
//         next_item_index: number;
//         owner: Address;
//     }>();

//     const [balance, setBalance] = useState<number | null>(0);

//     const nftCollection = useAsyncInitialize(async () => {
//         if (!client) return;

//         const contract = NftCollection.fromAddress(Address.parse('EQDfkb9aldpAIkc37peVwDGCquby5dVhilZ70LUZElo4druo'));
//         return await client.open(contract);
//     }, [client]);

//     useEffect(() => {
//         async function getNft() {
//             if (!nftCollection) return;
//             setContractData(null);
//             const data = (await nftCollection.getGetCollectionData()).data; // Update this as per your wrapper's method
//             const balance = await nftCollection.getBalance();
//             setContractData({
//                 collection_content: data.collection_content,
//                 next_item_index: Number(data.next_item_index), // Convert bigint to number
//                 owner: data.owner_address, // Ensure this is the correct property
//             });
//             setBalance(balance);
//             await sleep(5000);
//             getNft();
//         }
//         getNft();
//     }, [nftCollection]);

//     return {
//         nftCollectionAddress: nftCollection?.address.toString(),
//         contractData,
//         balance,
//         mint: async () => {
//             const message: Mint = {
//                 $$type: 'Mint',
//                 query_id: 0n,
//             };

//             await nftCollection?.send(
//                 {
//                     value: toNano('0.2'),
//                 },
//                 message
//             ); // Ensure this method matches the expected arguments
//         },
//     };
// }
