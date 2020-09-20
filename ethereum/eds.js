import web3 from './web3';
import endorsementJson from './build/contracts/Endorsement.json';

// const addressWithPrefix = endorsementJson.networks[Object.keys(endorsementJson.networks)[0]].address;
const instance = new web3.eth.Contract(
	endorsementJson.abi,
	"88139eB06b7EDDCFcEfe3CcA3B713299034bC28f"
);

export default instance;
