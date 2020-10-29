/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import clientJson from '../../../package.json';
// import FabricVersion from '../../FabricVersion';

const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
		root: {
			margin: '2%'
		},
		footer: {
			backgroundColor: dark ? '#062348' : '#e8e8e8',
			color: dark ? '#ffffff' : undefined,
			textAlign: 'center',
			position: 'fixed',
			left: 0,
			right: 0,
			bottom: 0
		}
	};
};

const FooterView = ({ classes }) => (
	<div className={classes.root}>
		<div>
			<div className={classes.footer}>
				{'北京国富安电子商务安全认证有限公司 '}
				{/* {clientJson.version}
				&emsp;
				{'Fabric Compatibility: '} {FabricVersion.map(v => v)} */}
			</div>
		</div>
	</div>
);

export default withStyles(styles)(FooterView);
