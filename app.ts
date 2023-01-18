import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Metaplex, keypairIdentity, bundlrStorage, Nft, Sft } from "@metaplex-foundation/js";
import secret from 'keypair.json';

const QUICKNODE_RPC = 'rpc'; // 👈 CHANGE THIS
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);
const WALLET = Keypair.fromSecretKey(new Uint8Array(secret)); // 👈 MAKE SURE THIS WALLET IS THE UPDATE AUTHORITY OF YOUR NFT
const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
    .use(keypairIdentity(WALLET))
    .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: QUICKNODE_RPC,
        timeout: 60000,
    }));
const MINT_ADDRESS = 'token'; // 👈 CHANGE THIS (MAKE SURE NFT IS MUTABLE)
    
/*

async function uploadMetadata(imgUri: string, imgType: string, nftName: string, description: string, attributes: {trait_type: string, value: string}[]) {
    console.log(`Step 2 - Uploading New MetaData`);
    const { uri } = await METAPLEX
        .nfts()
        .uploadMetadata({
            name: nftName,
            description: description,
            image: imgUri,
            attributes: attributes,
            properties: {
                files: [
                    {
                        type: imgType,
                        uri: imgUri,
                    },
                ]
            }
        });
    console.log('   Metadata URI:',uri);
    return uri;    
}

*/

const metadataUri = "metadata"

async function updateNft(Sft:Nft|Sft, metadataUri: string) {
    console.log(`Step 2 - Updating NFT`);
    await METAPLEX
        .nfts()
        .update({
            nftOrSft: Sft,
            uri: metadataUri
        }, { commitment: 'finalized' });
    console.log(`   Success!🎉`);
    console.log(`   Updated NFT: https://solscan.io/token/${Sft.address}?cluster=devnet`);
}


async function main() {
    console.log(`Updating Metadata of NFT: ${MINT_ADDRESS}}`);

    //Step 1 - Fetch existing NFT
    console.log(`Step 1 - Fetching existing NFT`);
    const sft = await METAPLEX.nfts().findByMint({ mintAddress: new PublicKey(MINT_ADDRESS) });
    if (!sft || !sft.json?.image) {throw new Error("Unable to find existing nft or image uri!")}
    console.log(`   NFT Found!`);

    /*Step 2 - Upload Metadata
    const newUri = await uploadMetadata(sft.json.image,NEW_METADATA.imgType,NEW_METADATA.imgName, NEW_METADATA.description, NEW_METADATA.attributes); 
    */
    //Step 3 - Update NFT
    updateNft(sft, metadataUri);
}

main();
