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
} from 'antd'
import { PlusSquareFilled } from '@ant-design/icons'

import useQuery from 'hooks/useQuery'
import { pick } from 'lodash'
import { adminApi } from 'services'
import { toast } from 'react-toastify'
import { RiAddFill, RiCloseFill } from 'react-icons/ri'
import { FiMinus } from 'react-icons/fi'

const AdminCategoryPage = () => {
  const [childCategoryData, setChildCategoryData] = useState({
    mode: '',
    title: '',
    parentId: '',
  })
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
  const onUpdate = async (body, isCloseModal = true) => {
    if (!body) {
      return false
    }
    try {
      setConfirmLoading(true)
      const { succeeded, data } = await adminApi.categoryAPI.update(
        pick(body, ['id', 'title', 'parentId'])
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
      const { succeeded, data } = await adminApi.categoryAPI.add(
        pick(body, ['title', 'parentId'])
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
    const data = form.getFieldValue()
    setConfirmLoading(true)
    if (modalData.isEdit) {
      return onUpdate(data)
    }
    return onAdd(data)
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
      title: 'Tên danh mục',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Danh mục con',
      dataIndex: 'childrens',
      key: 'childrens',
      render: (childrens) => {
        if (!childrens?.length) {
          return []
        }
        const normalTag = childrens.slice(0, 5)?.map((tag) => (
          <Tag key={tag.id} color='magenta' style={{ margin: '5px' }}>
            {tag.title}
          </Tag>
        ))
        const extra = childrens
          .slice(5)
          .map((i) => i.title)
          .join(', ')
        return [
          normalTag,
          childrens?.length > 5 && (
            <Tooltip placement='top' title={extra}>
              <Tag color='magenta' style={{ margin: '5px' }}>
                {`+${childrens.length - 5} danh mục`}
              </Tag>
            </Tooltip>
          ),
        ]
      },
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
  useEffect(() => {
    if (categories.items?.length && modalData.isEdit && modalData.body?.id) {
      const founded = categories.items.find((i) => i.id === modalData.body?.id)
      if (founded) {
        handleEdit(founded)
      }
    }
  }, [categories.items, modalData.body?.id, modalData.isEdit])
  return (
    <div className='mt-10'>
      <div className='panel flex-col md:flex-row  flex-between py-4'>
        <h1 className='text-2xl leading-10 font-semibold text-[#171d1c]'>
          Danh Sách sản phẩm
        </h1>
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
          dataSource={categories.items}
          pagination={{
            showSizeChanger: true,
            pageSize: query?.limit || 25,
            pageSizeOptions: [10, 25, 50],
            total: categories.totalItems,
            current: query?.page ? parseInt(query?.page) : 1,
            onChange: (page) => {
              onChange('page', page)
            },
            onShowSizeChange: (current, newSize) => {
              if (query?.page > categories.totalItems / newSize) {
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
          {modalData.isEdit && (
            <Form.Item label='Danh mục con'>
              <ul className='inline-flex items-center flex-wrap gap-y-2'>
                <Tag
                  color='purple'
                  className='mr-[5px] hover:cursor-pointer'
                  onClick={() =>
                    setChildCategoryData({
                      mode: 'add',
                      title: '',
                      parentId: modalData.body?.id,
                    })
                  }
                >
                  <RiAddFill size={20} />
                </Tag>
                {modalData.body?.childrens?.map((tag, index) => (
                  <Tag
                    key={tag.id}
                    color='magenta'
                    closable
                    className='inline-flex items-center mr-[5px] hover:cursor-pointer'
                    closeIcon={
                      <Popconfirm
                        title='Bạn có chắc chắn muốn xóa mục này?'
                        onConfirm={() => handleDelete(tag)}
                      >
                        <RiCloseFill size={16} color='#cf1322' />
                      </Popconfirm>
                    }
                    onClick={() =>
                      setChildCategoryData({
                        mode: 'edit',
                        ...tag,
                      })
                    }
                  >
                    {tag.title}
                  </Tag>
                ))}
              </ul>
            </Form.Item>
          )}
          {childCategoryData.mode && (
            <>
              <Form.Item
                label={
                  childCategoryData.mode === 'edit' ? 'Chỉnh sửa' : 'Tạo mới'
                }
              >
                <Input
                  value={childCategoryData.title}
                  onChange={(e) =>
                    setChildCategoryData((old) => ({
                      ...old,
                      title: e.target.value,
                    }))
                  }
                />
              </Form.Item>

              <div className='space-x-2 text-right'>
                <Button
                  type='secondary'
                  onClick={(e) => setChildCategoryData({ mode: '', title: '' })}
                >
                  Hủy
                </Button>
                <Button
                  type='primary'
                  loading={confirmLoading}
                  onClick={(e) => handleSaveChildCategory()}
                >
                  Lưu
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default AdminCategoryPage
