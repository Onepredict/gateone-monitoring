import { Layout, Spin, Menu } from 'antd'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import swal from 'sweetalert'
import { PlusOutlined, PlusCircleOutlined, FileExcelOutlined, HomeOutlined, MonitorOutlined } from '@ant-design/icons'
const { Content, Sider } = Layout

function App() {
  const [collapsed, setCollapsed] = useState(true)
  const handleCollapesd = (value) => {
    setCollapsed(value)
  }

  const items = [
    getItem(
      <Link key={'home'} href={'/'} legacyBehavior>
        <a onClick={() => handleLink(true, 'home')}>{'HOME'}</a>
      </Link>,
      'HOME',
      <HomeOutlined />
    ),
    getItem(
      <Link key={'gateone'} href={'/gateone'} legacyBehavior>
        <a onClick={() => handleLink(true, 'gateone')}>{'GATE ONE'}</a>
      </Link>,
      'GATE ONE',
      <MonitorOutlined />
    ),
    getItem(
      <Link key={'timesheet'} href={'/timesheet'} legacyBehavior>
        <a onClick={() => handleLink(true, 'timesheet')}>{'TIME SHEET'}</a>
      </Link>,
      'TIME SHEET',
      <FileExcelOutlined />
    ),
  ]

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    }
  }

  const [selectMenu, setSelectMenu] = useState('TIME SHEET')

  const handleMenu = (item) => {
    const key = item.key
    setSelectMenu(key)
  }

  const bgSpinRef = useRef()
  const [loading, setLoading] = useState(false)

  const handleLink = (flag, page) => {
    if (page === 'timesheet') return
    if (flag) {
      bgSpinRef.current.style.display = 'block'
      setLoading(true)
    } else {
      swalAlert('서비스 준비중입니다.')
    }
  }

  return (
    <div className="gateone" style={{ width: '100%', height: '100vh', background: 'white', overflow: 'hidden' }}>
      <Layout style={{ height: '100%' }}>
        <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => handleCollapesd(value)} style={{ style: '#192034' }}>
          <div
            style={{
              height: 32,
              margin: 16,
              color: 'black',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: '600',
            }}
          >
            <Image src="/onpredict-logo.png" alt="LOGO" width={32} height={32}></Image>
          </div>
          <Menu theme="light" mode="inline" selectedKeys={selectMenu} items={items} onClick={handleMenu} />
        </Sider>
        <div className="bg-span-box" ref={bgSpinRef}>
          <Spin className="bg-spin" tip="Loading..." size="large" spinning={loading}></Spin>
        </div>
        <Content style={{ height: '100%' }}>
          <div className="iframe-box">
            <iframe src="http://timesheet.onepredict.com/" width="100%" height="100%" scrolling="no" hspace="100"></iframe>
          </div>
        </Content>
      </Layout>
    </div>
  )
}

export default App
