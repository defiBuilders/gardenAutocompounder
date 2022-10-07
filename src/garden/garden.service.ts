import Web3 from 'web3'
import GardenRepo from './Garden.repository'
import { GardenInfo } from './types'

export const getGardenData = async (
    userWalletAddress: string
): Promise<GardenInfo> => {
    try {
        const gardenService = new GardenRepo(userWalletAddress)

        await gardenService.calculateUserStats()

        return gardenService.gardenInfo
    } catch (error) {
        console.error('Something went wrong retrieving garden data.')
        throw error
    }
}

export const compoundGardenPlants = async (
    userWalletAddress: string,
    privateKey: string
): Promise<string> => {
    try {
        const gardenService = new GardenRepo(userWalletAddress)

        const compoundTxnHash = await gardenService.compoundPlants(privateKey)

        return compoundTxnHash
    } catch (error) {
        console.error('Something went wrong compounding garden.')
        throw error
    }
}

export function isWeb3Address(walletAddress: string) {
    if (Web3.utils.isAddress(walletAddress)) {
        return true
    }
    return false
}

export function isWeb3HexString(hex: string) {
    if (Web3.utils.isHex(hex)) {
        return true
    }
    return false
}
