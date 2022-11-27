import React, { useEffect } from 'react'
import DashboardComponent from '../../components/Dashboard/Dashboard'
import {
  Button,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material'
import { clearInfos, clearTemplates } from '../../store/action/Actions'
import store, { RootState } from '../../store'
import { InfoData } from '../../interface'
import { useSnackbar } from 'notistack'
import { useSelector } from 'react-redux'
import { Get } from '../../api/Info'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { restfulApiConfig } from '../../api/Config'
import { StyledCardRoot3, StyledTypographyTitle } from '../../style'

export default function Dashboard() {
  const [data, setData] = React.useState<InfoData>()
  const infos = useSelector((state: RootState) => state.infos)
  const templates = useSelector((state: RootState) => state.templates)
  const navigate = useNavigate()
  const [status, setStatus] = React.useState(3)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    // info
    const length = infos.length
    const tmpData = infos[length - 1]

    if (tmpData.error !== undefined || tmpData.data != null) {
      if (tmpData.error !== undefined) {
        if (tmpData.error?.indexOf('[401]') !== -1) {
          Cookies.remove('user_token')
          Cookies.remove('access_token')
          store.dispatch(clearInfos())
          store.dispatch(clearTemplates())
          enqueueSnackbar(tmpData.error, { variant: 'error' })
          navigate('/login')
        } else {
          enqueueSnackbar(tmpData.error, { variant: 'error' })
        }
      } else if (tmpData.data != null) {
        setData(tmpData.data)
        // add group
        if (tmpData.data.user?.group_id === 0) {
          setStatus(0)
        } else if (tmpData.data.group?.add_allow) {
          setStatus(1)
        } else {
          if (tmpData.data.service != null) {
            let addAllow = false
            for (const tmpService of tmpData.data.service) {
              if (tmpService.add_allow) {
                addAllow = true
                break
              }
            }
            if (addAllow) {
              setStatus(2)
            }
          } else {
            setStatus(3)
          }
        }
      }
    } else {
      Get().then()
      const date = new Date()
      enqueueSnackbar('Info情報の更新: ' + date.toLocaleString(), {
        variant: 'info',
      })
    }

    // template
  }, [infos, templates])

  const getStringFromDate = (before: string): string => {
    let str = '無期限'
    if (!before.match(/9999-12-31/)) {
      const date = new Date(Date.parse(before))
      str =
        date.getFullYear() +
        '-' +
        ('0' + (1 + date.getMonth())).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2) +
        ' ' +
        ('0' + date.getHours()).slice(-2) +
        ':' +
        ('0' + date.getMinutes()).slice(-2) +
        ':' +
        ('0' + date.getSeconds()).slice(-2)
    }
    return str
  }

  const moveAddPage = () => {
    navigate('/dashboard/add')
  }

  const movePaymentPage = () => {
    navigate('/dashboard/payment')
  }

  return (
    <DashboardComponent title="Dashboard">
      <Grid container spacing={3}>
        <Grid item xs={8}>
          {restfulApiConfig.enableMoney &&
            data?.group?.is_expired &&
            !data?.info?.length && (
              <StyledCardRoot3 key={'payment_notice'}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    会費のお支払いについて
                  </Typography>
                  <StyledTypographyTitle color="textSecondary" gutterBottom>
                    <Chip label="重要" color="secondary" />
                  </StyledTypographyTitle>
                  <h3>
                    開通処理が完了致しましたので、会費のお支払いをお願いいたします。
                  </h3>
                  <h3>
                    （開通処理後に1週間以内に支払いが行われない場合は、未開通処理を行います。）
                  </h3>
                  <br />
                  以下の「会費のお支払いはこちらから」ボタンより手続きを進めてください
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={movePaymentPage}
                  >
                    会費のお支払いはこちらから
                  </Button>
                </CardActions>
              </StyledCardRoot3>
            )}
          {status !== 3 && (
            <StyledCardRoot3 key={'add_notice'}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  申請手続きのお知らせ
                </Typography>
                <StyledTypographyTitle color="textSecondary" gutterBottom>
                  <Chip label="重要" color="secondary" />
                </StyledTypographyTitle>
                <br />
                以下の「申請ページはこちら」ボタンより手続きを進めてください
              </CardContent>
              <CardActions>
                <Button size="small" variant="outlined" onClick={moveAddPage}>
                  申請ページはこちら
                </Button>
              </CardActions>
            </StyledCardRoot3>
          )}
          {data?.notice?.map((notice, index) => (
            <StyledCardRoot3 key={index}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {notice.title}
                </Typography>
                <StyledTypographyTitle color="textSecondary" gutterBottom>
                  ({getStringFromDate(notice.start_time)} -{' '}
                  {getStringFromDate(notice.end_time)})
                </StyledTypographyTitle>
                <StyledTypographyTitle color="textSecondary" gutterBottom>
                  {notice.info && <Chip label="情報" color="primary" />}
                  {notice.important && <Chip label="重要" color="secondary" />}
                  {notice.fault && <Chip label="障害" color="secondary" />}
                </StyledTypographyTitle>
                <br />
                {notice.data}
              </CardContent>
              <CardActions>
                {/*<Button color="secondary" size="small" variant="outlined"*/}
                {/*        onClick={() => noticeDelete(notice.ID)}>*/}
                {/*    Delete*/}
                {/*</Button>*/}
              </CardActions>
            </StyledCardRoot3>
          ))}
        </Grid>
        <Grid item xs={4}>
          {restfulApiConfig.enableMoney && (
            <StyledCardRoot3 key={'student'}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  会員情報
                </Typography>
                <StyledTypographyTitle color="textSecondary" gutterBottom>
                  <h3>会員種別: {data?.group?.member_type}</h3>
                  {data?.group?.member_expired != null && (
                    <h3>
                      失効期限:{' '}
                      {data?.group?.member_expired.split('T')[0] ?? '---'}
                    </h3>
                  )}
                  {data?.group?.is_expired && (
                    <h2 color={'secondary'}>期限切れ</h2>
                  )}
                </StyledTypographyTitle>
                <br />
                {data?.group?.is_expired && data?.info?.length == null && (
                  <div>
                    <h3>開通処理後に、会費の支払いをお願いいたします。</h3>
                    <Chip size="small" color={'secondary'} label="未払い" />
                  </div>
                )}
                {data?.group?.is_expired && data?.info?.length != null && (
                  <div>
                    <h3>支払い手続きを行ってください。</h3>
                    <Chip size="small" color={'secondary'} label="未払い" />
                  </div>
                )}
              </CardContent>
            </StyledCardRoot3>
          )}
          {/*<Button onClick={() => test1()}>Test1</Button>*/}
          {/*<Button onClick={() => test2()}>Test2</Button>*/}
        </Grid>
      </Grid>
    </DashboardComponent>
  )
}
