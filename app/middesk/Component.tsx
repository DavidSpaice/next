"use client"
import React from "react";

function Component(props: any) {
const {data} = props;


  return <div>{data[1].email}</div>;
}

export default Component;

