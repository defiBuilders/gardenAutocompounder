export interface GardenInfo {
    user: {
        wallet: string
        plants: number
        seeds: number
    }
    seeds_per_plant: number
    plants_ready: number
}