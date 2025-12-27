import React, { memo } from "react";

const Card = memo((props) => {

    return(
       <button className={`card-box card-box-${props.id}`} onClick={() => props.onsquareclick(props.id, props.value)}><h3><b>?</b></h3></button>
    )
}) 

export default Card