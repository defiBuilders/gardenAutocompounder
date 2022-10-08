import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
    getGardenData,
    isWeb3Address,
    isWeb3HexString,
} from '../../garden/garden.service'
import { GardenInfo } from '../../garden/types'
import CompoundPlants from './CompoundPlants'
import TransactionHistory from './TransactionHistory'

type WalletInfo = {
    walletAddress?: string | undefined
    privateKey?: string | undefined
}

function Autocompounder() {
    const [gardenData, setGardenData] = useState<GardenInfo | undefined>()

    const [walletInfo, setWalletInfo] = useState<WalletInfo>()
    const [selectedPlant, setSelectedPlant] = useState<string>('')
    const [plantCompoundSelection, setPlantCompoundSelection] = useState<
        number | undefined
    >()

    const [enableAutocompound, setEnableAutocompound] = useState<boolean>(false)
    const [hasWalletAddressErr, setHasWalletAddressErr] =
        useState<boolean>(false)
    const [hasWalletPrivateKeyErr, setHasWalletPrivateKeyErr] =
        useState<boolean>(false)

    useEffect(() => {
        const timer = setInterval(() => {
            // If compounding is enabled, disable this timer.
            if (enableAutocompound) {
                clearInterval(timer)
                return
            }

            if (!walletInfo?.walletAddress) {
                return
            }
            if (!isWeb3Address(walletInfo.walletAddress)) {
                setHasWalletAddressErr(true)
                return
            }

            getGardenData(walletInfo.walletAddress)
                .then((resp: any) => {
                    setGardenData(resp)
                })
                .catch((err: any) => {
                    toast.error(err)
                })
        }, 3000)

        return () => clearInterval(timer)
    }, [enableAutocompound, walletInfo])

    const onStartAutocompound = (): void => {
        if (!walletInfo?.walletAddress || !walletInfo?.privateKey) return

        if (!isWeb3Address(walletInfo.walletAddress)) {
            toast.error('Invalid wallet address.')
            return
        }

        if (!isWeb3HexString(walletInfo.privateKey)) {
            toast.error('Invalid private key.')
            return
        }

        if (selectedPlant.includes('.')) {
            toast.error('Cannot contain decimals.')
            return
        }

        //
        if (gardenData?.plants_ready && plantCompoundSelection) {
            if (Number(gardenData.plants_ready) >= plantCompoundSelection) {
                toast.error('Please select new compound rate.')
                return
            }
        }

        if (typeof selectedPlant === 'string') {
            const maxCompountLimit = 1000
            const isSelectedPlantTooLow =
                Number(selectedPlant) < maxCompountLimit

            if (isSelectedPlantTooLow) {
                toast.error('Must choose compound rate greater than 1000.', {
                    autoClose: 10000,
                })
                setSelectedPlant('')
                return
            }
        }

        // Enable auto compound which will cause side effect to start interval.
        setEnableAutocompound(true)
    }

    const onStopAutocompound = (): void => {
        // Reset values
        setSelectedPlant('')
        setPlantCompoundSelection(undefined)
        // Disable auto compound which will cause side effect to stop the interval.
        setEnableAutocompound(false)
    }

    // Effect handling plant compound selection
    useEffect(() => {
        if (!gardenData) {
            return
        }

        if (!selectedPlant) {
            setPlantCompoundSelection(undefined)
            return
        }

        const userSelectedPlant = parseInt(selectedPlant, 10)

        if (userSelectedPlant <= 0 || isNaN(userSelectedPlant)) {
            setPlantCompoundSelection(undefined)
            return
        }

        // Set the plants amount at which the compound will happen.
        setPlantCompoundSelection(gardenData.plants_ready + userSelectedPlant)

        // Only runs when we change the selected plants.
    }, [selectedPlant])

    function handleWalletAddress(e: any): void {
        setHasWalletAddressErr(false)

        if (!isWeb3Address(e.target.value)) {
            setHasWalletAddressErr(true)
        }

        setWalletInfo({
            ...walletInfo,
            walletAddress: e.target.value,
        })
    }

    function handleWalletPrivateKey(e: any) {
        setHasWalletPrivateKeyErr(false)

        if (!isWeb3HexString(e.target.value)) {
            setHasWalletPrivateKeyErr(true)
        }

        setWalletInfo({
            ...walletInfo,
            privateKey: e.target.value,
        })
    }

    useEffect(() => {
        if (walletInfo?.walletAddress === '') {
            setHasWalletAddressErr(false)
        }

        if (walletInfo?.privateKey === '') {
            setHasWalletPrivateKeyErr(false)
        }
    }, [handleWalletAddress, handleWalletPrivateKey])

    return (
        <div className="flex flex-col w-4/5 mx-auto max-w-5xl text-lg">
            {/* Wallet & Private Key Input */}
            <div className="space-y-4 w-full flex flex-col justify-center bg-darkPrimary p-4 rounded-2xl">
                <div className="font-bold text-blue">Wallet Information</div>
                <div className="w-full">
                    <input
                        type="text"
                        placeholder="Enter Wallet Address"
                        className={`rounded-lg p-3 w-full border-2 border-gray-200 disabled:bg-darkGray disabled:text-white placeholder:text-gray-700  ${
                            hasWalletAddressErr
                                ? 'outline-red-500'
                                : 'outline-blue-500'
                        }`}
                        required
                        disabled={enableAutocompound}
                        value={walletInfo?.walletAddress || ''}
                        onChange={handleWalletAddress}
                    />
                    {hasWalletAddressErr && (
                        <div className="text-red-500 pt-2">
                            Invalid wallet address.
                        </div>
                    )}
                </div>

                <div className="w-full">
                    <input
                        type="password"
                        placeholder="Enter Private Key"
                        className={`rounded-lg p-3 w-full border-2 border-gray-200 disabled:bg-darkGray  placeholder:text-gray-700  ${
                            hasWalletPrivateKeyErr
                                ? 'outline-pink-900'
                                : 'outline-blue-500'
                        }`}
                        required
                        disabled={enableAutocompound}
                        value={walletInfo?.privateKey || ''}
                        onChange={handleWalletPrivateKey}
                    />
                    {hasWalletPrivateKeyErr && (
                        <div className="text-red-500 pt-2">
                            Invalid private key.
                        </div>
                    )}
                </div>
            </div>

            {gardenData && (
                <div>
                    <div className="w-full space-y-6 mt-6 bg-darkPrimary p-4 rounded-2xl">
                        <div className="font-bold text-blue">
                            Plant Compound Information
                        </div>
                        <div className="">
                            <span className="text-white">
                                Current plants ready:
                            </span>
                            {gardenData && (
                                <span className="text-white font-bold text-2xl ml-2">
                                    {gardenData.plants_ready}
                                </span>
                            )}
                        </div>
                        <form>
                            <label className="text-white">
                                Enter Compound Rate :
                            </label>
                            <input
                                type="number"
                                value={selectedPlant}
                                min={1}
                                onChange={(e) => {
                                    setSelectedPlant(e.target.value)
                                }}
                                placeholder="Compound rate"
                                className="ml-2 rounded-lg p-3 w-3/5 border-2 border-gray-200 outline-blue-500 disabled:bg-darkGray disabled:text-white placeholder:text-gray-700 "
                                disabled={
                                    enableAutocompound || hasWalletPrivateKeyErr
                                }
                            ></input>
                        </form>
                        <div>
                            <span className="text-white">
                                Planned to compound at plant:
                            </span>
                            {plantCompoundSelection && (
                                <span className="text-white font-bold text-2xl ml-2">
                                    {plantCompoundSelection}
                                </span>
                            )}
                        </div>

                        {walletInfo?.walletAddress &&
                            walletInfo?.privateKey &&
                            gardenData &&
                            enableAutocompound && (
                                <CompoundPlants
                                    walletInfo={walletInfo}
                                    setHasWalletAddressErr={
                                        setHasWalletAddressErr
                                    }
                                    enableAutocompound={enableAutocompound}
                                    setGardenData={setGardenData}
                                    setSelectedPlant={setSelectedPlant}
                                    setPlantCompoundSelection={
                                        setPlantCompoundSelection
                                    }
                                    setEnableAutocompound={
                                        setEnableAutocompound
                                    }
                                    gardenData={gardenData}
                                    plantCompoundSelection={
                                        plantCompoundSelection
                                    }
                                    selectedPlant={selectedPlant}
                                />
                            )}
                    </div>

                    <div className="flex flex-col space-y-4 pt-6">
                        <button
                            className="transition ease-out duration-500 hover:scale-105 px-5 py-3  rounded-md bg-green hover:cursor-pointer disabled:bg-gray-500 disabled:hover:cursor-not-allowed text-white"
                            disabled={
                                hasWalletAddressErr ||
                                hasWalletPrivateKeyErr ||
                                !plantCompoundSelection ||
                                !walletInfo?.privateKey ||
                                !walletInfo?.walletAddress ||
                                enableAutocompound ||
                                !selectedPlant
                            }
                            onClick={onStartAutocompound}
                        >
                            Start Autocompound
                        </button>

                        <button
                            className="transition ease-out duration-500 hover:scale-105 px-5 py-3 rounded-md bg-red-500 disabled:bg-gray-500 disabled:hover:cursor-not-allowed text-white"
                            disabled={!enableAutocompound}
                            onClick={onStopAutocompound}
                        >
                            Stop Autocompound
                        </button>
                    </div>

                    {walletInfo?.walletAddress && (
                        <TransactionHistory
                            gardenData={gardenData}
                            walletAddress={walletInfo.walletAddress}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default Autocompounder
