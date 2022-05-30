import React from 'react';

import Main from './components/pages/Main/Main';

interface IProps {}

const AppView: React.FC<IProps> = () => {
	return (
		<Main />
	);
};

AppView.displayName = 'AppView';
AppView.defaultProps = {};

export default React.memo(AppView);
