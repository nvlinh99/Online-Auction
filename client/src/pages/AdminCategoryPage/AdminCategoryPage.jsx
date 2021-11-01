import React, { useCallback, useEffect, useState } from 'react'
import { Table, Space, Button, Popconfirm, Modal, Form, Input } from 'antd'

import useQuery from 'hooks/useQuery'
import { pick } from 'lodash'
import { adminApi } from 'services'
import { toast } from 'react-toastify'

const AdminCategoryPage = () => {
  const [categories, setCategories] = useState({})
  const { query, onChange } = useQuery()
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalData, setModalData] = useState({
    title: 'Thêm mới danh mục',
    body: {},
    visible: false,
    isEdit: false,
  })

  const handleOk = async () => {
    const data = form.getFieldValue()
    setConfirmLoading(true)
    const updateCategory = console.log
    const addCategory = console.log
    const categoryAction = modalData.isEdit ? updateCategory : addCategory
    categoryAction(
      data,
      () => {
        setModalData({ visible: false, isEdit: false })
        setConfirmLoading(false)
      },
      () => {
        setConfirmLoading(false)
      }
    )
  }
  const loadData = useCallback(async () => {
    if (!query) {
      return
    }
    try {
      setIsLoading(true)
      const { succeeded, data } = await adminApi.categoryAPI.getListCategories({
        ...pick(query, ['page', 'limit']),
      })
      if (!succeeded) {
        toast.error(data?.message)
        return
      }
      setCategories(data)
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
        title: '',
        description: '',
      },
      visible: true,
      isEdit: false,
    })
  }

  useEffect(() => {
    form.setFieldsValue(modalData.body)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalData.body])

  const handleDelete = async (record) => {
    try {
      setIsLoading(true)
      let body = { ...record }
      const { succeeded, data } = await adminApi.categoryAPI.deleteCat(body)
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
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <p>{text}</p>,
    },

    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button type='primary' onClick={() => handleEdit(record)}>
            Chỉnh sửa
          </Button>

          <Popconfirm
            title='Bạn có chắc chắn muốn xóa mục này?'
            onConfirm={() => handleDelete(record)}
          >
            <Button type='primary' danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Table columns={columns} dataSource={categories.items} />
      <Modal
        title={modalData.title}
        visible={modalData.visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          name='category'
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label='Tên danh mục'
            name='title'
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Mô tả'
            name='description'
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminCategoryPage
