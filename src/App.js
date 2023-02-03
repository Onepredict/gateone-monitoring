import axios from 'axios'
import './common.scss'
import { useEffect, useState, useRef } from 'react'
import { Layout, Row, Col, Modal, Select, Radio, Checkbox, Spin, Button, Descriptions, Tag, Divider, Space, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import swal from 'sweetalert'
import { IP_ADDRESS } from './propoties'
const { Content } = Layout

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

  const [reserve1, setReserve1] = useState(false)
  const [reserve2, setReserve2] = useState(false)
  const [reserve3, setReserve3] = useState(false)

  const [isReserve, setIsReserve] = useState(false)
  const [isReserve1, setIsReserve1] = useState(false)
  const [isReserve2, setIsReserve2] = useState(false)
  const [isReserve3, setIsReserve3] = useState(false)

  const [button1, setButton1] = useState(false)
  const [button2, setButton2] = useState(false)
  const [button3, setButton3] = useState(false)

  const [return1, setReturn1] = useState(false)
  const [return2, setReturn2] = useState(false)
  const [return3, setReturn3] = useState(false)

  const reserve1Ref = useRef()
  const reserve2Ref = useRef()
  const reserve3Ref = useRef()

  const [serverCheckedList, setServerCheckedList] = useState([])
  const [ipcCheckedList, setIpcCheckedList] = useState([])

  const [data, setData] = useState()
  const selectReserved = async () => {
    await axios.get(IP_ADDRESS + '/reserved').then((response) => {
      resetDisabled()
      setData(response.data)
    })
  }

  const selectUsers = async () => {
    await axios.get(IP_ADDRESS + '/users').then((response) => {
      const result = response.data.sort((a, b) => {
        return a['label'] < b['label'] ? -1 : a['label'] > b['label'] ? 1 : 0
      })
      setUsers(result)
    })
  }

  const returnReserved = async (id) => {
    await axios
      .put(IP_ADDRESS + '/reserved/' + id, {
        id: id,
        account: '',
        user: '',
        server: [],
        pic: [],
      })
      .then((response) => {
        selectReserved()
      })
  }

  const saveUser = async (formData) => {
    await axios.post(IP_ADDRESS + '/users/', formData).then((response) => {
      selectUsers()
      setNewName('')
    })
  }

  const resetReserved = () => {
    setReserve1(false)
    setReserve2(false)
    setReserve3(false)
    setIsReserve(false)
    setIsReserve1(false)
    setIsReserve2(false)
    setIsReserve3(false)
    setServerCheckedList([])
    setIpcCheckedList([])
    setAccountChecked(null)
    reserve1Ref.current.style.borderColor = 'var(--ds-surface-sunken,#FFE380)'
    reserve2Ref.current.style.borderColor = 'var(--ds-surface-sunken,#FFE380)'
    reserve3Ref.current.style.borderColor = 'var(--ds-surface-sunken,#FFE380)'
    setFormData({
      id: '',
      account: '',
      user: userName,
      server: [],
      ipc: [],
    })
  }

  const saveReserved = async () => {
    const id = formData.id
    await axios.put(IP_ADDRESS + '/reserved/' + id, formData).then((response) => {
      selectReserved()
      resetReserved()
    })
  }

  const [users, setUsers] = useState()

  useEffect(() => {
    const name = sessionStorage.getItem('user')
    if (name) {
      formData.user = name
      setFormData(formData)
      setUserName(name)
    } else {
      setOpenModal(true)
    }
    selectReserved()
    selectUsers()
  }, [])

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

  const checkSoldout = () => {
    let opsSoldout = true
    let serverSoldout = true
    let ipcSoldout = true
    for (let op in ops) {
      if (ops[op] === false) opsSoldout = false
    }
    if (opsSoldout) return opsSoldout
    for (let server in servers) {
      if (servers[server] === false) serverSoldout = false
    }
    if (serverSoldout) return serverSoldout
    for (let ipc in ipcs) {
      if (ipcs[ipc] === false) ipcSoldout = false
    }
    if (ipcSoldout) return ipcSoldout
    return false
  }

  const [soldout, setSoldout] = useState(false)

  useEffect(() => {
    data?.map((v, i) => {
      if (v.user !== '') {
        if (i === 0) setReserve1(true)
        if (i === 1) setReserve2(true)
        if (i === 2) setReserve3(true)
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

    if (checkSoldout()) {
      setSoldout(true)
    } else {
      setSoldout(false)
    }
  }, [data])

  const handleModal = () => {
    setOpenModal(true)
    setClosable(true)
  }

  const closeModal = () => {
    setOpenModal(false)
    setClosable(false)
  }

  const handleUser = (value) => {
    setOpenModal(false)
    setUserName(value)
    formData.user = value
    sessionStorage.setItem('user', value)
  }

  const serverItems = [
    {
      label: 'SERVER1',
      value: 'server1',
      disabled: servers.server1,
    },
    {
      label: 'SERVER2',
      value: 'server2',
      disabled: servers.server2,
    },
    {
      label: 'SERVER3',
      value: 'server3',
      disabled: servers.server3,
    },
    {
      label: 'SERVER4',
      value: 'server4',
      disabled: servers.server4,
    },
    {
      label: 'SERVER5',
      value: 'server5',
      disabled: servers.server5,
    },
    {
      label: 'SERVER6',
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

  const [accountChecked, setAccountChecked] = useState(null)

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
      alert('컨테이너 선택을 확인해 주세요')
      return
    }
    if (formData.user === '') {
      alert('사용자를 확인해 주세요')
      return
    }
    if (formData.account === '') {
      alert('계정 정보를 확인해 주세요')
      return
    }
    if (formData.server.length === 0) {
      alert('서버 정보를 확인해 주세요')
      return
    }
    swal({
      title: '계정을 사용하시겠습니까?',
      buttons: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal('등록이 완료됐습니다..', {
          icon: 'success',
        })
        saveReserved()
      } else {
        swal('등록이 취소됐습니다.')
      }
    })
  }

  const handleMouserOver1 = (value) => {
    reserve1 ? setReturn1(true) : !isReserve1 ? setButton1(true) : setButton1(false)
  }

  const handleMouserOut1 = (value) => {
    reserve1 ? setReturn1(false) : setButton1(false)
  }

  const handleMouserOver2 = (value) => {
    reserve2 ? setReturn2(true) : !isReserve2 ? setButton2(true) : setButton2(false)
  }

  const handleMouserOut2 = (value) => {
    reserve2 ? setReturn2(false) : setButton2(false)
  }

  const handleMouserOver3 = (value) => {
    reserve3 ? setReturn3(true) : !isReserve3 ? setButton3(true) : setButton3(false)
  }

  const handleMouserOut3 = (value) => {
    reserve3 ? setReturn3(false) : setButton3(false)
  }

  const handleReserve1 = () => {
    if (reserve1) {
      if (data && userName === data[0].user) {
        swal({
          title: '계정을 반납하시겠습니까?',
          icon: 'warning',
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            swal('반납이 완료됐습니다.', {
              icon: 'success',
            })
            setReserve1(false)
            setReturn1(false)
            setIsReserve1(false)
            returnReserved(1)
          } else {
            swal('반납이 취소됐습니다.')
          }
        })
      }
    } else {
      if (soldout) return
      formData.id = 1
      reserve1Ref.current.style.borderColor = '#4096ff'
      reserve2Ref.current.style.borderColor = 'var(--ds-surface-sunken,#FFE380)'
      reserve3Ref.current.style.borderColor = 'var(--ds-surface-sunken,#FFE380)'
      setIsReserve(true)
      setIsReserve1(true)
      setIsReserve2(false)
      setIsReserve3(false)
      setButton1(false)
    }
  }

  const handleReserve2 = () => {
    if (reserve2) {
      if (data && userName === data[1].user) {
        swal({
          title: '계정을 반납하시겠습니까?',
          icon: 'warning',
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            swal('반납이 완료됐습니다.', {
              icon: 'success',
            })
            setReserve2(false)
            setReturn2(false)
            setIsReserve2(false)
            returnReserved(2)
          } else {
            swal('반납이 취소됐습니다.')
          }
        })
      }
    } else {
      if (soldout) return
      formData.id = 2
      reserve1Ref.current.style.borderColor = 'var(--ds-surface-sunken,#FFE380)'
      reserve2Ref.current.style.borderColor = '#4096ff'
      reserve3Ref.current.style.borderColor = 'var(--ds-surface-sunken,#FFE380)'
      setIsReserve(true)
      setIsReserve1(false)
      setIsReserve2(true)
      setIsReserve3(false)
      setButton2(false)
    }
  }

  const handleReserve3 = () => {
    if (reserve3) {
      if (data && userName === data[2].user) {
        swal({
          title: '계정을 반납하시겠습니까?',
          icon: 'warning',
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            swal('반납이 완료됐습니다.', {
              icon: 'success',
            })
            setReserve3(false)
            setReturn3(false)
            setIsReserve3(false)
            returnReserved(3)
          } else {
            swal('반납이 취소됐습니다.')
          }
        })
      }
    } else {
      if (soldout) return
      formData.id = 3
      reserve1Ref.current.style.borderColor = 'var(--ds-surface-sunken,#FFE380)'
      reserve2Ref.current.style.borderColor = 'var(--ds-surface-sunken,#FFE380)'
      reserve3Ref.current.style.borderColor = '#4096ff'
      setIsReserve(true)
      setIsReserve1(false)
      setIsReserve2(false)
      setIsReserve3(true)
      setButton3(false)
    }
  }

  const handleSpin = () => {
    if (!isReserve) alert('컨테이너를 선택해 주세요')
  }

  const [newName, setNewName] = useState('')
  const inputRef = useRef(null)
  const onNameChange = (event) => {
    setNewName(event.target.value)
  }
  const addItem = (e) => {
    e.preventDefault()
    setUsers([...users, { value: newName, label: newName }])
    saveUser({ value: newName, label: newName })
  }

  return (
    <div className="App" style={{ width: '100%', height: '100%', background: 'white', overflow: 'hidden' }}>
      <Layout>
        <Content style={{ height: '100%' }}>
          <Row style={{ height: '100vh' }}>
            <Col flex={8} style={{ background: 'white', height: '100%' }}>
              <div
                style={{
                  height: '30%',
                  margin: '20px',
                  background: 'var(--ds-surface-sunken,#FFE380)',
                  borderRadius: '30px',
                  border: '4px solid var(--ds-surface-sunken,#FFE380)',
                }}
                onMouseOver={handleMouserOver1}
                onMouseOut={handleMouserOut1}
                onClick={handleReserve1}
                ref={reserve1Ref}
              >
                {data && data[0].user !== '' ? (
                  <div className="content">
                    <Descriptions
                      bordered
                      contentStyle={{ fontSize: '25px', fontWeight: 600 }}
                      labelStyle={{ fontSize: '25px', width: '160px', maxWidth: '160px', minWidth: '70px', fontWeight: 600 }}
                      size={'middle'}
                    >
                      <Descriptions.Item label="사용자" span={1}>
                        {data[0].user}
                      </Descriptions.Item>
                      <Descriptions.Item label="계정" span={2}>
                        {String(data[0].account).toUpperCase()}
                      </Descriptions.Item>
                      <Descriptions.Item label="서버" span={3}>
                        {data[0].server.map((v) => {
                          return (
                            <Tag color="#f50" style={{ fontSize: '25px', padding: '10px' }}>
                              {v.toUpperCase()}
                            </Tag>
                          )
                        })}
                      </Descriptions.Item>
                      <Descriptions.Item label="IPC" span={3}>
                        {data[0].ipc.map((v) => {
                          return (
                            <Tag color="#108ee9" style={{ fontSize: '25px', padding: '10px' }}>
                              {v.toUpperCase()}
                            </Tag>
                          )
                        })}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                ) : null}
                {soldout && !reserve1 ? (
                  <div className="reserve">
                    <div style={{ background: 'red', color: 'white' }}>등록 불가</div>
                  </div>
                ) : null}
                {!soldout && button1 ? (
                  <div className="reserve reserve1">
                    {/* <Button type="primary" shape="round" size={'large'}>
                      등록
                    </Button> */}
                    <div>신규 등록</div>
                  </div>
                ) : null}
                {data && userName === data[0].user && return1 ? (
                  <div className="reserve return1">
                    <div style={{ background: 'black', color: 'white' }}>반환</div>
                  </div>
                ) : null}
              </div>
              <div
                style={{
                  height: '30%',
                  margin: '20px',
                  background: 'var(--ds-surface-sunken,#FFE380)',
                  borderRadius: '30px',
                  border: '4px solid var(--ds-surface-sunken,#FFE380)',
                }}
                onMouseOver={handleMouserOver2}
                onMouseOut={handleMouserOut2}
                onClick={handleReserve2}
                ref={reserve2Ref}
              >
                {data && data[1].user !== '' ? (
                  <div className="content">
                    <Descriptions
                      bordered
                      contentStyle={{ fontSize: '25px', fontWeight: 600 }}
                      labelStyle={{ fontSize: '25px', width: '160px', maxWidth: '160px', minWidth: '70px', fontWeight: 600 }}
                      size={'middle'}
                    >
                      <Descriptions.Item label="사용자" span={2}>
                        {data[1].user}
                      </Descriptions.Item>
                      <Descriptions.Item label="계정" span={2}>
                        {String(data[1].account).toUpperCase()}
                      </Descriptions.Item>
                      <Descriptions.Item label="서버" span={4}>
                        {data[1].server.map((v) => {
                          return (
                            <Tag color="#f50" style={{ fontSize: '25px', padding: '10px' }}>
                              {v.toUpperCase()}
                            </Tag>
                          )
                        })}
                      </Descriptions.Item>
                      <Descriptions.Item label="IPC" span={4}>
                        {data[1].ipc.map((v) => {
                          return (
                            <Tag color="#108ee9" style={{ fontSize: '25px', padding: '10px' }}>
                              {v.toUpperCase()}
                            </Tag>
                          )
                        })}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                ) : null}
                {soldout && !reserve2 ? (
                  <div className="reserve">
                    <div style={{ background: 'red', color: 'white' }}>등록 불가</div>
                  </div>
                ) : null}
                {!soldout && button2 ? (
                  <div className="reserve reserve2">
                    <div>신규 등록</div>
                  </div>
                ) : null}
                {data && userName === data[1].user && return2 ? (
                  <div className="reserve return2">
                    <div style={{ background: 'black', color: 'white' }}>반환</div>
                  </div>
                ) : null}
              </div>
              <div
                style={{
                  height: '30%',
                  margin: '20px',
                  background: 'var(--ds-surface-sunken,#FFE380)',
                  borderRadius: '30px',
                  border: '4px solid var(--ds-surface-sunken,#FFE380)',
                }}
                onMouseOver={handleMouserOver3}
                onMouseOut={handleMouserOut3}
                onClick={handleReserve3}
                ref={reserve3Ref}
              >
                {data && data[2].user !== '' ? (
                  <div className="content">
                    <Descriptions
                      bordered
                      labelStyle={{ fontSize: '25px', width: '160px', maxWidth: '160px', minWidth: '70px', fontWeight: 600 }}
                      contentStyle={{ fontSize: '25px', fontWeight: 600 }}
                      size={'middle'}
                    >
                      <Descriptions.Item label="사용자" span={1}>
                        {data[2].user}
                      </Descriptions.Item>
                      <Descriptions.Item label="계정" span={2}>
                        {String(data[2].account).toUpperCase()}
                      </Descriptions.Item>
                      <Descriptions.Item label="서버" span={3}>
                        {data[2].server.map((v) => {
                          return (
                            <Tag color="#f50" style={{ fontSize: '25px', padding: '10px' }}>
                              {v.toUpperCase()}
                            </Tag>
                          )
                        })}
                      </Descriptions.Item>
                      <Descriptions.Item label="IPC" span={3}>
                        {data[2].ipc.map((v) => {
                          return (
                            <Tag color="#108ee9" style={{ fontSize: '25px', padding: '10px' }}>
                              {v.toUpperCase()}
                            </Tag>
                          )
                        })}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                ) : null}
                {soldout && !reserve3 ? (
                  <div className="reserve">
                    <div style={{ background: 'red', color: 'white' }}>등록 불가</div>
                  </div>
                ) : null}
                {!soldout && button3 ? (
                  <div className="reserve reserve3">
                    <div>신규 등록</div>
                  </div>
                ) : null}
                {data && userName === data[2].user && return3 ? (
                  <div className="reserve return3">
                    <div style={{ background: 'black', color: 'white' }}>반환</div>
                  </div>
                ) : null}
              </div>
            </Col>

            <Col flex={2} style={{ padding: '50px', gap: '20px', display: 'flex', flexDirection: 'column', maxWidth: '700px' }}>
              <div style={{ fontSize: '20px' }}>
                <span className="user-settings" onClick={handleModal} style={{ fontSize: '40px', fontWeight: 600 }}>
                  {userName}
                </span>
                님 안녕하세요.
              </div>
              <Spin spinning={!isReserve} onClick={handleSpin}>
                <div style={{ marginTop: '10px', background: 'lightblue', padding: '20px', borderRadius: '10px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>계정 선택</span>
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
              <Spin spinning={!isReserve} onClick={handleSpin}>
                <div className="serverGroup" style={{ marginTop: '20px', background: 'coral', padding: '20px', borderRadius: '10px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>서버 선택</span>
                  </div>
                  <Checkbox.Group value={serverCheckedList} onChange={handleServer}>
                    <Row gutter={[16, 16]}>
                      {serverItems.map((v, i) => {
                        return (
                          <Col span={8}>
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
              <Spin spinning={!isReserve} onClick={handleSpin}>
                <div className="ipcGroup" style={{ marginTop: '20px', background: '#FFB75C', padding: '20px', borderRadius: '10px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>IPC 선택</span>
                  </div>
                  <Checkbox.Group options={ipcItems} value={ipcCheckedList} onChange={handleIpc} />
                </div>
              </Spin>
              <Spin spinning={!isReserve} onClick={handleSpin}>
                <Button
                  size="large"
                  type="primary"
                  block
                  style={{
                    marginTop: '20px',
                    height: '60px',
                    fontSize: '20px',
                    fontWeight: 600,
                  }}
                  onClick={handleReserveAction}
                >
                  등록
                </Button>
              </Spin>
            </Col>
          </Row>
        </Content>

        <Modal open={openModal} footer={null} onCancel={closeModal} closable={closable} maskClosable={false} width={400}>
          <div>사용자 선택</div>
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
                  <Input placeholder="Please enter item" ref={inputRef} value={newName} onChange={onNameChange} />
                  <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
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
