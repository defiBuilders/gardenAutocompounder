import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from '../../components/Modal'
import { compoundedTransactionHistoryKey } from '../../constants'
import {
    compoundGardenPlants,
    getGardenData,
    isWeb3Address,
} from '../../garden/garden.service'
import { GardenInfo } from '../../garden/types'
import { getDateStringEst } from '../../helpers/date.helpers'

import { TransactionHistoryStorage } from '../../shared/types'

type CompoundPlantsProps = {
    walletInfo: {
        walletAddress?: string
        privateKey?: string
    }
    setHasWalletAddressErr: React.Dispatch<React.SetStateAction<boolean>>

    gardenData: GardenInfo
    setGardenData: React.Dispatch<React.SetStateAction<GardenInfo | undefined>>

    enableAutocompound: boolean
    setEnableAutocompound: React.Dispatch<React.SetStateAction<boolean>>

    setSelectedPlant: React.Dispatch<React.SetStateAction<string>>
    selectedPlant: string

    setPlantCompoundSelection: React.Dispatch<
        React.SetStateAction<number | undefined>
    >
    plantCompoundSelection: number | undefined
}

function CompoundPlants(props: CompoundPlantsProps) {
    const {
        walletInfo,
        setHasWalletAddressErr,
        enableAutocompound,
        setGardenData,
        setSelectedPlant,
        setPlantCompoundSelection,
        setEnableAutocompound,
        gardenData,
        plantCompoundSelection,
        selectedPlant,
    } = props

    const [compoundHash, setCompoundHash] = useState<string | undefined>(
        undefined
    )

    const [isOpen, setIsOpen] = useState(false)

    const [isCompounding, setIsCompounding] = useState<boolean>(false)

    // TODO: Move to custom hook.
    // On mount, starts the timer to fetch garden data ever 5 seconds.

    useEffect(() => {
        const timer = setInterval(() => {
            if (!walletInfo?.walletAddress) {
                return
            }
            if (!isWeb3Address(walletInfo.walletAddress)) {
                setHasWalletAddressErr(true)
                return
            }

            if (!enableAutocompound) {
                return
            }

            // If user is compounding, don't need to fetch garden data.
            if (!isCompounding) {
                getGardenData(walletInfo.walletAddress)
                    .then((resp: any) => {
                        setGardenData(resp)
                    })
                    .catch((err: any) => {
                        toast.error(err)
                    })
            } else {
                setIsCompounding(false)
            }
        }, 5000)

        return () => clearInterval(timer)
    }, [enableAutocompound, isCompounding])

    useEffect(() => {
        const compoundPlants = async () => {
            try {
                if (!plantCompoundSelection || !gardenData || !selectedPlant) {
                    return
                }

                if (!walletInfo?.walletAddress || !walletInfo.privateKey) {
                    return
                }

                if (isCompounding) {
                    return
                }

                if (plantCompoundSelection <= gardenData.plants_ready) {
                    toast.info('Compounding...')
                    setIsCompounding(true)

                    const compoundTxnHash = await compoundGardenPlants(
                        walletInfo.walletAddress,
                        walletInfo.privateKey
                    )

                    if (!compoundTxnHash) {
                        throw new Error(
                            'No transaction hash for compound transaction created.'
                        )
                    }
                    toast.success('Compound was successful.')

                    setPlantCompoundSelection(parseInt(selectedPlant, 10))

                    setCompoundHash(compoundTxnHash)

                    setIsOpen(true)

                    const txnHistory: string | null = localStorage.getItem(
                        compoundedTransactionHistoryKey
                    )

                    if (txnHistory) {
                        const storedTxns: TransactionHistoryStorage =
                            JSON.parse(txnHistory)

                        const newTxnItem = {
                            txnHash: compoundTxnHash,
                            date: getDateStringEst(new Date()),
                        }

                        localStorage.setItem(
                            compoundedTransactionHistoryKey,
                            JSON.stringify({
                                walletAddress: walletInfo.walletAddress,
                                transactions: [
                                    ...storedTxns.transactions,
                                    newTxnItem,
                                ],
                            } as TransactionHistoryStorage)
                        )
                        return
                    }

                    //When there is no txn history in local storage.

                    localStorage.setItem(
                        compoundedTransactionHistoryKey,
                        JSON.stringify({
                            walletAddress: walletInfo.walletAddress,
                            transactions: [
                                {
                                    txnHash: compoundTxnHash,
                                    date: getDateStringEst(new Date()),
                                },
                            ],
                        } as TransactionHistoryStorage)
                    )
                }
            } catch (error) {
                console.error('Compound error: ', error)
                toast.error(
                    'Compound failed. Try refreshing page or contacting Defi Builders',
                    {
                        autoClose: false,
                    }
                )
                setSelectedPlant('')
                setPlantCompoundSelection(undefined)
                setEnableAutocompound(false)
            }
        }

        compoundPlants()
    }, [gardenData])
    return (
        <div className="">
            <div className="flex items-center bg-white rounded-2xl p-4">
                <div className="font-bold text-green">
                    Autocompounder has started. Sit tight while we plant for
                    you!
                </div>
            </div>

            {/* MODAL */}

            {compoundHash && (
                <Modal
                    isOpen={isOpen}
                    title={'Compound Successful'}
                    callBack={() => {
                        setCompoundHash(undefined)
                        setIsOpen(false)
                    }}
                >
                    <div>
                        <a
                            target={'_blank'}
                            href={`https://bscscan.com/tx/${compoundHash}`}
                            rel="noreferrer"
                            className="hover:pointer hover:text-blue-500"
                        >
                            {`Transaction Hash: ${compoundHash}`}
                        </a>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default CompoundPlants
