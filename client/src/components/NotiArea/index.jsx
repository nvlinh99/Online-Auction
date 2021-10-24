import { useCallback, useEffect, useState } from 'react'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import CircleIcon from '@mui/icons-material/Circle'
import * as socketService from 'services/socket-service'
import * as notiApi from 'services/notiApi'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from 'store/user/selector'
import { NOTI_TYPE } from 'constants/notiConstants'
import numeral from 'numeral'
import './index.css'
import moment from 'moment'

const NotiArea = ({}) => {
  const [notiList, setNotiList] = useState([])
  const [nNewNoti, setNNewNoti] = useState(0)
  const [show, setShow] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    ;(async () => {
      try {
        const { succeeded, data } = await notiApi.getNotiList(1)
        if (succeeded) {
          setNotiList(data.notiList)
        }
      } catch (err) {}
    })()
  }, [])
  useEffect(() => {
    const socket = socketService.subNewNoti({
      userId: currentUser.id,
      cb: (data) => {
        setNNewNoti((n) => n + 1)
        setNotiList((preList) => [data.noti, ...preList])
      },
    })

    return socket.disconnect
  }, [currentUser.id])
  const onToggleNotiList = useCallback(() => {
    if (!show) setNNewNoti(0)
    setShow((s) => !s)
  }, [])
  const onLoadMore = useCallback(
    async (e) => {
      e.stopPropagation()
      try {
        const { succeeded, data } = await notiApi.getNotiList(currentPage + 1)
        if (succeeded) {
          setNotiList((preList) => [...preList, ...data.notiList])
        }
        // eslint-disable-next-line no-empty
      } catch (err) {
      } finally {
        setCurrentPage((p) => p + 1)
      }
    },
    [currentPage]
  )
  const onReadNoti = (id) => (e) => {
    e.stopPropagation()
    setNotiList((list) => {
      return list.map((item) => {
        if (item.id === id)
          return {
            ...item,
            read: true,
          }
        else return { ...item }
      })
    })
    notiApi.readNoti(id)
  }
  return (
    <button
      onClick={onToggleNotiList}
      style={{
        padding: '10px',
        marginRight: '20px',
        position: 'relative',
      }}
    >
      <NotificationsActiveIcon />
      {show && (
        <ul
          style={{
            overflowY: 'scroll',
            maxHeight: '680px',
            position: 'absolute',
            top: '80px',
            width: 'max-content',
            transform: 'translateX(-50%)',
            background: '#fff',
            borderRadius: '10px',
            color: '#333',
            zIndex: '99',
            paddingTop: '20px',
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              transform: 'rotate(45deg)',
              left: '50%',
              width: '30px',
              height: '30px',
              background: '#fff',
              boxShadow: 'rgba(0, 0, 0, 0.35) -5px -5px 5px',
            }}
          ></div>
          {notiList?.length ? (
            [
              notiList.map((noti) => {
                return (
                  <li
                    onClick={onReadNoti(noti.id)}
                    className='noti-item'
                    style={{
                      padding: '20px 20px 20px 20px',
                      fontSize: '16px',
                      textAlign: 'left',
                      color: noti.read ? '#999' : '#333',
                    }}
                    key={noti.id}
                  >
                    <p
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      {noti.title}
                      <CircleIcon
                        fontSize='small'
                        style={{
                          visibility: noti.read ? 'hidden' : 'visible',
                          marginLeft: '15px',
                          transform: 'translateY(-2px)',
                          color: 'rgb(38, 149, 255)',
                        }}
                      />
                    </p>
                    <p className='mb-2'>
                      {moment(noti.createdAt).format('hh:mm DD/MM/YYYY')}
                    </p>
                    {[
                      NOTI_TYPE.SELLER_NEW_BID,
                      NOTI_TYPE.BIDER_NEW_BID,
                    ].includes(noti.type) && (
                      <div style={{ textAlign: 'left', paddingLeft: '20px' }}>
                        <p>Tên sản phâm: {noti.data.productName}</p>
                        <p>Nguời đấu giá: {noti.data.biderName}</p>
                        <p>
                          giá: {numeral(noti.data.bidPrice).format('0,0')} VND
                        </p>
                      </div>
                    )}
                  </li>
                )
              }),
              <button
                onClick={onLoadMore}
                style={{
                  background: 'rgb(38, 149, 255)',
                  color: '#fff',
                  width: '70%',
                  padding: '10px',
                  margin: '20px',
                }}
                key='loadMoreBtn'
              >
                Tải thêm
              </button>,
            ]
          ) : (
            <p>Không có thông báo nào</p>
          )}
        </ul>
      )}

      {nNewNoti > 0 && (
        <div
          style={{
            color: '#fff',
            background: 'red',
            width: '25px',
            height: '30px',
            borderRadius: '50%',
            position: 'absolute',
            right: '0px',
            bottom: '0px',
          }}
        >
          {nNewNoti}
        </div>
      )}
    </button>
  )
}
export default NotiArea
