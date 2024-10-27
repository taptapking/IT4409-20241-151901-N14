import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';
import CardList from './CardList';

function App() {
    return (
        <div className="app">
            <Header />
            <div className="main-content">
                <Menu />
                <div className="content">
                    <h1>Shopping Cards</h1>
                    <CardList />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default App;

