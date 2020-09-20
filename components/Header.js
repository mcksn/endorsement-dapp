import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default ( ) => {
	return (
		<Menu style={{ marginTop: '15px' }}>

			<Link route="/" > 
				<a className="item" >
					Endorsement
				</a>
			
			</Link>

			<Menu.Menu position="right">
				
			<Link route="/" > 
				<a className="item" >
					Participants
				</a>
			
			</Link>

			<Link route="/participants/new" > 
				<a className="item" >
					+	
				</a>
			</Link>

			</Menu.Menu>
		</Menu>
	
	);

};
