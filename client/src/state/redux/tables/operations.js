/**
 *    SPDX-License-Identifier: Apache-2.0
 */
import actions from './actions';
import { get } from '../../../services/request';

/* istanbul ignore next */
// from=Mon Oct 05 2020 16:18:30 GMT+0800 (中国标准时间)&&to=Fri Oct 23 2020 16:18:30 GMT+0800 (中国标准时间)
const date = new Date();
const fromYear = date.getFullYear();
const fromMonth = date.getMonth() - 1;
const fromDay = date.getDay();
const time = 'from=' + new Date(fromYear, fromMonth, fromDay) + '&&to=' + date;
const blockList = channel => dispatch =>
	get(`/api/blockAndTxList/${channel}/0?` + time)
		.then(resp => {
			if (resp.status === 500) {
				dispatch(
					actions.getErroMessage(
						'500 Internal Server Error: The server has encountered an internal error and unable to complete your request'
					)
				);
			} else if (resp.status === 400) {
				dispatch(actions.getErroMessage(resp.error));
			} else {
				dispatch(actions.getBlockList(resp));
			}
		})
		.catch(error => {
			console.error(error);
		});
const blockListSearch = (channel, query) => dispatch =>
	get(`/api/blockAndTxList/${channel}/0?${query}`)
		.then(resp => {
			dispatch(actions.getBlockListSearch(resp));
		})
		.catch(error => {
			console.error(error);
		});
/* istanbul ignore next */
const chaincodeList = channel => dispatch =>
	get(`/api/chaincode/${channel}`)
		.then(resp => {
			if (resp.status === 500) {
				dispatch(
					actions.getErroMessage(
						'500 Internal Server Error: The server has encountered an internal error and unable to complete your request'
					)
				);
			} else if (resp.status === 400) {
				dispatch(actions.getErroMessage(resp.error));
			} else {
				dispatch(actions.getChaincodeList(resp));
			}
		})
		.catch(error => {
			console.error(error);
		});

// table channel

/* istanbul ignore next */
const channels = () => dispatch =>
	get('/api/channels/info')
		.then(resp => {
			if (resp.status === 500) {
				dispatch(
					actions.getErroMessage(
						'500 Internal Server Error: The server has encountered an internal error and unable to complete your request'
					)
				);
			} else if (resp.status === 400) {
				dispatch(actions.getErroMessage(resp.error));
			} else {
				dispatch(actions.getChannels(resp));
			}
		})
		.catch(error => {
			console.error(error);
		});

/* istanbul ignore next */
const peerList = channel => dispatch =>
	get(`/api/peersStatus/${channel}`)
		.then(resp => {
			if (resp.status === 500) {
				dispatch(
					actions.getErroMessage(
						'500 Internal Server Error: The server has encountered an internal error and unable to complete your request'
					)
				);
			} else if (resp.status === 400) {
				dispatch(actions.getErroMessage(resp.error));
			} else {
				dispatch(actions.getPeerList(resp));
			}
		})
		.catch(error => {
			console.error(error);
		});

/* istanbul ignore next */
const transaction = (channel, transactionId) => dispatch =>
	get(`/api/transaction/${channel}/${transactionId}`)
		.then(resp => {
			if (resp.status === 500) {
				dispatch(
					actions.getErroMessage(
						'500 Internal Server Error: The server has encountered an internal error and unable to complete your request'
					)
				);
			} else if (resp.status === 400) {
				dispatch(actions.getErroMessage(resp.error));
			} else {
				dispatch(actions.getTransaction(resp));
			}
		})
		.catch(error => {
			console.error(error);
		});

const transactionListSearch = (channel, query) => dispatch =>
	get(`/api/txList/${channel}/0/0?${query}`)
		.then(resp => {
			dispatch(actions.getTransactionListSearch(resp));
		})
		.catch(error => {
			console.error(error);
		});

/* istanbul ignore next */
const transactionList = channel => dispatch =>
	get(`/api/txList/${channel}/0/0?` + time)
		.then(resp => {
			if (resp.status === 500) {
				dispatch(
					actions.getErroMessage(
						'500 Internal Server Error: The server has encountered an internal error and unable to complete your request'
					)
				);
			} else if (resp.status === 400) {
				dispatch(actions.getErroMessage(resp.error));
			} else {
				dispatch(actions.getTransactionList(resp));
			}
		})
		.catch(error => {
			console.error(error);
		});
export default {
	blockList,
	chaincodeList,
	channels,
	peerList,
	transaction,
	transactionList,
	transactionListSearch,
	blockListSearch
};
