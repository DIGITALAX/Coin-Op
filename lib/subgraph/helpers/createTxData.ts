import { ethers } from "ethers";
import { PKP_ADDRESS } from "../../constants";

export const createTxData = async (
  provider: ethers.providers.JsonRpcProvider,
  abi: any,
  contractAddress: string,
  functionName: string,
  args: any[]
) => {
  try {
    const contractInterface = new ethers.utils.Interface(abi);

    const latestBlock = await provider.getBlock("latest");
    const baseFeePerGas = latestBlock.baseFeePerGas;
    const maxFeePerGas = baseFeePerGas?.add(
      ethers.utils.parseUnits("10", "gwei")
    );
    const maxPriorityFeePerGas = ethers.utils.parseUnits("3", "gwei");
    return {
      to: contractAddress,
      nonce: (await provider.getTransactionCount(PKP_ADDRESS)) || 0,
      chainId: 137,
      gasLimit: ethers.BigNumber.from("8000000"),
      maxFeePerGas: maxFeePerGas,
      maxPriorityFeePerGas: maxPriorityFeePerGas,
      from: "{{publicKey}}",
      data: contractInterface.encodeFunctionData(functionName, args),
      value: ethers.BigNumber.from(0),
      type: 2,
    };
  } catch (err: any) {
    console.error(err.message);
  }
};
