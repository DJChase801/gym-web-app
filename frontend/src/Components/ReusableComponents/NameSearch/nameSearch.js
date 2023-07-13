import React, { useEffect } from "react";
import axios from 'axios';


const NameList = ({ listOptions, searchText, showList, madeSelection}) => {   

    const filteredData = listOptions.filter((option) => {
        let lowerInput = searchText === undefined ? '' : searchText.toLowerCase();
        return option.full_name.toLowerCase().includes(lowerInput);
    }).sort((a, b) => {
        if (a.full_name < b.full_name) {
        return -1;
        }
    });


    if (showList) {
        return (
            <>
            {filteredData.length > 0 &&
                <div className={'list'} tabIndex={2}>
                        {filteredData.map((member) => (
                            <div className={'list-item'} onMouseDown={() => madeSelection(JSON.stringify(member.member_id), member.full_name)}>
                                <div
                                    value={JSON.stringify(member.member_id)}
                                    key={member.member_id}
                                >
                                    {member.full_name}
                                </div>
                            </div>
                        ))}
                </div>
            }
            </>
        );
    }
};

export default NameList;