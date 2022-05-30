import React from 'react';

import AppView from './App.view';

interface IProps {}

const App: React.FC<IProps> = () => {
	return <AppView />;
};

App.displayName = 'App';

export default React.memo(App);
