import { Buffer } from "buffer";
import {create, IPFSHTTPClient} from 'ipfs-http-client'

const auth: string = 'Basic ' + Buffer.from(process.env.INFURA_API_KEY + ':' + process.env.INFURA_API_KEY_SECRET).toString('base64');
const ipfs: IPFSHTTPClient = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth
  }
});

const uploadToIPFS = async (data: any) => {
  const result = await ipfs.add(data)
  return result.path
}

export default uploadToIPFS;