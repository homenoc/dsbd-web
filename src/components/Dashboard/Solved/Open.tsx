import { Chip } from '@mui/material'
import React from 'react'

export function Solved(props: { solved: boolean }): any {
  const { solved } = props
  if (solved) {
    return <Chip size="small" color="primary" label="解決済" />
  } 
    return <Chip size="small" color="secondary" label="未解決" />
  
}
