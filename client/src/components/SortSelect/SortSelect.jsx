import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
const SORT_OPTIONS = [
  {
    optionValue: 'default',
    label: 'Mặt định',
  },
  {
    field: 'expiredDate',
    value: -1,
    optionValue: 'expiredDate|-1',
    label: 'Thời gian hết hạn giảm dần',
  },
  {
    field: 'expiredDate',
    value: 1,
    optionValue: 'expiredDate|1',
    label: 'Thời gian hết hạn tăng dần',
  },
  {
    field: 'currentPrice',
    value: -1,
    optionValue: 'currentPrice|-1',
    label: 'Giá hiện tại giảm dần',
  },
  {
    field: 'currentPrice',
    value: 1,
    optionValue: 'currentPrice|1',
    label: 'Giá hiện tại tăng dần',
  },
  {
    field: 'createdAt',
    value: -1,
    optionValue: 'createdAt|-1',
    label: 'Ngày đăng giảm dần',
  },
  {
    field: 'createdAt',
    value: 1,
    optionValue: 'createdAt|1',
    label: 'Ngày đăng tăng dần',
  },
]
const SortSelect = ({ label, value, onChange }) => {
  return (
    <Select
      className='min-w-[230px] my-4'
      value={value}
      label={label}
      onChange={onChange}
    >
      {SORT_OPTIONS.map((item, itemIndex) => {
        return (
          <MenuItem key={item.optionValue} value={item.optionValue}>
            {item.label}
          </MenuItem>
        )
      })}
    </Select>
  )
}

export default SortSelect
