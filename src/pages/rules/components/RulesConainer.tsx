import { Box } from '@mui/material'
import LinkSpan from 'components/LinkSpan'
import { useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Color } from 'utils/types'
import DonaterRules from './DonaterRules'
import PlayerRules from './PlayerRules'
import useScreenSize from 'src/context/useScreenSize'
import Countdown from './Countdown'

export default function RulesContainer() {
  const { headerSize } = useScreenSize()
  // const [rulesPage, setRulesPage] = useState<'player' | 'donater'>('player')

  const location = useLocation()
  const navigate = useNavigate()

  const donaterRules = location.pathname.endsWith('donater')

  const handleClick = (page: 'player' | 'donater') => {
    navigate(page)
  }

  return (
    <Box display={'flex'} justifyContent="center">
      <Box width={'740px'} marginLeft={'10px'} marginRight={'10px'}>
        <Box marginBottom={'30px'}>
          <Link to="#" onClick={() => handleClick('player')}>
            <LinkSpan color={Color.blue} active={!donaterRules}>
              Для стримеров
            </LinkSpan>
          </Link>
          <span style={{ marginLeft: '50px' }} />
          <Link to="#" onClick={() => handleClick('donater')}>
            <LinkSpan color={Color.purple} active={donaterRules}>
              Для донатеров
            </LinkSpan>
          </Link>
        </Box>
        <Box fontSize={headerSize} fontWeight={700} lineHeight={1.2}>
          {donaterRules
            ? 'Правила заказа игр'
            : 'Общие правила проведения для участников'}
        </Box>

        <Box
          style={{
            lineHeight: '1.2',
            width: 'max-content',
            fontWeight: 600,
            marginTop: '15px',
            color: Color.greyText,
          }}
        >
          <Countdown />
        </Box>

        <Box marginTop={'50px'} />
        <Routes location={location}>
          <Route path="/" element={<PlayerRules />} />
          <Route path="player" element={<PlayerRules />} />
          <Route path="donater" element={<DonaterRules />} />
        </Routes>
      </Box>
    </Box>
  )
}
