const {create} = require('ipfs-http-client')
const {Buffer} = require('buffer');

const auth = 'Basic ' + Buffer.from(process.env.INFURA_API_KEY + ':' + process.env.INFURA_API_KEY_SECRET).toString('base64');
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth
  }
});

const uploadToIPFS = async (data) => {
  const buff = Buffer.from(data)
  const result = await ipfs.add(buff)
  return result.path
}

module.exports = uploadToIPFS;