import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { Layout, Row, Col, Card, Spin } from 'antd'
import { CommentOutlined } from '@ant-design/icons'
import swal from 'sweetalert'
import Link from 'next/link'

const { Content, Header } = Layout

const handleQuestionEvent = () => {
  swalAlert('질문하기 기능은 준비중입니다.')
}

const swalAlert = (text) => {
  swal({
    title: text,
    icon: 'warning',
    buttons: '확인',
  })
}

export default function Home() {
  const [loading, setLoading] = useState(false)

  const handleLink = (flag) => {
    if (flag) {
      setLoading(true)
    } else {
      swalAlert('서비스 준비중입니다.')
    }
  }

  return (
    <div className="main">
      <Header style={{ height: '60px', background: '#285aff' }}>
        <Image src="/onpredict.png" alt="LOGO" width={150} height={60} className="logo"></Image>
      </Header>
      <Spin tip="Loading..." size="large" spinning={loading}>
        <Content style={{ height: 'calc(100vh - 60px)' }}>
          <div className="content">
            <div className="content-comp">
              <Row gutter={[60]} style={{ width: '100%', padding: '0 40px' }}>
                <Col span={4}>
                  <Link key={'gateone'} href={'/gateone'} legacyBehavior>
                    <div className="content-item" onClick={() => handleLink(true)}>
                      <Card title="GATE ONE" className="card" loading={false}>
                        <p>동시간 접속 관련</p>
                        <p>혼선을 방지하기 위한</p>
                        <p>내부 사용자 관리 도구</p>
                      </Card>
                    </div>
                  </Link>
                </Col>

                <Col span={4}>
                  <Link key={'timesheet'} href={'http://timesheet.onepredict.com/'} legacyBehavior>
                    <div className="content-item" onClick={() => handleLink(true)}>
                      <Card title="TIME SHEET" className="card" loading={false}>
                        <p>엑셀 입력 및 더존 상신용</p>
                        <p>타임시트 생성 도구</p>
                      </Card>
                    </div>
                  </Link>
                </Col>
                <Col span={4}>
                  <div className="content-item" onClick={() => handleLink(false)}>
                    <Card title="Default size card" className="card" loading={true}>
                      <p>Card content</p>
                      <p>Card content</p>
                      <p>Card content</p>
                    </Card>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="content-item" onClick={() => handleLink(false)}>
                    <Card title="Default size card" className="card" loading={true}>
                      <p>Card content</p>
                      <p>Card content</p>
                      <p>Card content</p>
                    </Card>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="content-item" onClick={() => handleLink(false)}>
                    <Card title="Default size card" className="card" loading={true}>
                      <p>Card content</p>
                      <p>Card content</p>
                      <p>Card content</p>
                    </Card>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="content-item" onClick={() => handleLink(false)}>
                    <Card title="Default size card" className="card" loading={true}>
                      <p>Card content</p>
                      <p>Card content</p>
                      <p>Card content</p>
                    </Card>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="content-comp">
              <Row gutter={[60]} style={{ width: '100%', padding: '0 40px' }}>
                <Col span={4}>
                  <div className="content-item" onClick={() => handleLink(false)}>
                    <Card title="Default size card" className="card" loading={true}>
                      <p>Card content</p>
                      <p>Card content</p>
                      <p>Card content</p>
                    </Card>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="content-item" onClick={() => handleLink(false)}>
                    <Card title="Default size card" className="card" loading={true}>
                      <p>Card content</p>
                      <p>Card content</p>
                      <p>Card content</p>
                    </Card>
                  </div>
                </Col>
                <Col span={4}>
                  <div className="content-item" onClick={() => handleLink(false)}>
                    <Card title="Default size card" className="card" loading={true}>
                      <p>Card content</p>
                      <p>Card content</p>
                      <p>Card content</p>
                    </Card>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="content-comp">
              <Row gutter={[60]} style={{ width: '100%', padding: '0 40px' }}>
                <Col span={4}>
                  <div className="content-item"></div>
                </Col>
              </Row>
            </div>
            <div className="question" title="문의하기" onClick={handleQuestionEvent}>
              <CommentOutlined className="icon" style={{ fontSize: '35px' }} />
            </div>
          </div>
        </Content>
      </Spin>
    </div>
  )
}
