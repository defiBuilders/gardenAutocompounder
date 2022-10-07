export type TransactionHistoryStorage = {
    walletAddress: string
    transactions: {
        txnHash: string
        date: string
    }[]
}
