/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import find from 'lodash/find';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import 'element-theme-default';
import ChartStats from '../Charts/ChartStats';
import BlockView from '../View/BlockView';
import TransactionView from '../View/TransactionView';
import { searchType } from '../../const'

// import { Row, Col } from 'reactstrap';
// import FontAwesome from 'react-fontawesome';
// import Card from '@material-ui/core/Card';
// import Avatar from '@material-ui/core/Avatar';
// import PeersHealth from '../Lists/PeersHealth';
// import TimelineStream from '../Lists/TimelineStream';
// import OrgPieChart from '../Charts/OrgPieChart';
import {
	blockListType,
	dashStatsType,
	peerStatusType,
	transactionByOrgType,
	transactionType
} from '../types';

import '../../static/css/dashboard.css';
import { Table } from 'element-react';
import 'element-theme-default';

/* istanbul ignore next */
const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
		background: {
			backgroundColor: dark ? '#062348' : '#f0f5f9'
		},
		view: {
			paddingTop: 85,
			paddingLeft: 0,
			width: '80%',
			marginLeft: '10%',
			marginRight: '10%'
		},
		blocks: {
			height: 175,
			marginBottom: 20,
			marginTop: 10,
			backgroundColor: dark ? '#062348' : '#ffffff',
			boxShadow: dark ? '1px 2px 2px rgb(215, 247, 247)' : undefined
		},
		count: {
			marginTop: '55%',
			color: dark ? '#ffffff' : undefined
		},
		statistic: {
			display: 'block',
			float: 'left',
			height: '100%',
			width: '25%',
			textAlign: 'center',
			fontSize: '18pt',
			color: dark ? '#ffffff' : '#000000'
		},
		vdivide: {
			'&::after': {
				borderRight: `2px ${dark ? 'rgb(40, 36, 61)' : '#dff1fe'} solid`,
				display: 'block',
				height: '45%',
				bottom: '55%',
				content: "' '",
				position: 'relative'
			}
		},
		avatar: {
			justifyContent: 'center',
			marginLeft: '60%',
			marginTop: '65%'
		},
		iconBackground: {
			width: '40px',
			height: '40px',
			display: 'inline-block',
			verticalAlign: 'middle',
			textAlign: 'center',
			borderRadius: '50%'
		},
		node: {
			// color: dark ? '#183a37' : '#21295c',
			backgroundColor: dark ? 'rgb(104, 247, 235)' : '#858aa6'
		},
		block: {
			// color: dark ? '#1f1a33' : '#004d6b',
			backgroundColor: dark ? 'rgb(106, 156, 248)' : '#b9d6e1'
		},
		chaincode: {
			// color: dark ? 'rgb(121, 83, 109)' : '#407b20',
			backgroundColor: dark ? 'rgb(247, 205, 234)' : '#d0ecda'
		},
		transaction: {
			// color: dark ? 'rgb(216, 142, 4)' : '#ffa686',
			backgroundColor: dark ? 'rgb(252, 224, 174)' : '#ffeed8'
		},
		section: {
			marginBottom: '2%',
			color: dark ? '#ffffff' : undefined,
			backgroundColor: dark ? '#062348' : undefined
		},
		center: {
			textAlign: 'center'
		}
	};
};

export class DashboardView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			notifications: [],
			hasDbError: false,
			blockColumns: [
				{
					label: '区块高度',
					prop: 'blocknum',
					width: 100
				},
				{
					label: '通道名称',
					prop: 'channelname',
					width: 120
				},
				{
					label: '交易数',
					prop: 'txcount',
					width: 90
				},
				{
					label: '数据Hash',
					prop: 'datahash'
				},
				{
					label: '区块Hash',
					className: 'id-color',
					render: (row, column, index) => {
						return (
							<span onClick={() => this.handleDialogOpenBlockHash(row.blockhash)}>
								{row.blockhash}
							</span>
						);
					}
				},
				{
					label: '大小',
					prop: 'blksize',
					width: 120
				}
			],
			blocksData: [],
			transactionColumns: [
				{
					label: '发起方',
					prop: 'creator_msp_id',
					width: 130
				},
				{
					label: '通道名称',
					prop: 'channelname',
					width: 130
				},
				{
					label: '交易 Hash',
					className: 'id-color',
					render: (row, column, index) => {
						return (
							<span onClick={() => this.handleDialogOpen(row.txhash)}>
								{row.txhash}
							</span>
						);
					}
				},
				{
					label: '智能合约',
					prop: 'chaincodename',
					width: 130
				},
				{
					label: '创建时间',
					prop: 'createdt',
					width: 210
				}
			],
			transactionData: [],
			currentChannel: '',
			dialogOpen: false,
			dialogOpenBlockHash: false,
			currentType: '交易',
			chooseIcon: require('../../static/images/down.png'),
			closeIcon: require('../../static/images/close.png'),
			flag: false,
			searchType: 'transaction',
			message: '错误提示',
			showMessage: false
		};
	}

	componentWillMount() {
		const {
			blockList,
			dashStats,
			peerStatus,
			transactionList,
			transactionByOrg,
			blockActivity,
			currentChannel
		} = this.props;
		if (
			blockList === undefined ||
			dashStats === undefined ||
			peerStatus === undefined ||
			blockActivity === undefined ||
			transactionByOrg === undefined ||
			transactionList === undefined ||
			currentChannel === undefined
		) {
			this.setState({ hasDbError: true });
		}
		const blocksData = [];
		blockList.forEach((val, ind) => {
			if (ind < 5) {
				const blocksDataItem = {};
				blocksDataItem.blocknum = val.blocknum;
				blocksDataItem.channelname = val.channelname;
				blocksDataItem.txcount = val.txcount;
				blocksDataItem.datahash = val.datahash;
				blocksDataItem.blockhash = val.blockhash;
				blocksDataItem.blksize = val.blksize;
				blocksData.push(blocksDataItem);
			}
		});
		const txData = [];
		transactionList.forEach((val, ind) => {
			if (ind < 5) {
				const txItem = {};
				txItem.creator_msp_id = val.creator_msp_id;
				txItem.channelname = val.channelname;
				txItem.txhash = val.txhash;
				txItem.chaincodename = val.chaincodename;
				txItem.createdt = val.createdt;
				txData.push(txItem);
			}
		});
		this.setState({
			blocksData: blocksData,
			transactionData: txData,
			currentChannel: currentChannel
		});
	}

	componentDidMount() {
		const { blockActivity } = this.props;
		this.setNotifications(blockActivity);
	}

	componentWillReceiveProps() {
		const { blockActivity } = this.props;
		this.setNotifications(blockActivity);
	}

	setNotifications = blockList => {
		const notificationsArr = [];
		if (blockList !== undefined) {
			for (let i = 0; i < 3 && blockList && blockList[i]; i += 1) {
				const block = blockList[i];
				const notify = {
					title: `Block ${block.blocknum} `,
					type: 'block',
					time: block.createdt,
					txcount: block.txcount,
					datahash: block.datahash,
					blockhash: block.blockhash,
					channelName: block.channelname
				};
				notificationsArr.push(notify);
			}
		}
		this.setState({ notifications: notificationsArr });
	};

	handleClear = () => {
		this.input.value = ''
	}

	handleSearch = async () => {
		const id = this.input.value;
		if (this.state.searchType === 'block') {
			this.handleDialogOpenBlockHash(id)
		} else if (this.state.searchType === 'transaction') {
			if (id) {
				const currentChannel = this.state.currentChannel
				const { getTransaction } = this.props;
				await getTransaction(currentChannel, id);
				this.setState({ dialogOpen: true });
			}
		}
	}

	handleDialogOpen = async (id) => {
		if (id) {
			const currentChannel = this.state.currentChannel
			const { getTransaction } = this.props;
			const res = await getTransaction(currentChannel, id);
			this.setState({ dialogOpen: true });
		}
	}

	handleDialogClose = () => {
		this.setState({ dialogOpen: false });
	};

	handleDialogCloseBlockHash = () => {
		this.setState({ dialogOpenBlockHash: false });
	};

	handleDialogOpenBlockHash = blockHash => {
		const blockList = this.state.search
			? this.props.blockListSearch
			: this.props.blockList;
		const data = find(blockList, item => item.blockhash === blockHash);
		if (data) {
			this.setState({
				dialogOpenBlockHash: true,
				blockHash: data
			});
		} else {
			this.setState({
				showMessage: true,
				message: '区块不存在'
			})
			this.closeMessage()
		}
	};
	closeMessage = () => {
		setTimeout(() => {
			this.setState({
				showMessage: false,
				message: ''
			})
		}, 2000)
	}
	handleChooseType = () => {
		let flag;
		flag = !this.state.flag
		this.setState({
			flag
		})
		if (flag) {
			this.setState({
				chooseIcon: require('../../static/images/up.png')
			})
		} else {
			this.setState({
				chooseIcon: require('../../static/images/down.png')
			})
		}
		
	}

	chooseType = (e) => {
		this.setState({
			searchType: e.target.dataset.type,
			flag: false,
			currentType: searchType[e.target.dataset.type]
		})
	}
	render() {
		// const { dashStats, peerStatus, blockActivity, transactionByOrg } = this.props;
		const { dashStats } = this.props;
		// const { hasDbError, notifications } = this.state;
		const { hasDbError } = this.state;
		if (hasDbError) {
			return (
				<div
					style={{
						height: '100vh',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<h1>
						Please verify your network configuration, database configuration and try
						again
					</h1>
				</div>
			);
		}
		const { transaction, classes } = this.props;
		const { dialogOpen, dialogOpenBlockHash, blockHash, currentType, chooseIcon, closeIcon } = this.state;
		return (
			<div className={classes.background}>
				<div className="search-contaner">
					{ this.state.showMessage ?
					<div className="message">{this.state.message}</div>
					: null }
					<div className="search-content-container">
						<h1 className="h1-title">国富安区块链浏览器</h1>
						<div className="search-">
							<div className="choose-container">
								<div onClick={this.handleChooseType}>
									<span className="current-type">{currentType}</span>
									<img src={chooseIcon} className="choose-icon" />
								</div>
								<div className="choose-items-container" onClick={this.chooseType}>
									{
										this.state.flag ? 
										<div>
											<div className="choose-items" data-type="block">区块</div>
											<div className="choose-items"data-type="transaction">交易</div>
										</div>
										: null
									}
									
								</div>
							</div>
							<div className="search-input-container">
								<input
									type="text"
									placeholder="区块 Hash / 交易 Hash"
									className="search-input"
									ref={input => this.input = input}
								/>
								<img src={closeIcon} className="close-Icon" onClick={ this.handleClear } />
							</div>
							
							<button className="search-btn" onClick={ this.handleSearch }>查找</button>
						</div>
						<Dialog
							open={dialogOpen}
							onClose={this.handleDialogClose}
							fullWidth
							maxWidth="md">
							<TransactionView
								transaction={transaction}
								onClose={this.handleDialogClose}/>
						</Dialog>
						<Dialog
							open={dialogOpenBlockHash}
							onClose={this.handleDialogCloseBlockHash}
							fullWidth
							maxWidth="md">
							<BlockView
								blockHash={blockHash}
								onClose={this.handleDialogCloseBlockHash}/>
						</Dialog>
					</div>
				</div>
				<div className={classes.view}>
					<div className={classes.section}>
						<h3 className="page-title">总览</h3>
						<div className="overall-container">
							<div className="linecharts-container">
								<ChartStats />
							</div>
							<div className={`${classes.section} overall-info-container`}>
								<div className="overall-info-line">
									<div className="items-container">
										<div className="top_">
											<span className={`${classes.iconBackground} ${classes.block}`}>
												<img
													src={require('../../static/images/block.png')}
													className="icons"
												/>
											</span>
											<span className="item-count">{dashStats.latestBlock}</span>
										</div>
										<div className="bottom_">区块数</div>
									</div>

									<div className="items-container">
										<div className="top_">
											<span className={`${classes.iconBackground} ${classes.transaction}`}>
												<img
													src={require('../../static/images/transaction-icon-light.png')}
													className="icons"
												/>
											</span>
											<span className="item-count">{dashStats.txCount}</span>
										</div>
										<div className="bottom_">交易数</div>
									</div>
								</div>

								<div className="overall-info-line">
									<div className="items-container">
										<div className="top_">
											<span className={`${classes.iconBackground} ${classes.node}`}>
												<img
													src={require('../../static/images/node-icon-light.png')}
													className="icons"
												/>
											</span>
											<span className="item-count">{dashStats.peerCount}</span>
										</div>
										<div className="bottom_">节点数</div>
									</div>

									<div className="items-container">
										<div className="top_">
											<span className={`${classes.iconBackground} ${classes.chaincode}`}>
												<img
													src={require('../../static/images/chaincode-icon-dark.png')}
													className="icons"
												/>
											</span>
											<span className="item-count">{dashStats.chaincodeCount}</span>
										</div>
										<div className="bottom_">智能合约</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={classes.section}>
						<h3 className="page-title">
							区块{' '}
							<Link to="/blocks" className="show-more">
								更多
							</Link>
						</h3>
						<div className="block-container">
							<Table
								style={{ width: '100%' }}
								columns={this.state.blockColumns}
								data={this.state.blocksData}
								stripe={true}
								border={true}
							/>
						</div>
					</div>

					<div className="">
						<h3 className="page-title">
							交易{' '}
							<Link to="/transactions" className="show-more">
								更多
							</Link>
						</h3>
						<div className="block-container">
							<Table
								style={{ width: '100%' }}
								columns={this.state.transactionColumns}
								data={this.state.transactionData}
								stripe={true}
								border={true}
							/>
						</div>
					</div>

					{/* <Row>
						<Col sm="12">
							<Card className={classes.blocks}>
								<div className={`${classes.statistic} ${classes.vdivide}`}>
									<Row>
										<Col sm="4">
											<Avatar className={`${classes.avatar} ${classes.block}`}>
												<FontAwesome name="cube" />
											</Avatar>
										</Col>
										<Col sm="4">
											<h1 className={classes.count}>{dashStats.latestBlock}</h1>
										</Col>
									</Row>
									BLOCKS
								</div>
								<div className={`${classes.statistic} ${classes.vdivide}`}>
									<Row>
										<Col sm="4">
											<Avatar className={`${classes.avatar} ${classes.transaction}`}>
												<FontAwesome name="list-alt" />
											</Avatar>
										</Col>
										<Col sm="4">
											<h1 className={classes.count}>{dashStats.txCount}</h1>
										</Col>
									</Row>
									TRANSACTIONS
								</div>
								<div className={`${classes.statistic} ${classes.vdivide}`}>
									<Row>
										<Col sm="4">
											<Avatar className={`${classes.avatar} ${classes.node}`}>
												<FontAwesome name="users" />
											</Avatar>
										</Col>
										<Col sm="4">
											<h1 className={classes.count}>{dashStats.peerCount}</h1>
										</Col>
									</Row>
									NODES
								</div>
								<div className={classes.statistic}>
									<Row>
										<Col sm="4">
											<Avatar className={`${classes.avatar} ${classes.chaincode}`}>
												<FontAwesome name="handshake-o" />
											</Avatar>
										</Col>
										<Col sm="4">
											<h1 className={classes.count}>{dashStats.chaincodeCount}</h1>
										</Col>
									</Row>
									CHAINCODES
								</div>
							</Card>
						</Col>
					</Row>
					<Row>
						<Col sm="6">
							<Card className={classes.section}>
								<PeersHealth peerStatus={peerStatus} />
							</Card>
							<Card className={classes.section}>
								<TimelineStream
									notifications={notifications}
									blockList={blockActivity}
								/>
							</Card>
						</Col>
						<Col sm="6">
							<Card className={classes.section}>
								<ChartStats />
							</Card>
							<Card className={`${classes.section} ${classes.center}`}>
								<h5>Transactions by Organization</h5>
								<hr />
								<OrgPieChart transactionByOrg={transactionByOrg} />
							</Card>
						</Col>
					</Row> */}
				</div>
			</div>
		);
	}
}

DashboardView.propTypes = {
	blockList: blockListType.isRequired,
	dashStats: dashStatsType.isRequired,
	peerStatus: peerStatusType.isRequired,
	transactionByOrg: transactionByOrgType.isRequired,
	transaction: transactionType
};

export default withStyles(styles)(DashboardView);
