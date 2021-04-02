import * as CryptoJS from 'crypto-js';

class Block {
  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  static caculateBlockHash = (
      index: number,
      previousHash: string,
      timestamp: number,
      data: string
  ): string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  static validateStructure = (aBlock: Block): boolean => 
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.data === "string" &&
    typeof aBlock.timestamp === "number";

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ) {
      this.index = index;
      this.hash = hash;
      this.previousHash = previousHash;
      this.data = data;
      this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(0, "202802380283", "", "Hello", 123456);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = (): Block[] => blockchain;
const getLatestBlock = (): Block => blockchain[blockchain.length - 1];
const getNewTimestamp = (): number => new Date().getTime();

const createNewBlock = (data: string): Block => {
    const latestBlock = getLatestBlock();
    const newIndex = latestBlock.index + 1;
    const newTimestamp = getNewTimestamp();
    const newHash = Block.caculateBlockHash(newIndex, latestBlock.hash, newTimestamp, data)

    const newBlock: Block = new Block(
        newIndex,
        newHash,
        latestBlock.hash,
        data,
        newTimestamp
    );
    
    addBlock(newBlock);
    
    return newBlock;
}

const getHashForBlock = (aBlock: Block) => Block.caculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data);

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
    if(!Block.validateStructure(candidateBlock)) {
        return false
    }else if(previousBlock.index + 1 !== candidateBlock.index) {
        return false
    }else if(previousBlock.hash !== candidateBlock.previousHash) {
        return false
    }else if(getHashForBlock(candidateBlock) !== candidateBlock.hash) {
        return false
    }else {
        return true;
    }
}

const addBlock = (candidateBlock: Block) => {
    if(isBlockValid(candidateBlock, getLatestBlock())) {
        blockchain.push(candidateBlock);
    }
}

createNewBlock("first");
createNewBlock("second");
createNewBlock("third");

console.log(blockchain)

export {};
