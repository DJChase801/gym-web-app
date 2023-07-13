import React, { useState } from 'react';
import './view.css';
import Buy from '../../Views/Buy/buy';
import Admin from '../../Views/Admin/admin';


function View({ page }) {

    const [nameAnswer, setNameAnswer] = useState('');

	return (
		<div className={'the-view'}>
            {page === 'buy' &&
                <Buy 
                    setNameAnswer={setNameAnswer}
                />
            }
            {page === 'admin' &&
                <Admin />
            }
		</div>
	);
}

export default View;