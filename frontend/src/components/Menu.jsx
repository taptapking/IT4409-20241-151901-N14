import { Link } from "react-router-dom";

function Menu({ typeCounts, setFilteredByType }) {
    return (
        <aside className="menu">
            <nav>
                <ul>
                    <li>
                        <Link 
                            to="/" 
                            onClick={() => setFilteredByType(null)}
                        >
                            Home
                        </Link>
                    </li>
                    {Object.entries(typeCounts).map(([type, count]) => (
                        <li key={type}>
                            <Link 
                                to={`/${type}`}
                                onClick={() => setFilteredByType(type)}
                            >
                                {type} ({count})
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default Menu;
