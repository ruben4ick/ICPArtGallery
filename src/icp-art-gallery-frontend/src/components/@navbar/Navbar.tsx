import './style.scss';

export const Navbar = () => {
    return (
        <div className="head-glass">
            <div className="head-text">
                <a href='/src/icp-art-gallery-frontend/src/static'>.main</a>
            </div>
            <div className="head-text">
                <a href='/gallery'>.gallery</a>
            </div>
            <div className="head-text">
                <a href='/profile'>.profile</a>
            </div>
        </div>
    );
};