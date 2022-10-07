import Web3 from 'web3'
import gardenAbi from './gardenAbi'
import { GardenInfo } from './types'

export default class GardenRepo {
    private httpUrl: string

    private web3: Web3

    private gardenContract: any

    gardenInfo: GardenInfo

    private walletAddress: GardenInfo['user']['wallet']

    private gardenMethods: any

    private seedsPerPlant: number

    constructor(walletAddy: string) {
        this.httpUrl = 'https://bsc-dataseed.binance.org/'

        this.web3 = new Web3(new Web3.providers.HttpProvider(this.httpUrl))

        this.gardenContract = new this.web3.eth.Contract(
            gardenAbi as any,
            '0x685BFDd3C2937744c13d7De0821c83191E3027FF'
        )

        this.walletAddress = walletAddy
        this.seedsPerPlant = 2592000
        this.gardenInfo = {
            user: {
                wallet: this.walletAddress,
                plants: 0,
                seeds: 0,
            },
            plants_ready: 0,
            seeds_per_plant: this.seedsPerPlant,
        }
    }

    async getTransactionReceipt(txnHash: string) {
        try {
            const txnReceipt = await this.web3.eth.getTransactionReceipt(
                txnHash
            )

            if (!txnReceipt.status || !txnReceipt) {
                this.getTransactionReceipt(txnHash)
            }

            return txnReceipt
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async compoundPlants(privateKey: string): Promise<string> {
        const nonce = await this.web3.eth.getTransactionCount(
            this.walletAddress
        )

        let refAddress = '0x000000000000000000000000000000000000dEaD'
        refAddress = this.web3.utils.toChecksumAddress(refAddress)

        let bundledMethod = await this.gardenContract.methods.plantSeeds(
            refAddress
        )

        bundledMethod = bundledMethod.encodeABI()

        const txnToCompoundSeeds = {
            nonce: nonce,
            from: this.walletAddress,
            data: bundledMethod,
            to: '0x685BFDd3C2937744c13d7De0821c83191E3027FF',
            gasLimit: this.web3.utils.toHex(350000),
            gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('5', 'gwei')),
        }

        console.log(nonce)

        const signedTxn = await this.web3.eth.accounts.signTransaction(
            txnToCompoundSeeds,
            privateKey as string
        )

        if (!signedTxn.rawTransaction) {
            throw new Error('Missing raw transaction from signed transaction')
        }

        try {
            const txnHash = await this.web3.eth.sendSignedTransaction(
                signedTxn.rawTransaction
            )

            return txnHash.transactionHash
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async calculateUserStats() {
        this.gardenMethods = await this.gardenContract.methods

        await this.getSeeds()
        await this.seedsFor1Plant()
        await this.calculatePlantsReady()
    }

    private async getSeeds() {
        const seeds = await this.gardenMethods
            .getUserSeeds(this.walletAddress)
            .call()
        this.gardenInfo.user.seeds = seeds
    }

    private async seedsFor1Plant() {
        const numSeeds = await this.gardenMethods.SEEDS_TO_GROW_1PLANT().call()
        this.gardenInfo.seeds_per_plant = numSeeds
    }

    async calculatePlantsReady() {
        this.gardenInfo.plants_ready = Math.floor(
            this.gardenInfo.user.seeds / this.gardenInfo.seeds_per_plant
        )
    }
}
