import React, { useCallback, useEffect, useState } from 'react'
import {
  Table,
  Space,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  Tag,
  Typography,
  Tooltip,
  Select,
} from 'antd'
import { PlusSquareFilled } from '@ant-design/icons'

import useQuery from 'hooks/useQuery'
import { pick } from 'lodash'
import { adminApi, userAPI } from 'services'
import { toast } from 'react-toastify'
import { RiAddFill, RiCloseFill } from 'react-icons/ri'
import { FiMinus } from 'react-icons/fi'
import { USER_ROLE, USER_STATUS } from 'constants/userConstants'

const AdminCategoryPage = () => {
  const [childCategoryData, setChildCategoryData] = useState({
    mode: '',
    title: '',
    parentId: '',
  })
  const [users, setUsers] = useState({})
  const { query, onChange } = useQuery()
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalData, setModalData] = useState({
    title: 'Thêm tài khoản',
    body: {},
    visible: false,
    isEdit: false,
  })
  const onUpdate = async (body, isCloseModal = true) => {
    if (!body) {
      return false
    }
    try {
      setConfirmLoading(true)
      const { succeeded, data } = await adminApi.userApi.update(
        pick(body, [
          'id',
          'firstName',
          'lastName',
          'address',
          'email',
          'status',
          'role',
        ])
      )
      if (!succeeded) {
        toast.error(data?.message)
        return false
      }
      loadData()
      toast.success(data?.message)
      return data
    } catch (error) {
      toast.error(error?.message)
    } finally {
      setConfirmLoading(false)
      isCloseModal && setModalData({ visible: false, isEdit: false })
    }
    return false
  }
  const onAdd = async (body, isCloseModal = true) => {
    if (!body) {
      return false
    }
    try {
      setConfirmLoading(true)
      const { succeeded, data } = await adminApi.userApi.add(
        pick(body, [
          'firstName',
          'lastName',
          'address',
          'email',
          'password',
          'role',
        ])
      )
      if (!succeeded) {
        toast.error(data?.message)
        return false
      }
      loadData()
      toast.success(data?.message)
      return data
    } catch (error) {
      toast.error(error?.message)
    } finally {
      setConfirmLoading(false)
      isCloseModal && setModalData({ visible: false, isEdit: false })
    }
    return false
  }
  const handleOk = async () => {
    try {
      await form.validateFields()
      const data = form.getFieldValue()

      setConfirmLoading(true)
      if (modalData.isEdit) {
        return onUpdate(data)
      }
      return onAdd(data)
    } catch (err) {
      return null
    }
  }
  const loadData = useCallback(async () => {
    if (!query) {
      return
    }
    try {
      setIsLoading(true)
      const { succeeded, data } = await adminApi.userApi.getListUsers({
        ...pick(query, ['page', 'limit']),
      })
      if (!succeeded) {
        toast.error(data?.message)
        return
      }
      setUsers(data)
    } catch (error) {
      toast.error(error?.message)
    } finally {
      setIsLoading(false)
    }
  }, [query])
  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCancel = () => {
    setModalData({
      visible: false,
      isEdit: false,
    })
  }

  const handleEdit = (record) => {
    setModalData({
      title: 'Cập nhật danh mục',
      body: { ...record },
      visible: true,
      isEdit: true,
    })
  }

  const handleAdd = () => {
    setModalData({
      title: 'Thêm mới danh mục',
      body: {
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        password: '',
        role: USER_ROLE.BIDDER,
      },
      visible: true,
      isEdit: false,
    })
  }
  const handleSaveChildCategory = async () => {
    if (!childCategoryData.title) {
      return
    }
    let data
    if (childCategoryData.mode === 'edit') {
      data = await onUpdate(childCategoryData, false)
    }
    if (childCategoryData.mode === 'add') {
      data = await onAdd(childCategoryData, false)
    }
    if (data) {
      setChildCategoryData({ mode: '', title: '' })
    }
  }
  useEffect(() => {
    form.setFieldsValue(modalData.body)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalData.body])

  const onResetPassword = async (record) => {
    try {
      const { succeeded, data } = await userAPI.forgetPassword({
        email: record.email,
      })
      if (!succeeded) {
        return toast.error(data?.message || 'Reset mật khẩu không thành công.')
      }
      return toast.success('Thành công.')
    } catch (e) {
      return toast.error('Đã có lỗi từ hệ thống.')
    }
  }
  const handleBlock = async (record) => {
    try {
      setIsLoading(true)
      let body = { ...record }
      const { succeeded, data } = await adminApi.userApi.block(body)
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
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Tên',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Họ',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (r) => <p>{getRoleText(r)}</p>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (s) => (
        <p className={getStatusClassName(s)}>{getStatusText(s)}</p>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button type='primary' onClick={() => handleEdit(record)}>
            Chỉnh sửa
          </Button>
          <Button type='secondary' onClick={() => onResetPassword(record)}>
            Reset mật khẩu
          </Button>
          <Popconfirm
            title='Bạn có chắc chắn muốn xóa mục này?'
            onConfirm={() => handleBlock(record)}
          >
            <Button type='primary' danger>
              Khóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]
  useEffect(() => {
    if (users.items?.length && modalData.isEdit && modalData.body?.id) {
      const founded = users.items.find((i) => i.id === modalData.body?.id)
      if (founded) {
        handleEdit(founded)
      }
    }
  }, [users.items, modalData.body?.id, modalData.isEdit])
  return (
    <div className='mt-10'>
      <div className='panel flex-col md:flex-row  flex-between py-4'>
        <h1 className='panel-title'>Quản lý tài khoản</h1>
        <div className='flex-center text-[#171d1c] text-base'>
          <Button type='primary' onClick={() => handleAdd()} className='mr-3'>
            Thêm
          </Button>
        </div>
      </div>
      <div className='panel py-4'>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={users.items}
          pagination={{
            showSizeChanger: true,
            pageSize: query?.limit || 25,
            pageSizeOptions: [10, 25, 50],
            total: users.totalItems,
            current: query?.page ? parseInt(query?.page) : 1,
            onChange: (page) => {
              onChange('page', page)
            },
            onShowSizeChange: (current, newSize) => {
              if (query?.page > users.totalItems / newSize) {
                onChange('page', 1)
              }
              onChange('limit', newSize)
            },
          }}
        />
      </div>
      <Modal
        title={modalData.title}
        visible={modalData.visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        cancelText='Hủy'
        okText='Lưu'
      >
        <Form
          name='user'
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label='Tên'
            name='firstName'
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Họ'
            name='lastName'
            rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Địa chỉ'
            name='address'
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Email'
            name='email'
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Vui lòng nhập email!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          {modalData.isEdit ? (
            <Form.Item
              label='Trạng thái'
              name='status'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn trạng thái!',
                },
              ]}
            >
              <Select placeholder='Chọn trạng thái'>
                <Select.Option value={USER_STATUS.ACTIVE}>
                  Kích hoạt
                </Select.Option>
                <Select.Option value={USER_STATUS.INACTIVE}>
                  Chưa kích hoạt
                </Select.Option>
                <Select.Option value={USER_STATUS.BLOCKED}>
                  Bị khóa
                </Select.Option>
              </Select>
            </Form.Item>
          ) : (
            <Form.Item
              label='Mật khẩu'
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
              ]}
            >
              <Input type='password' />
            </Form.Item>
          )}
          <Form.Item
            label='Vai trò'
            name='role'
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn vai trò!',
              },
            ]}
          >
            <Select placeholder='Chọn vài trò'>
              <Select.Option value={USER_ROLE.BIDDER}>Người mua</Select.Option>
              <Select.Option value={USER_ROLE.SELLER}>Người bán</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

function getRoleText(r) {
  if (r == USER_ROLE.BIDDER) return 'Người mua'
  if (r == USER_ROLE.SELLER) return 'Người bán'
  if (r == USER_ROLE.ADMIN) return 'Quản trị viên'
  return ''
}

function getStatusText(s) {
  if (s == USER_STATUS.ACTIVE) return 'Kích hoạt'
  if (s == USER_STATUS.INACTIVE) return 'Chưa kích hoạt'
  if (s == USER_STATUS.BLOCKED) return 'Bị khóa'
  return ''
}

function getStatusClassName(s) {
  const defaultClassName = 'font-bold'
  if (s == USER_STATUS.ACTIVE) return `${defaultClassName} text-green-600`
  if (s == USER_STATUS.INACTIVE) return `${defaultClassName} text-yellow-500`
  if (s == USER_STATUS.BLOCKED) return `${defaultClassName} text-red-600`
  return ''
}
export default AdminCategoryPage
