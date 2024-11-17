function Menu({ typeCounts, setFilteredByType }) {
    return (
        <aside className="menu">
            <nav>
                <li>
                        <a 
                            href="#home" 
                            onClick={() => setFilteredByType(null)}
                        >
                            Home
                        </a>
                </li>
                <ul>
                    {Object.entries(typeCounts).map(([type, count]) => (
                        <li key={type}>
                            <a 
                                href={`#${type}`}
                                onClick={() => setFilteredByType(type)}
                            >
                                {type} ({count})
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default Menu;
