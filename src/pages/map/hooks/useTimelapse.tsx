import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import useLocalStorage from 'src/context/useLocalStorage'
import { fetchPlayerMoves, fetchPlayers, PlayerMovesResponse } from 'utils/api'
import { MoveParams, Player, PlayerMove } from 'utils/types'

type StateOption = 'closed' | 'date_selection' | 'move_selection'

type TimelapseState = {
  state: StateOption
  setState: (state: StateOption) => void
  selectedDate: string
  selectedMoveId: number
  setSelectedDate: (date: string) => void
  setSelectedMoveId: (moveId: number) => void
  players: Player[]
  moves: PlayerMove[]
  followMode: boolean
  setFollowMode: (mode: boolean) => void
  playMode: boolean
  setPlayMode: (mode: boolean) => void
  currentAnimationId: number
  currentAnimationMove?: PlayerMove
  onAnimationEnd: (params: { player: Player; moveParams: MoveParams }) => void
}

const Today = new Date()
const TodayString = Today.toISOString().split('T')[0]

const TimelapseContext = createContext<TimelapseState>({
  state: 'closed',
  setState: () => {},
  selectedDate: TodayString,
  selectedMoveId: 1,
  setSelectedDate: () => {},
  setSelectedMoveId: () => {},
  players: [],
  moves: [],
  followMode: true,
  setFollowMode: () => {},
  playMode: false,
  setPlayMode: () => {},
  currentAnimationId: 0,
  currentAnimationMove: undefined,
  onAnimationEnd: ({}) => {},
})

export function useTimelapse() {
  return useContext(TimelapseContext)
}

export default function TimelapseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [openState, setOpenState] = useState<TimelapseState['state']>('closed')
  const [selectedDate, setSelectedDate] = useState<string>(TodayString)
  const [selectedMoveId, setSelectedMoveId] = useState<number>(1)
  const [updatedPlayers, setUpdatedPlayers] = useState<Player[]>([])
  const [followMode, setFollowMode] = useState<boolean>(true)
  const [currentResponse, setCurrentResponse] = useState<
    PlayerMovesResponse | undefined
  >(undefined)

  // const [playMode, setPlayMode] = useState<boolean>(false)
  const [currentAnimationId, setCurrentAnimationId] = useState<number>(0)
  const [playState, setPlayState] = useState<
    'off' | 'start' | 'animate' | 'finish'
  >('off')

  const { save, load } = useLocalStorage()
  const followModeLoaded = load('followMode', true)
  const updateFollowMode = (mode: boolean) => {
    save('followMode', mode)
    setFollowMode(mode)
  }

  const { data: movesByDay } = useQuery({
    queryKey: ['timelapse', selectedDate],
    queryFn: () => fetchPlayerMoves({ date: selectedDate }),
    staleTime: 1000 * 60 * 5,
    enabled: openState !== 'closed',
    placeholderData: () => currentResponse,
  })

  useEffect(() => {
    if (movesByDay) {
      setCurrentResponse(movesByDay)
    }
  }, [movesByDay])

  const moves = useMemo(() => {
    const _moves = movesByDay?.moves || []
    return _moves.sort((a, b) => a.id - b.id)
  }, [movesByDay])

  let queryMoveId = movesByDay?.last_move_id
  if (moves.length > 0) {
    queryMoveId = moves[selectedMoveId - 1].id
  }

  const { data: playersData } = useQuery({
    queryKey: ['players_moves', selectedDate, queryMoveId],
    queryFn: () => {
      if (!queryMoveId) {
        return null
      }
      return fetchPlayers(queryMoveId)
    },
    staleTime: 1000 * 60 * 5,
    enabled: openState !== 'closed',
    placeholderData: () => ({
      players: updatedPlayers,
    }),
  })

  const players = useMemo(
    () => playersData?.players || [],
    [playersData?.players]
  )

  const resetPlayers = () => {
    const editablePlayers = players.map((player) => ({
      ...player,
    }))
    const movesBefore = moves.slice(0, selectedMoveId)
    if (movesBefore) {
      for (const move of movesBefore) {
        const movePlayer = editablePlayers.find(
          (player) => player.id === move.player_id
        )
        if (movePlayer) {
          movePlayer.map_position = move.cell_to
        }
      }
      setUpdatedPlayers(editablePlayers)
    }
  }

  useEffect(() => {
    resetPlayers()
  }, [selectedMoveId, moves, players])

  // scroll to seleceted player move
  useEffect(() => {
    if (playState === 'off' || openState === 'closed') {
      return
    }
    const move = moves[currentAnimationId]
    // console.log(move)
    if (move) {
      const cellFrom =
        move.cell_to > 0 ? `map-cell-${move.cell_to}` : 'map-cell-start'
      const element = document.getElementById(cellFrom)
      if (element) {
        window.scrollTo({
          top: element.offsetTop - window.innerHeight / 2 + 200,
          behavior: 'smooth',
        })
        // element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentAnimationId])

  const togglePlayMode = (mode: boolean) => {
    if (mode) {
      resetPlayers()
      setPlayState('start')
    } else {
      setPlayState('off')
    }
  }

  useEffect(() => {
    if (playState === 'start') {
      setCurrentAnimationId(selectedMoveId - 1)
      const nextAnimation = moves[selectedMoveId - 1]
      const player = updatedPlayers.find(
        (player) => player.id === nextAnimation?.player_id
      )
      if (player) {
        player.map_position = nextAnimation.cell_from
        setUpdatedPlayers([...updatedPlayers])
        setPlayState('animate')
      }
    } else {
      // setCurrentAnimationId(0)
    }
  }, [playState])

  useEffect(() => {
    if (openState === 'closed' && playState !== 'off') {
      setPlayState('off')
    }
  }, [openState, playState])

  const onAnimationEnd = ({
    player,
    moveParams,
  }: {
    player: Player
    moveParams: MoveParams
  }) => {
    console.log(
      'on animation end',
      currentAnimationId,
      player.name,
      moveParams,
      new Date().getTime()
    )
    if (playState === 'off') {
      return
    }

    const updatedPlayer = updatedPlayers.find((p) => p.id === player.id)
    const currentMove = moves[currentAnimationId]
    if (updatedPlayer && currentMove) {
      updatedPlayer.map_position = currentMove.cell_to
      setUpdatedPlayers([...updatedPlayers])
    }

    console.log('flag1')
    if (currentAnimationId + 1 >= moves.length) {
      console.log('flag2')
      setPlayState('off')
      setCurrentAnimationId(0)
      return
    }
    console.log('flag3')

    setCurrentAnimationId(currentAnimationId + 1)
  }

  const currentAnimationMove =
    playState === 'animate' ? moves[currentAnimationId] : undefined

  return (
    <TimelapseContext.Provider
      value={{
        state: openState,
        setState: setOpenState,
        selectedDate,
        setSelectedDate,
        selectedMoveId,
        setSelectedMoveId,
        players: updatedPlayers,
        moves,
        followMode: followModeLoaded,
        setFollowMode: updateFollowMode,
        playMode: playState !== 'off',
        setPlayMode: togglePlayMode,
        currentAnimationId,
        currentAnimationMove,
        onAnimationEnd,
      }}
    >
      {children}
    </TimelapseContext.Provider>
  )
}
