import React, { useEffect } from 'react'
import {
  ThemeProvider,
  CssBaseline,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Menu,
  Fade,
  styled,
  Toolbar,
  CSSObject,
  Theme,
  Box,
  Typography,
  ListItemButton, List,
} from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined'
import TocIcon from '@mui/icons-material/Toc'
import AddIcon from '@mui/icons-material/Add'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import ChatIcon from '@mui/icons-material/Chat'
import FeedbackIcon from '@mui/icons-material/Feedback';
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import PaymentIcon from '@mui/icons-material/Payment'
import {
  StyledDivDashboardRoot,
  StyledDivDashboardToolBarIcon,
  StyledTypographyPageTitle,
} from './styles'
import { useNavigate } from 'react-router-dom'
import { Logout } from '../../api/Auth'
import { Get } from '../../api/Info'
import Cookies from 'js-cookie'
import store from '../../store'
import { clearInfos, clearTemplates } from '../../store/action/Actions'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { restfulApiConfig } from '../../api/Config'
import { muiColorTheme } from '../Theme'
import useMediaQuery from '@mui/material/useMediaQuery';

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  // 大きい画面の時に、drawerを閉じた時に、アイコンが中心にならないため、コメントアウト
  // width: `calc(${theme.spacing(7)} + 1px)`,
  // [theme.breakpoints.up('sm')]: {
  //  width: `calc(${theme.spacing(9)} + 1px)`,
  // },
})

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))


interface DashboardProps {
  title?: string
  children?: React.ReactNode
}
export default function Dashboard(props: DashboardProps) {
  const navigate = useNavigate()
  // Menu Bar
  // useMediaQuery("(min-width:600px)")でmobileかどうかを判定
  const [open, setOpen] = React.useState(useMediaQuery("(min-width:600px)"))

  // 画面サイズが変わったときにopenを変更
  const isMobile = !useMediaQuery("(min-width:600px)");
  useEffect(() => {
    if(isMobile){
      setOpen(false)
    }
    else{
      setOpen(true)
    }
  }, [isMobile])

  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  const reloadClick = () => {
    Get().then()
  }

  const DashboardPage = () => {
    navigate('/dashboard')
  }
  const InfoPage = () => {
    navigate('/dashboard/info')
  }
  const AddPage = () => {
    navigate('/dashboard/add')
  }
  const PaymentPage = () => {
    navigate('/dashboard/payment')
  }
  const SupportPage = () => {
    navigate('/dashboard/support')
  }
  const ProcedurePage = () => {
    navigate('/dashboard/procedure')
  }
  const FeedbackPage = () => {
    navigate('/dashboard/feedback')
  }

  return (
    <ThemeProvider theme={muiColorTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6">
              AS59105 Service Online
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton color="inherit" onClick={reloadClick}>
                <AutorenewIcon />
              </IconButton>
              {/*<IconButton color="inherit">*/}
              {/*    <Badge badgeContent={0} color="secondary">*/}
              {/*        <NotificationsIcon/>*/}
              {/*    </Badge>*/}
              {/*</IconButton>*/}
              <UserMenu key={'user_menu'} />
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <StyledDivDashboardToolBarIcon>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </StyledDivDashboardToolBarIcon>
          <Divider />
          <List component="nav">
            <ListItemButton onClick={DashboardPage}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={InfoPage}>
              <ListItemIcon>
                <TocIcon />
              </ListItemIcon>
              <ListItemText primary="Info" />
            </ListItemButton>
            <ListItemButton onClick={AddPage}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="申請" />
            </ListItemButton>
            {restfulApiConfig.enableMoney && (
              <ListItemButton onClick={PaymentPage}>
                <ListItemIcon>
                  <PaymentIcon />
                </ListItemIcon>
                <ListItemText primary="会費/寄付" />
              </ListItemButton>
            )}
            <ListItemButton onClick={SupportPage}>
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText primary="Support" />
            </ListItemButton>
            <ListItemButton onClick={ProcedurePage}>
              <ListItemIcon>
                <NoteAddOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="各種手続き" />
            </ListItemButton>
            <ListItemButton onClick={FeedbackPage}>
              <ListItemIcon>
                <FeedbackIcon />
              </ListItemIcon>
              <ListItemText primary="Feedback" />
            </ListItemButton>
            <Divider />
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <StyledDivDashboardToolBarIcon />

          <StyledTypographyPageTitle
            // component="h2"
            variant="h5"
            color="inherit"
            noWrap
          >
            {props.title}
          </StyledTypographyPageTitle>
          {props.children}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const clickLogout = () => {
    Logout().then((res) => {
      Cookies.remove('user_token')
      Cookies.remove('access_token')
      store.dispatch(clearInfos())
      store.dispatch(clearTemplates())
      navigate('/login')
    })
  }

  return (
    <StyledDivDashboardRoot>
      <IconButton
        color="inherit"
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <PermIdentityIcon />
      </IconButton>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {/*<MenuItem onClick={handleClose}>Profile</MenuItem>*/}
        <MenuItem onClick={clickLogout}>Logout</MenuItem>
      </Menu>
    </StyledDivDashboardRoot>
  )
}
