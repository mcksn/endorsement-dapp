import web3 from './web3';
import Endorsement from './build/contracts/Endorsement.json';

//many different addresses as user visits different addresses
export default (address) => {
	return new web3.eth.Contract(
		Endorsement.abi ,address);
};
