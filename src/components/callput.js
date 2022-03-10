import React from "react";

function CallPut({rows}) {
    return (  
        <React.Fragment>
            {rows.map(r => {
            return (
                <tr>
                    <td>{r.e}</td>
                    <td>{r.a}</td>
                    <td>{r.r1}</td>
                    <td>{r.r2}</td>
                    <td>{r.b1}</td>
                    <td>{r.b2}</td>
                </tr>
            )
        })}
        </React.Fragment>
      )
}

export default CallPut;