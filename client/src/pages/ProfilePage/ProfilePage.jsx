import { Avatar } from '@mui/material'
import moment from 'moment'
import useLogin from 'hooks/useLogin'
import React, { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from 'store/user/selector'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
import TextField from '@mui/material/TextField'
import { toast } from 'react-toastify'
import * as userApi from 'services/userApi'
import './index.css'
import { getCurrentUserFromAPI } from 'store/user/action'

const roleMapping = {
  0: 'quản trị viên',
  1: 'người bán',
  2: 'người mua',
}

function validateProfileInput(data) {
  if (!data?.firstName) return 'Yêu cầu nhập tên'
  if (!data?.lastName) return 'Yêu cầu nhập họ'
  if (!data?.email) return 'Yêu cầu nhập email'
  if (!data?.address) return 'Yêu cầu nhập địa chỉ'
  return null
}

const ProfilePage = () => {
  const currentUser = useSelector(selectCurrentUser)
  const [openEdit, setOpenEdit] = useState(false)
  const [profileData, setProfileData] = useState({})
  useEffect(() => {
    setProfileData({
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
      email: currentUser?.email,
      address: currentUser?.address,
      dateOfBirth: currentUser?.dateOfBirth
        ? moment(currentUser?.dateOfBirth)
        : null,
    })
  }, [
    currentUser?.address,
    currentUser?.dateOfBirth,
    currentUser?.email,
    currentUser?.firstName,
    currentUser?.lastName,
  ])

  const onUpdateProfile = useCallback(
    async function () {
      console.log('asdasdksjadlk')
      const errMsg = validateProfileInput(profileData)
      if (errMsg) return toast.error(errMsg)
      const data = { ...profileData }
      data.dateOfBirth = data.dateOfBirth?.toISOString()
      console.log(data)
      try {
        const { succeeded, data: resData } = await userApi.updateProfle(data)
        if (!succeeded)
          return toast.error(resData?.message || 'Cập nhật thông tin thất bại.')
        toast.info('Cập nhật thông tin thành công.')
        getCurrentUserFromAPI().then(() => setOpenEdit(false))
      } catch (err) {
        toast.error('Cập nhật thông tin thất bại.')
      }
      return null
    },
    [profileData]
  )
  const onOpenEdit = useCallback(() => {
    setOpenEdit(true)
  }, [])

  return (
    <div
      style={{ width: '40%', minWidth: '400px' }}
      className='container mx-auto mt-[40px]'
    >
      <div
        style={{ position: 'relative', height: '250px', background: '#455a64' }}
      >
        <p
          style={{
            fontWeight: 'bold',
            fontSize: '22px',
            color: '#fff',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-150%)',
            left: '40px',
          }}
        >
          Hồ sơ các nhân
        </p>
      </div>
      <div style={{}}>
        <div
          style={{
            margin: '0 auto',
            borderRadius: '15px',
            transform: 'translateY(-50px)',
            background: '#fff',
            width: '90%',
            boxShadow: '#ddd 0px 5px 10px',
          }}
        >
          <div
            style={{
              borderBottom: '1px solid #ddd',
              padding: '20px',
              height: '150px',
            }}
          >
            <Avatar
              style={{
                height: '150px',
                width: '150px',
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {currentUser?.firstName?.[0]?.toUpperCase()}
            </Avatar>
            <p
              style={{ fontSize: '18px' }}
              className='text-center mt-14 font-bold'
            >
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <p className='text-center'>{currentUser?.email}</p>
          </div>
          {openEdit ? (
            <div style={{ padding: '20px 80px' }}>
              <p
                className='mt-4 flex'
                style={{ justifyContent: 'space-between' }}
              >
                <span style={{ display: 'inline-block', width: '150px' }}>
                  Họ:
                </span>
                <input
                  style={{
                    flex: '1',
                    padding: '0 10px',
                    border: '1px solid #ddd',
                  }}
                  onChange={(e) => {
                    setProfileData((old) => ({
                      ...old,
                      lastName: e.target.value,
                    }))
                  }}
                  type='text'
                  value={profileData.lastName}
                  placeholder='Họ'
                />
              </p>
              <p
                className='mt-4 flex'
                style={{ justifyContent: 'space-between' }}
              >
                <span style={{ display: 'inline-block', width: '150px' }}>
                  Tên:
                </span>
                <input
                  onChange={(e) => {
                    setProfileData((old) => ({
                      ...old,
                      firstName: e.target.value,
                    }))
                  }}
                  style={{
                    flex: '1',
                    padding: '0 10px',
                    border: '1px solid #ddd',
                  }}
                  type='text'
                  value={profileData.firstName}
                  placeholder='Tên'
                />
              </p>
              <p
                className='mt-4 flex'
                style={{ justifyContent: 'space-between' }}
              >
                <span style={{ display: 'inline-block', width: '150px' }}>
                  Email:
                </span>
                <input
                  onChange={(e) => {
                    setProfileData((old) => ({
                      ...old,
                      email: e.target.value,
                    }))
                  }}
                  style={{
                    flex: '1',
                    padding: '0 10px',
                    border: '1px solid #ddd',
                  }}
                  type='email'
                  value={profileData.email}
                  placeholder='Email'
                />
              </p>
              <p
                className='mt-4 flex'
                style={{ justifyContent: 'space-between' }}
              >
                <span style={{ display: 'inline-block', width: '150px' }}>
                  Địa chỉ:
                </span>
                <input
                  onChange={(e) => {
                    setProfileData((old) => ({
                      ...old,
                      address: e.target.value,
                    }))
                  }}
                  style={{
                    flex: '1',
                    padding: '0 10px',
                    border: '1px solid #ddd',
                  }}
                  type='text'
                  value={profileData.address || ''}
                  placeholder='Địa chỉ'
                />
              </p>
              <p
                className='mt-4 flex date-of-birth-edit'
                style={{ justifyContent: 'space-between' }}
              >
                <span style={{ display: 'inline-block', width: '150px' }}>
                  Ngày sinh:
                </span>
                <DesktopDatePicker
                  value={profileData.dateOfBirth}
                  onChange={(v) => {
                    setProfileData((old) => ({
                      ...old,
                      dateOfBirth: v,
                    }))
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </p>
              <div className='flex justify-center mt-8'>
                <button
                  onClick={onUpdateProfile}
                  className='mr-8'
                  style={{
                    padding: '10px 20px',
                    color: '#fff',
                    background: '#4caf50',
                  }}
                >
                  Cập nhật
                </button>
                <button
                  onClick={() => {
                    setOpenEdit(false)
                    setProfileData({
                      firstName: currentUser?.firstName,
                      lastName: currentUser?.lastName,
                      email: currentUser?.email,
                      address: currentUser?.address,
                      dateOfBirth: currentUser?.dateOfBirth
                        ? moment(currentUser?.dateOfBirth)
                        : null,
                    })
                  }}
                  style={{
                    padding: '10px 20px',
                    color: '#fff',
                    background: '#e53935',
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px 80px' }}>
              <p>
                <strong>Bạn là {roleMapping[currentUser?.role] || ''}</strong>
              </p>
              <p
                className='mt-4 flex'
                style={{ justifyContent: 'space-between' }}
              >
                <span style={{ display: 'inline-block', width: '150px' }}>
                  Họ:
                </span>
                <span>{currentUser?.lastName}</span>
              </p>
              <p
                className='mt-4 flex'
                style={{ justifyContent: 'space-between' }}
              >
                <span style={{ display: 'inline-block', width: '150px' }}>
                  Tên:
                </span>
                <span>{currentUser?.firstName}</span>
              </p>
              <p
                className='mt-4 flex'
                style={{ justifyContent: 'space-between' }}
              >
                <span style={{ display: 'inline-block', width: '150px' }}>
                  Email:
                </span>
                <span>{currentUser?.email}</span>
              </p>
              <p
                className='mt-4 flex'
                style={{ justifyContent: 'space-between' }}
              >
                <span style={{ display: 'inline-block', width: '150px' }}>
                  Địa chỉ:
                </span>
                <span>{currentUser?.address || ''}</span>
              </p>
              <p
                className='mt-4 flex'
                style={{ justifyContent: 'space-between' }}
              >
                <span style={{ display: 'inline-block', width: '150px' }}>
                  Ngày sinh:
                </span>
                <span>
                  {currentUser?.dateOfBirth
                    ? moment(currentUser.dateOfBirth).format('DD-MM-YYYY')
                    : ''}
                </span>
              </p>
              <p
                className='mt-4 flex'
                style={{ justifyContent: 'space-between' }}
              >
                <span style={{ display: 'inline-block', width: '150px' }}>
                  Điểm đánh giá:
                </span>
                <span>
                  {currentUser?.rateTotal || 0} (+
                  {currentUser?.rateIncrease || 0}, -
                  {currentUser?.rateDecrease || 0})
                </span>
              </p>

              <button
                onClick={onOpenEdit}
                className='text-center mt-4'
                style={{
                  background: '#1e88e5',
                  color: '#fff',
                  width: '100%',
                  padding: '10px',
                }}
                type='button'
              >
                Cập nhật thông tin
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
