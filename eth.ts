import { ethers } from 'ethers'
import { Address } from 'cluster'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import * as dotenv from 'dotenv'
dotenv.config()

const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER_ADDRESS)

const poolAddress = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8'

const poolImmutablesAbi = [
  'function factory() external view returns (address)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
  'function fee() external view returns (uint24)',
  'function tickSpacing() external view returns (int24)',
  'function maxLiquidityPerTick() external view returns (uint128)',
]

const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider)

interface Immutables {
  factory: Address
  token0: Address
  token1: Address
  fee: number
  tickSpacing: number
  maxLiquidityPerTick: number
}

async function getPoolImmutables() {
  const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
    poolContract.factory(),
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
    poolContract.tickSpacing(),
    poolContract.maxLiquidityPerTick(),
  ])

  const immutables: Immutables = {
    factory,
    token0,
    token1,
    fee,
    tickSpacing,
    maxLiquidityPerTick,
  }
  return immutables
}

getPoolImmutables().then((result) => {
  console.log(result)
})
