import { Main } from './Main';
import { Search } from './Search';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

function App() {
    return (
        <div className="App min-h-screen bg-gray-100">
            <BrowserRouter>
                <Switch>
                    <Route path="/search/:query">
                        <Search />
                    </Route>
                    <Route path="/">
                        <Main />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
