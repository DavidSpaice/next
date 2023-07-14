"use client"
import React from 'react'
import Component from './Component'
import { DataProvider } from '../DataContext';

function page({ Component, pageProps }) {
  return (
    <DataProvider><Component  {...pageProps} /></DataProvider>
  )
}

export default page