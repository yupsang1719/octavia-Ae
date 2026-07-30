import { useEffect, useState } from 'react'
import axios from 'axios'
import NoticeBanners from './NoticeBanners'
import NoticePopup from './NoticePopup'
import { isDismissed } from '../../utils/noticeDismiss'

export default function Notices() {
  const [notices, setNotices] = useState([])

  useEffect(() => {
    axios.get('/api/notices/active')
      .then(({ data }) => setNotices(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  const banners = notices.filter(n => n.type === 'banner' && !isDismissed(n))
  const popups = notices.filter(n => n.type === 'popup' && !isDismissed(n))

  return (
    <>
      <NoticeBanners notices={banners} />
      <NoticePopup notices={popups} />
    </>
  )
}
