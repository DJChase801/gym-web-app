import React from 'react';
import mainLogo from '../../Images/ute-logo.png'
import './topBar.css'


function TopBar({ setPage }) {
	return (
		<div>
			<div className="bar-items">
				<div>
                    <img className="logo" src={mainLogo} alt="ute-app"/>
				</div>
				<div >
					<select className='page-selector' onChange={(e) => setPage(e.target.value)}>
						<option value="buy">Buy</option>
						<option value="admin">Admin</option>
					</select>
				</div>
			</div>
		</div>
	);
}

export default TopBar;