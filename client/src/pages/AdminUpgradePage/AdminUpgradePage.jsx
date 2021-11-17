import React, { useCallback, useEffect, useState } from 'react'
import { Table, Space, Button, Popconfirm, Form, Tag, Tooltip } from 'antd'

import useQuery from 'hooks/useQuery'
import { pick } from 'lodash'
import { adminApi } from 'services'
import { toast } from 'react-toastify'
import moment from 'moment'
import classNames from 'classnames'
import { AiFillDislike, AiFillLike } from 'react-icons/ai'

const AdminUpgradePage = () => {
  const [upgraderequests, setUpgradeRequests] = useState({})
  const { query, onChange } = useQuery()
  const [isLoading, setIsLoading] = useState(false)

  const loadData = useCallback(async () => {
    if (!query) {
      return
    }
    try {
      setIsLoading(true)
      const { succeeded, data } = await adminApi.upgradeApi.getListUpgrade({
        ...pick(query, ['page', 'limit']),
      })
      if (!succeeded) {
        toast.error(data?.message)
        return
      }
      setUpgradeRequests(data)
    } catch (error) {
      toast.error(error?.message)
    } finally {
      setIsLoading(false)
    }
  }, [query])
  useEffect(() => {
    loadData()
  }, [loadData])

  const onReject = async (record) => {
    try {
      setIsLoading(true)
      let body = { ...record }
      const { succeeded, data } = await adminApi.upgradeApi.reject(
        pick(body, 'id')
      )
      if (!succeeded) {
        setIsLoading(false)
        toast.error(data?.message)

        return
      }
      loadData()
      toast.success(data?.message)
    } catch (error) {
      setIsLoading(false)
      toast.error(error?.message)
    }
  }
  const onApprove = async (record) => {
    try {
      setIsLoading(true)
      let body = { ...record }
      const { succeeded, data } = await adminApi.upgradeApi.approve(
        pick(body, 'id')
      )
      if (!succeeded) {
        setIsLoading(false)
        toast.error(data?.message)

        return
      }
      loadData()
      toast.success(data?.message)
    } catch (error) {
      setIsLoading(false)
      toast.error(error?.message)
    }
  }
  const columns = [
    {
      title: '#',
      dataIndex: '_',
      key: '_',
      render: (text, _, index) => <p>{index + 1}</p>,
    },

    {
      title: 'Tên tài khoản',
      dataIndex: 'user',
      key: 'user.fullname',
      render: (user) => (
        <p>{`${user?.firstName || ''} ${user?.lastName || ''}`}</p>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'user',
      key: 'user.email',
      render: (user) => <p>{`${user?.email || ''}`}</p>,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'user',
      key: 'user.rating',
      render: (user = {}) => (
        <div className='flex items-center'>
          <div
            className={classNames(
              'mr-3 flex items-center border px-3 py-1 rounded-lg shadow-sm hover:shadow-product hover:bg-opacity-50 text-[#E4A834]'
            )}
          >
            {user?.rateIncrease || 0}
            <AiFillLike className='ml-0.5' fill='#E4A834' size='20px' />
          </div>
          <div
            className={classNames(
              ' mr-3 flex items-center border px-3 py-1 rounded-lg shadow-sm hover:shadow-product hover:bg-opacity-50 text-[#B13A1A]'
            )}
          >
            {user?.rateDecrease || 0}
            <AiFillDislike className='ml-0.5' fill='#B13A1A' size='20px' />
          </div>
        </div>
      ),
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiredDate',
      key: 'expiredDate',
      render: (text) => <p>{moment(text).format('DD/MM/YYYY HH:mm')}</p>,
    },

    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Popconfirm
            title='Bạn có chắc chắn duyệt yêu cầu này?'
            onConfirm={() => onApprove(record)}
          >
            <Button type='primary' onClick={() => {}}>
              Duyệt
            </Button>
          </Popconfirm>
          <Popconfirm
            title='Bạn có chắc chắn từ chối yêu cầu này?'
            onConfirm={() => onReject(record)}
          >
            <Button type='primary' danger>
              Từ chối
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className='mt-10'>
      <div className='panel flex-col md:flex-row  flex-between py-4'>
        <h1 className='panel-title'>Quản lý yêu cầu nâng cấp tài khoản</h1>
        <div className='flex-center text-[#171d1c] text-base'></div>
      </div>
      <div className='panel py-4'>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={upgraderequests.items}
          pagination={{
            showSizeChanger: true,
            pageSize: query?.limit || 25,
            pageSizeOptions: [10, 25, 50],
            total: upgraderequests.totalItems,
            current: query?.page ? parseInt(query?.page) : 1,
            onChange: (page) => {
              onChange('page', page)
            },
            onShowSizeChange: (current, newSize) => {
              if (query?.page > upgraderequests.totalItems / newSize) {
                onChange('page', 1)
              }
              onChange('limit', newSize)
            },
          }}
        />
      </div>
    </div>
  )
}

export default AdminUpgradePage
