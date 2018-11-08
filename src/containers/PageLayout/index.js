import PropTypes from 'prop-types'
import styled from 'styled-components'
import WickedGrit from '../../assets/fonts/WickedGrit.ttf';
import React, { Fragment, useState } from 'react'
import {
  Container,
  Header,
  Icon,
  Menu,
  Responsive,
  Segment,
  Select,
  Sidebar,
  Visibility,
} from 'semantic-ui-react'
import { withRouter, Route, Link } from 'react-router-dom'
import PrettyPrintJson from '../../PrettyPrintJson'
import Generator from '../../services/generator.js'
import { useTranslation } from 'react-i18next/hooks';
import { Trans } from 'react-i18next';

const HomepageHeading = ({ mobile }) => {

  const [ , i18n] = useTranslation();

  const Title = styled(Header)`
    @font-face {
      font-family: 'WickedGrit';
      src: url(${WickedGrit}) format('truetype');
      font-style: normal;
    }
    font-family: WickedGrit;
    font-size: ${(props) => props.mobile ? '2.5em' : '4em'};
    font-weight: normal;
    margin-bottom: 0;
    margin-top: ${(props) => props.mobile ? '1.5em' : '3em'};
 `

  const SubTitle = styled(Header)`
    font-size: ${(props) => props.mobile ? '1em' : '1.5em'};
    font-weight: lighter;
    margin-top: ${(props) => props.mobile ? '0.5em' : '0em'};
  `

  return (
    <Container text>
      <Title as='h1' inverted mobile={mobile}>
        Maze Rats Lab
      </Title>
      <SubTitle as='h2' inverted mobile={mobile}>
        <Trans i18n={i18n}>
          The <strike>lazy</strike> pragmatic player toolbox.
        </Trans>
      </SubTitle>
    </Container>
  )
}

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
}

const MenuLink = withRouter(({to, location, children}) => {
    return (
      <Menu.Item as='a' active={to === location.pathname}>
        <Link to={to+location.search}>
          {children}
        </Link>
      </Menu.Item>
    )
})

const LangSelect = styled(Select)`
  font-size: 10;
  width:"200px";
`

const LangSelector = () => {
    const [t, i18n] = useTranslation();

    const changeLanguage = lang => {
      i18n.changeLanguage(lang);
    };

    const countryOptions = [
        { value: 'pt-BR', flag: 'br', text: t('Brazillian Portuguese') },
        { value: 'en', flag: 'us', text: t('English') }
    ]
    return (
      <LangSelect
        onChange={(e, { value }) => changeLanguage(value)}
        placeholder={t('Change language')}
        options={countryOptions}
      />
    )
}

const MainContainer = styled(Responsive)`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`
const DesktopContainer = ({ children }) => {

  const [fixed, setFixed] = useState(false);

  const hideFixedMenu = () => setFixed(false)
  const showFixedMenu = () => setFixed(true)

  const [t] = useTranslation();

  const HeadingContainer = styled(Segment)`
    min-height: 300;
    padding: '1em 0em';
    text-align: center
  `

  return (
    <MainContainer minWidth={Responsive.onlyTablet.minWidth}>
      <Visibility
        once={false}
        onBottomPassed={showFixedMenu}
        onBottomPassedReverse={hideFixedMenu}
      >
        <HeadingContainer
          inverted
          textAlign='center'
          vertical
        >
          <Menu
            fixed={fixed ? 'top' : null}
            inverted
            pointing={!fixed}
            secondary={!fixed}
            size='large'
          >
            <Container>
              <MenuLink to="/character">{t('Character generator')}</MenuLink>
              <MenuLink to="/spell">{t('Spell generator')}</MenuLink>
              <Menu.Item position='right'>
                <LangSelector />
              </Menu.Item>
            </Container>
          </Menu>
          <HomepageHeading />
        </HeadingContainer>
      </Visibility>

      {children}
    </MainContainer>
  )
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

const MainPusher = styled(Sidebar.Pusher)`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`

const MobileContainer = ({ children }) => {
  const [t] = useTranslation();

  const [sidebarOpened, setSidebarOpened] = useState(false);

  const handlePusherClick = () => {
    if (sidebarOpened) {
      setSidebarOpened(false);
    }
  }

  const handleToggle = () => setSidebarOpened(!sidebarOpened);

  return (
    <MainContainer maxWidth={Responsive.onlyMobile.maxWidth}>
      <Sidebar.Pushable>
        <Sidebar as={Menu} animation='uncover' inverted vertical visible={sidebarOpened}>
          <MenuLink to="/character">{t('Character generator')}</MenuLink>
          <MenuLink to="/spell">{t('Spell generator')}</MenuLink>
        </Sidebar>

        <MainPusher
          dimmed={sidebarOpened}
          onClick={handlePusherClick}
          style={{ minHeight: '100vh' }}
        >
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 200, padding: '1em 0em' }}
            vertical
          >
            <Container>
              <Menu inverted pointing secondary size='large'>
                <Menu.Item onClick={handleToggle}>
                  <Icon name='sidebar' />
                </Menu.Item>
                <Menu.Item position='right'>
                  <LangSelector />
                </Menu.Item>
              </Menu>
            </Container>
            <HomepageHeading mobile />
          </Segment>

          {children}
        </MainPusher>
      </Sidebar.Pushable>
    </MainContainer>
  )
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children }) => (
  <Fragment>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </Fragment>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

const ContentContainer = styled(Container)`
  padding: 30px 0px;
  flex: 1
`

const Footer = styled(Segment)`
  padding: '5em 0em'
` 
const PageLayout = () => {
  const [t, i18n] = useTranslation();

  return (
    <ResponsiveContainer>
      <ContentContainer text>
        <Route path="/character" render={(props) => {
          return (
            <Fragment>
              <Header as='h3' style={{ fontSize: '2em' }}>
                {t('Character generator')}
              </Header>
              <PrettyPrintJson data={new Generator(null, i18n.language).character()} />
            </Fragment>
          )
        }} />
        <Route path="/spell" render={(props) => {
          return (
            <Fragment>
              <Header as='h3' style={{ fontSize: '2em' }}>
                {t('Spell generator')}
              </Header>
              <PrettyPrintJson data={new Generator(null, i18n.language).spell()} />
            </Fragment>
          )
        }} />
      </ContentContainer>
      <Footer inverted vertical>
        
      </Footer>
    </ResponsiveContainer>
  )
}
export default PageLayout