import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import {
  Layout,
  Row,
  Col,
  Modal,
  Select,
  Radio,
  Checkbox,
  Spin,
  Button,
  Descriptions,
  Tag,
  Divider,
  Space,
  Input,
  Skeleton,
  Menu,
} from 'antd'
import { PlusOutlined, PlusCircleOutlined, FileExcelOutlined, HomeOutlined, MonitorOutlined } from '@ant-design/icons'
import swal from 'sweetalert'
import { IP_ADDRESS } from './propoties'
const { Content, Sider } = Layout

const servers = {
  server1: false,
  server2: false,
  server3: false,
  server4: false,
  server5: false,
  server6: false,
}

const ipcs = {
  lam13: false,
  lam14: false,
  lam15: false,
  pkg: false,
  stk: false,
}

const ops = {
  op1: false,
  op2: false,
  op3: false,
}

function App() {
  const serverItems = [
    {
      label: 'CELL3-1F(G)',
      value: 'server1',
      disabled: servers.server1,
    },
    {
      label: 'CELL3-2F(G)',
      value: 'server2',
      disabled: servers.server2,
    },
    {
      label: 'CELL4-1F(G)',
      value: 'server3',
      disabled: servers.server3,
    },
    {
      label: 'CELL3-1F(C)',
      value: 'server4',
      disabled: servers.server4,
    },
    {
      label: 'CELL3-2F(C)',
      value: 'server5',
      disabled: servers.server5,
    },
    {
      label: 'CELL4-2F(C)',
      value: 'server6',
      disabled: servers.server6,
    },
  ]

  const ipcItems = [
    {
      label: 'LAM13',
      value: 'lam13',
      disabled: ipcs.lam13,
    },
    {
      label: 'LAM14',
      value: 'lam14',
      disabled: ipcs.lam14,
    },
    {
      label: 'LAM15',
      value: 'lam15',
      disabled: ipcs.lam15,
    },
    {
      label: 'PKG',
      value: 'pkg',
      disabled: ipcs.pkg,
    },
    {
      label: 'STK',
      value: 'stk',
      disabled: ipcs.stk,
    },
  ]

  const [openModal, setOpenModal] = useState(false)
  const [userName, setUserName] = useState()
  const [closable, setClosable] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    account: '',
    user: '',
    server: [],
    ipc: [],
  })

  const [reserves, setReserves] = useState([])
  const [isReserve, setIsReserve] = useState(false)

  const [serverCheckedList, setServerCheckedList] = useState([])
  const [ipcCheckedList, setIpcCheckedList] = useState([])

  const [data, setData] = useState()
  const [users, setUsers] = useState()
  const [maxId, setMaxId] = useState(0)

  const [isMouseEvent, setIsMouseEvent] = useState()
  const [isCancel, setIsCancel] = useState(false)

  const [accountChecked, setAccountChecked] = useState(null)

  const [collapsed, setCollapsed] = useState(true)

  const [newName, setNewName] = useState('')
  const inputRef = useRef(null)

  const fetcher = async () =>
    await fetch(IP_ADDRESS + '/reserved')
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        swalAlert('????????? ????????? ??????????????????.')
      })
  const { data: useData, mutate } = useSWR(IP_ADDRESS + '/reserved', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnFocus: true,
    refreshInterval: 3000,
  })

  const insertReserve = async () => {
    await axios
      .post(IP_ADDRESS + '/reserved', formData)
      .then((response) => {
        mutate()
        resetReserved()
      })
      .catch((error) => {
        swalAlert('????????? ??????????????????. ?????? ????????? ??????????????????.')
        mutate()
        resetReserved()
      })
  }

  const deleteReserved = async (id) => {
    await axios.delete(IP_ADDRESS + '/reserved/' + id).then((response) => {
      mutate()
    })
  }

  const getUsers = async () => {
    await axios.get(IP_ADDRESS + '/users').then((response) => {
      const result = response.data.sort((a, b) => {
        return a['label'] < b['label'] ? -1 : a['label'] > b['label'] ? 1 : 0
      })
      setUsers(result)
    })
  }

  const insertUser = async (formData) => {
    await axios.post(IP_ADDRESS + '/users/', formData).then((response) => {
      getUsers()
      setNewName('')
    })
  }

  const resetReserved = () => {
    setIsReserve(false)
    setServerCheckedList([])
    setIpcCheckedList([])
    setAccountChecked(null)
    setFormData({
      id: '',
      account: '',
      user: userName,
      server: [],
      ipc: [],
    })
  }

  useEffect(() => {
    const name = sessionStorage.getItem('user')
    if (name) {
      formData.user = name
      setFormData(formData)
      setUserName(name)
    } else {
      setOpenModal(true)
    }
    mutate()
    getUsers()
  }, [])

  useEffect(() => {
    if (!useData) return
    useData.sort((a, b) => b['id'] - a['id'])
    setData(useData)
  }, [useData])

  const [state, setState] = useState(JSON.stringify(ops).concat(JSON.stringify(servers)).concat(JSON.stringify(ipcs)))

  useEffect(() => {
    if (!data) return
    resetDisabled()
    data.map((v, i) => {
      reserves['reserve' + (i + 1)] = false
      if (v.user !== '') {
        reserves['reserve' + (i + 1)] = true
        const account = v.account
        ops[account] = true
        const server = v.server
        server.map((v, i) => {
          return (servers[v] = true)
        })
        const ipc = v.ipc
        ipc.map((v, i) => {
          return (ipcs[v] = true)
        })
      }
      return ''
    })
    setState(JSON.stringify(ops).concat(JSON.stringify(servers)).concat(JSON.stringify(ipcs)))
    data.length > 0 ? setMaxId(data[0]['id']) : setMaxId(0)
  }, [data])

  useEffect(() => {}, [formData, isMouseEvent, state])

  const resetDisabled = () => {
    for (let server in servers) {
      servers[server] = false
    }
    for (let ipc in ipcs) {
      ipcs[ipc] = false
    }
    for (let op in ops) {
      ops[op] = false
    }
  }

  const handleOpenModal = () => {
    setOpenModal(true)
    setClosable(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setClosable(false)
  }

  const handleUser = (value) => {
    setOpenModal(false)
    setUserName(value)
    formData.user = value
    setFormData(formData)
    sessionStorage.setItem('user', value)
  }

  const handleAddReserved = () => {
    if (!checkSoldout()) {
      if (formData && formData.id === '') {
        formData.id = maxId + 1
        setFormData(formData)
        setIsReserve(true)
      }
    } else {
      swalAlert('??????????????? ????????? ????????????.')
    }
  }

  const handleCancelReserve = () => {
    resetReserved()
    formData.id = ''
    setFormData(formData)
    setIsCancel(false)
  }

  const handleAddAreaMouseOver = (e) => {
    e.preventDefault()
    setIsCancel(true)
  }

  const handleAddAreaMouseLeave = (e) => {
    e.preventDefault()
    setIsCancel(false)
  }

  const handleReservedMouseOver = (e, value) => {
    reserves['return' + (value + 1)] = true
    handleMouseEvent(reserves, value)
  }

  const handleReservedMouserLeave = (e, value) => {
    delete reserves['return' + (value + 1)]
    handleMouseEvent(reserves, '')
  }

  const handleMouseEvent = (reserves, value) => {
    setIsMouseEvent(value)
    setReserves(reserves)
  }

  const handleUserAccount = (item) => {
    formData.account = item.target.value
    setAccountChecked(item.target.value)
    setFormData(formData)
  }

  const handleServer = (value) => {
    const result = value.sort((a, b) => {
      return a < b ? -1 : a > b ? 1 : 0
    })
    formData.server = result
    setFormData(formData)
    setServerCheckedList(value)
  }

  const handleIpc = (value) => {
    formData.ipc = value
    setFormData(formData)
    setIpcCheckedList(value)
  }

  const handleReserveAction = () => {
    if (formData.id === '') {
      swalAlert('???????????? ????????? ????????? ?????????')
      return
    }
    if (formData.user === '') {
      swalAlert('???????????? ????????? ?????????')
      return
    }
    if (formData.account === '') {
      swalAlert('?????? ????????? ????????? ?????????')
      return
    }
    swal({
      title: '????????? ?????????????????????????',
      buttons: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal('????????? ??????????????????..', {
          icon: 'success',
        })
        insertReserve()
      } else {
        swal('????????? ??????????????????.')
      }
    })
  }

  const handleReserve = (e, value, id) => {
    e.preventDefault()
    if (data && userName === data[value].user) {
      swal({
        title: '????????? ?????????????????????????',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal('????????? ??????????????????.', {
            icon: 'success',
          })
          deleteReserved(id)
        } else {
          swal('????????? ??????????????????.')
        }
      })
    }
  }

  const handleDirectReserve = () => {
    if (!isReserve) {
      swal({
        text: '?????? ????????? ???????????????.',
        icon: 'info',
        buttons: false,
        timer: 900,
      })
      handleAddReserved()
    }
  }

  const swalAlert = (text) => {
    swal({
      title: text,
      icon: 'warning',
      buttons: '??????',
    })
  }

  const checkSoldout = () => {
    let opsSoldout = true
    for (let op in ops) {
      if (ops[op] === false) opsSoldout = false
    }
    if (opsSoldout) return opsSoldout
    return false
  }

  const handleUserName = (event) => {
    setNewName(event.target.value)
  }

  const addUser = (e) => {
    e.preventDefault()
    setUsers([...users, { value: newName, label: newName }])
    insertUser({ value: newName, label: newName })
  }

  const handleCollapesd = (value) => {
    setCollapsed(value)
  }

  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label,
    }
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

  const [selectMenu, setSelectMenu] = useState('GATE ONE')

  const handleMenu = (item) => {
    const key = item.key
    setSelectMenu(key)
  }

  const bgSpinRef = useRef()
  const [loading, setLoading] = useState(false)

  const handleLink = (flag, page) => {
    if (page === 'gateone') return
    if (flag) {
      bgSpinRef.current.style.display = 'block'
      setLoading(true)
    } else {
      swalAlert('????????? ??????????????????.')
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
          <div className="content">
            <div className="content-box" style={{ minWidth: '1100px' }}>
              <div
                className="content-comp"
                style={{
                  margin: '0 40px 0 20px',
                  background: 'var(--ds-surface-sunken,#FFE380)',
                  borderRadius: '30px',
                  border: '4px solid var(--ds-surface-sunken,#FFE380)',
                  height: '100%',
                }}
              >
                <Row gutter={[24, 32]} style={{ width: '100%' }}>
                  <Col span={8}>
                    <div className="content-data new-data" onClick={handleAddReserved}>
                      <PlusCircleOutlined style={{ color: 'black' }} className="new-icon" />
                    </div>
                  </Col>
                  <>
                    {isReserve || (formData && formData.id !== '' && formData.account === '') ? (
                      <Col span={8}>
                        <div className="content-data" onMouseOver={handleAddAreaMouseOver} onMouseLeave={handleAddAreaMouseLeave}>
                          <Descriptions
                            bordered
                            style={{ height: '100%' }}
                            contentStyle={{ fontSize: '15px', fontWeight: 600 }}
                            labelStyle={{
                              fontSize: '15px',
                              width: '80px',
                              maxWidth: '80px',
                              minWidth: '70px',
                              fontWeight: 600,
                              textAlign: 'center',
                            }}
                            size={'middle'}
                          >
                            <Descriptions.Item label="?????????" span={1} className="description-small">
                              <Skeleton.Input active={true} size={'large'} />
                            </Descriptions.Item>
                            <Descriptions.Item label="??????" span={2} className="description-small">
                              <Skeleton.Input active={true} size={'large'} />
                            </Descriptions.Item>
                            <Descriptions.Item label="??????" span={3} className="description-large">
                              <Skeleton.Input active={true} size={'large'} />
                            </Descriptions.Item>
                            <Descriptions.Item label="IPC" span={3} className="description-large">
                              <Skeleton.Input active={true} size={'large'} />
                            </Descriptions.Item>
                          </Descriptions>
                          {isCancel ? (
                            <div className="reserve" onClick={handleCancelReserve}>
                              <div style={{ background: 'black', color: 'white' }}>??????</div>
                            </div>
                          ) : null}
                        </div>
                      </Col>
                    ) : null}
                    {data && data.length > 0
                      ? data.map((v, i) => {
                          return data[i].user && data[i].user !== '' ? (
                            <Col key={i} span={8}>
                              <div
                                className="content-data"
                                onMouseOver={(event) => handleReservedMouseOver(event, i)}
                                onMouseLeave={(event) => handleReservedMouserLeave(event, i)}
                                onClick={(event) => handleReserve(event, i, data[i]['id'])}
                              >
                                <Descriptions
                                  bordered
                                  style={{ height: '100%' }}
                                  contentStyle={{ fontSize: '15px', fontWeight: 600 }}
                                  labelStyle={{
                                    fontSize: '15px',
                                    width: '80px',
                                    maxWidth: '80px',
                                    minWidth: '70px',
                                    fontWeight: 600,
                                    textAlign: 'center',
                                  }}
                                  size={'middle'}
                                >
                                  <Descriptions.Item label="?????????" span={1}>
                                    {data[i].user}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="??????" span={2}>
                                    {String(data[i].account).toUpperCase()}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="??????" span={3}>
                                    <Row gutter={[8, 8]}>
                                      {data[i].server.map((v, k) => {
                                        return (
                                          <Col key={'server' + k} span={12}>
                                            <Tag
                                              color="#f50"
                                              style={{ fontSize: '13px', padding: '5px', width: '100%', textAlign: 'center' }}
                                            >
                                              {serverItems.map((k) => {
                                                if (k.value === v) {
                                                  return k.label
                                                }
                                              })}
                                            </Tag>
                                          </Col>
                                        )
                                      })}
                                    </Row>
                                  </Descriptions.Item>
                                  <Descriptions.Item label="IPC" span={3}>
                                    <Row gutter={[8, 8]}>
                                      {data[i].ipc.map((v, k) => {
                                        return (
                                          <Col key={'ipc' + k} span={12}>
                                            <Tag
                                              color="#108ee9"
                                              style={{ fontSize: '20px', padding: '5px', width: '100%', textAlign: 'center' }}
                                            >
                                              {v.toUpperCase()}
                                            </Tag>
                                          </Col>
                                        )
                                      })}
                                    </Row>
                                  </Descriptions.Item>
                                </Descriptions>
                                {data && userName === data[i].user && reserves && reserves['return' + (i + 1)] ? (
                                  <div className="reserve">
                                    <div style={{ background: 'black', color: 'white' }}>??????</div>
                                  </div>
                                ) : null}
                              </div>
                            </Col>
                          ) : null
                        })
                      : null}
                  </>
                </Row>
              </div>
            </div>

            <div className="content-box side">
              <div style={{ fontSize: '20px' }}>
                <span className="user-settings" onClick={handleOpenModal} style={{ fontSize: '40px', fontWeight: 600 }}>
                  {userName}
                </span>
                ??? ???????????????.
              </div>
              <div className="content-comp" style={{ background: 'lightblue' }}>
                <Spin spinning={!isReserve} onClick={handleDirectReserve}>
                  <div className="content-item">
                    <div style={{ marginBottom: '15px' }}>
                      <span style={{ fontSize: '20px', fontWeight: '600' }}>?????? ??????</span>
                    </div>
                    <Radio.Group size="large" buttonStyle="solid" onChange={handleUserAccount} value={accountChecked}>
                      <Radio.Button value="op1" disabled={ops.op1} style={{ fontSize: '25px', padding: '0 40px' }}>
                        OP1
                      </Radio.Button>
                      <Radio.Button value="op2" disabled={ops.op2} style={{ fontSize: '25px', padding: '0 40px' }}>
                        OP2
                      </Radio.Button>
                      <Radio.Button value="op3" disabled={ops.op3} style={{ fontSize: '25px', padding: '0 40px' }}>
                        OP3
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </Spin>
              </div>
              <div className="content-comp" style={{ background: 'coral' }}>
                <Spin spinning={!isReserve} onClick={handleDirectReserve}>
                  <div className="content-item">
                    <div style={{ marginBottom: '15px' }}>
                      <span style={{ fontSize: '20px', fontWeight: '600' }}>?????? ??????</span>
                    </div>
                    <Checkbox.Group value={serverCheckedList} onChange={handleServer}>
                      <Row gutter={[16, 16]}>
                        {serverItems.map((v, i) => {
                          return (
                            <Col key={'serverItem' + i} span={8}>
                              <Checkbox key={v.value} value={v.value} disabled={v.disabled}>
                                {v.label}
                              </Checkbox>
                            </Col>
                          )
                        })}
                      </Row>
                    </Checkbox.Group>
                  </div>
                </Spin>
              </div>
              <div className="content-comp" style={{ background: '#FFB75C' }}>
                <Spin spinning={!isReserve} onClick={handleDirectReserve}>
                  <div className="content-item">
                    <div style={{ marginBottom: '15px' }}>
                      <span style={{ fontSize: '20px', fontWeight: '600' }}>IPC ??????</span>
                    </div>
                    <Checkbox.Group value={ipcCheckedList} onChange={handleIpc}>
                      <Row gutter={[16, 16]}>
                        {ipcItems.map((v, i) => {
                          return (
                            <Col key={'ipcItem' + i} span={8}>
                              <Checkbox key={v.value} value={v.value} disabled={v.disabled}>
                                {v.label}
                              </Checkbox>
                            </Col>
                          )
                        })}
                      </Row>
                    </Checkbox.Group>
                  </div>
                </Spin>
              </div>
              <Spin spinning={!isReserve} onClick={handleDirectReserve}>
                <Button
                  size="large"
                  type="primary"
                  block
                  style={{
                    height: '60px',
                    fontSize: '20px',
                    fontWeight: 600,
                  }}
                  onClick={handleReserveAction}
                >
                  ??????
                </Button>
              </Spin>
            </div>
          </div>
        </Content>

        <Modal open={openModal} footer={null} onCancel={handleCloseModal} closable={closable} maskClosable={false} width={400}>
          <div>????????? ??????</div>
          <Select
            showSearch
            style={{
              width: '100%',
              textAlign: 'center',
              marginTop: '10px',
            }}
            onChange={handleUser}
            options={users}
            value={userName}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider
                  style={{
                    margin: '8px 0',
                  }}
                />
                <Space
                  style={{
                    padding: '0 8px 4px',
                  }}
                >
                  <Input placeholder="Please enter item" ref={inputRef} value={newName} onChange={handleUserName} />
                  <Button type="text" icon={<PlusOutlined />} onClick={addUser}>
                    Add item
                  </Button>
                </Space>
              </>
            )}
          />
        </Modal>
      </Layout>
    </div>
  )
}

export default App
