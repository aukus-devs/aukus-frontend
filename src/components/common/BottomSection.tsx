import { Box, Divider, Link } from '@mui/material'
import { Color } from 'utils/types'
import LinkSpan from './LinkSpan'
import useScreenSize from 'src/context/useScreenSize'
import BottomSectionMobile from './BottomSectionMobile'

export default function BottomSection() {
  const { isMobile } = useScreenSize()
  if (isMobile) {
    return <BottomSectionMobile />
  }

  return (
    <Box
      display="flex"
      justifyContent="start"
      margin={'auto'}
      width={'fit-content'}
      position={'relative'}
    >
      <Box width="1200px">
        <Box display="flex" justifyContent="center" marginTop={30}>
          <Box width="100%">
            <Divider
              variant="fullWidth"
              sx={{
                borderWidth: '1px',
                backgroundColor: 'white',
                opacity: 1.0,
                textAlign: 'center',
              }}
            />
          </Box>
        </Box>
        <Box
          marginTop={'30px'}
          marginBottom={'50px'}
          paddingLeft={'60px'}
          paddingRight={'60px'}
          display={'flex'}
          justifyContent="space-between"
        >
          <Box textAlign="left">
            <Box fontSize={'16px'} fontWeight={700}>
              Контакты
            </Box>
            <Box marginTop={'15px'} fontSize={'14px'} fontWeight={500}>
              Дискорд:{' '}
              <Link
                href="https://discord.gg/SHsyYTjNb5"
                rel="noopener nereferrer"
                target="_blank"
              >
                <LinkSpan color={Color.blue}>Аукус Разработка</LinkSpan>
              </Link>
            </Box>
          </Box>
          <Box textAlign="left">
            <Box fontSize={'16px'} fontWeight={700}>
              Уведомления
            </Box>
            <Box marginTop={'15px'} fontSize={'14px'} fontWeight={500}>
              <Link
                href="https://t.me/aukus3"
                rel="noopener nereferrer"
                target="_blank"
              >
                <LinkSpan color={Color.blue}>Телеграм</LinkSpan>
              </Link>
              <Link
                href="https://discord.com/channels/1279797299827970048/1314899044434444299"
                rel="noopener nereferrer"
                target="_blank"
                style={{ marginLeft: '10px' }}
              >
                <LinkSpan color={Color.blue}>Дискорд</LinkSpan>
              </Link>
            </Box>
          </Box>
          <Box textAlign="left">
            <Box fontSize={'16px'} fontWeight={700}>
              Зеркало (если плохо грузит)
            </Box>
            <Box marginTop={'15px'} fontSize={'14px'} fontWeight={500}>
              <Link
                href="https://aukus.su/"
                rel="noopener nereferrer"
                target="_blank"
              >
                <LinkSpan color={Color.blue}>https://aukus.su/</LinkSpan>
              </Link>
            </Box>
          </Box>
          <Box textAlign="left">
            <Box fontSize={'16px'} fontWeight={700}>
              Поддержать сайт
            </Box>
            <Box marginTop={'15px'} fontSize={'14px'} fontWeight={500}>
              <Link
                href="https://boosty.to/aukus"
                rel="noopener nereferrer"
                target="_blank"
              >
                <LinkSpan color={Color.blue}>https://boosty.to/aukus</LinkSpan>
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
