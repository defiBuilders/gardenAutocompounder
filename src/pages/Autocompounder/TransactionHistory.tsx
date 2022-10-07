import { useMemo } from 'react'
import { compoundedTransactionHistoryKey } from '../../constants'
import { GardenInfo } from '../../garden/types'
import { TransactionHistoryStorage } from '../../shared/types'

type TransactionHistoryProps = {
    gardenData: GardenInfo
    walletAddress: string
}
const TransactionHistory = (props: TransactionHistoryProps) => {
    const { gardenData, walletAddress } = props

    const transactionHistory: TransactionHistoryStorage | undefined =
        useMemo(() => {
            const txns = localStorage.getItem(compoundedTransactionHistoryKey)

            if (!txns) {
                return
            }

            const parsedTxns = JSON.parse(txns) as TransactionHistoryStorage

            if (walletAddress !== parsedTxns.walletAddress) {
                return
            }

            return parsedTxns
        }, [gardenData, walletAddress])
    return (
        <>
            {/* Transaction History */}
            {transactionHistory && transactionHistory.transactions.length > 0 && (
                <div className="shadow-2xl rounded-2xl my-7 h-60 overflow-y-auto bg-darkPrimary">
                    <div className="rounded-lg h-full p-4 space-y-6 text-center">
                        <div className="flex justify-center font-bold text-blue">
                            Transaction History
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mt-1 ml-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </div>
                        <ul className="break-words space-y-2 text-white">
                            {transactionHistory.transactions.map(
                                ({ txnHash, date }) => {
                                    return (
                                        <li
                                            key={txnHash}
                                            className="bg-green p-4 rounded-2xl"
                                        >
                                            <a
                                                target={'_blank'}
                                                href={`https://bscscan.com/tx/${txnHash}`}
                                                rel="noreferrer"
                                                className="hover:pointer hover:text-blue-500"
                                            >
                                                <span className="text-darkPrimary font-bold pr-1">
                                                    Hash:
                                                </span>
                                                {txnHash}
                                                <div>
                                                    <span className="text-darkPrimary font-bold pr-1 ">
                                                        Date:
                                                    </span>
                                                    {date}
                                                </div>
                                            </a>
                                        </li>
                                    )
                                }
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </>
    )
}

export default TransactionHistory
