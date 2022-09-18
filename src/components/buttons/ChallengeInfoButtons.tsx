import React from 'react'
import { Link } from 'react-router-dom'

import Info from '../icons/Info'
import Play from '../icons/Play'
import Stats from '../icons/Stats'
import { Button } from '../shared'

type ChallengeInfoButtonsProps = {
  sessionId?: string
  challengeId?: string
}

export default function ChallengeInfoButtons({
  challengeId,
  sessionId
}: ChallengeInfoButtonsProps) {
  return (
    <>
      {sessionId && (
        <Link to={`/session/${sessionId}`}>
          <Button>
            <Stats />
          </Button>
        </Link>
      )}
      {challengeId && (
        <>
          <Link to={`/challenge-info/${challengeId}`}>
            <Button>
              <Info />
            </Button>
          </Link>
          <Link to={`/challenge/${challengeId}`}>
            <Button variant='primary'>
              <Play />
            </Button>
          </Link>
        </>
      )}
    </>
  )
}
