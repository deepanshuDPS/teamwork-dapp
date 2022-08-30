import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

let Header = () =>{
    return (
        <Menu style ={{ marginTop: '10px' }} >
            <Link route="/">
                <a className="item">
                    <h3> Teamwork </h3>
                </a>
            </Link>
            <Menu.Menu position='right'>
                <Link route="/">
                    <a className="item">
                        Teams
                    </a>
                </Link>
                <Link route="/teams/new">
                    <a className="item">+</a>
                </Link>
            </Menu.Menu>

        </Menu>
    )
}

export default Header;