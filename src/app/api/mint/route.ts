import Web3 from "web3";
import contractAbi from "@/contractABI.json";
import { ClientPageRoot } from "next/dist/client/components/client-page";

export async function POST(request: Request) {
  const body = await request.json();

  const address = body.address;
  const amount = body.amount;
  const web3 = new Web3(process.env.ALL_THAT_NODE_URL);

  const contractAddress = process.env.CONTRACT_ADDRESS;

  const contract = new web3.eth.Contract(contractAbi, contractAddress);

  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY as string
  );
  console.log({ address: account.address });

  // add gas calculations

  try {
    const tx = contract.methods.transfer(
      address,
      web3.utils.toWei(amount, "ether")
    );

    console.log("tx", tx);
    // console.log("amount: ", web3.utils.toWei(amount, "ether"));

    const gas = await tx.estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(account.address);

    // const chainId = await web3.eth.getChainId();

    const txData = {
      from: account.address,
      to: contractAddress,
      data: tx.encodeABI(),
      gas,
      gasPrice,
      nonce,
    };

    // console.log("transaction data: ", txData);

    const signedTx = await web3.eth.accounts.signTransaction(
      txData,
      account.privateKey
    );
    console.log("signed tx", signedTx, signedTx.transactionHash);

    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    console.log("tx receiept", receipt);

    return Response.json({
      success: true,
      transactionHash: receipt.transactionHash,
    });
  } catch (error: any) {
    console.log(error);
    return Response.json({
      status: 500,
      error: error.message,
    });
  }
}
