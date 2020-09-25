import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import MobileApp from './containers/MobileApp';

function App() {
	return (
		<Router>
			<div className='App'>
				<Switch>
					<Route path='/app'>
						<MobileApp />
					</Route>

					<Route path='/'>
						<MobileApp />
					</Route>
				</Switch>
			</div>
		</Router>
	);
}
const Home = () => (
	<div>
		<h2>Home</h2>
	</div>
);
export default App;
