import {decodeAccountID} from 'ripple-address-codec'

// Utility function to get token id from transaction
const getTokenID = (transaction: any) => {
    console.log(transaction)
    const { meta } = transaction;
    let { Account, Issuer, NFTokenTaxon, TransferFee, Flags } = transaction;

    // Fetch minted token sequence
    let TokenSequence;
    let NextTokenSequence;

    meta.AffectedNodes.forEach((node: any) => {
        if (node.ModifiedNode && node.ModifiedNode.LedgerEntryType === "AccountRoot"){
            const { PreviousFields, FinalFields } = node.ModifiedNode;
            if (PreviousFields && FinalFields && FinalFields.Account === (Issuer || Account)) {
                TokenSequence = PreviousFields.MintedNFTokens;
                NextTokenSequence = FinalFields.MintedNFTokens;
            }
        }
    });

    // First minted token, set token sequence to zero
    if (typeof TokenSequence === "undefined" && NextTokenSequence === 1) {
        TokenSequence = 0;
    }

    // Unable to find TokenSequence
    if (typeof TokenSequence === "undefined") {
        throw new Error("Unable to find Token Sequnce");
    }

    Issuer = decodeAccountID(Issuer || Account);
    const CipheredTaxon = NFTokenTaxon ^ (384160001 * TokenSequence + 2459);

    const TokenID = Buffer.concat([
        Buffer.from([(Flags >> 8) & 0xff, Flags & 0xff]),
        Buffer.from([(TransferFee >> 8) & 0xff, TransferFee & 0xff]),
        Issuer,
        Buffer.from([
            (CipheredTaxon >> 24) & 0xff,
            (CipheredTaxon >> 16) & 0xff,
            (CipheredTaxon >> 8) & 0xff,
            CipheredTaxon & 0xff,
        ]),
        Buffer.from([
            (TokenSequence >> 24) & 0xff,
            (TokenSequence >> 16) & 0xff,
            (TokenSequence >> 8) & 0xff,
            TokenSequence & 0xff,
        ]),
    ]);

    // should be 32 bytes
    if (TokenID.length !== 32) {
        throw new Error("Invalid token id lenght");
    }

    return TokenID.toString('hex').toUpperCase();
};


export default getTokenID