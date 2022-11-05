import { User } from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  QuerySnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
  where
} from 'firebase/firestore'

import { getUser } from '@/app/actions'
import { db } from '@/app/config/firebase'
import { TChallengerResults } from '@/features/challenge.features/types'

type FirebaseChallenge = {
  code: string
  language: string
  created: Timestamp
  id: string
}

type FirebaseSession = {
  timestamp: Timestamp
  challengeId: string
  sessionId: string
  results: Omit<TChallengerResults, 'timeStarted' | 'timeEnded'> & {
    timeStarted: Timestamp
    timeEnded: Timestamp
  }
}

type Session = Omit<FirebaseSession, 'results'> & {
  results: Omit<TChallengerResults, 'timeStarted'> & {
    timeStarted: Date
  }
}

type Challenge = Omit<FirebaseChallenge, 'created'> & {
  created: Date
}

export type { FirebaseChallenge, FirebaseSession, Session, Challenge }

const createSession = async (challengeId: string, results: TChallengerResults) => {
  const user = await getUser()
  if (user) {
    const docRef = doc(collection(db, 'users', user.uid, 'sessions'))
    const sessionId = docRef.id
    await setDoc(docRef, {
      challengeId,
      sessionId,
      results,
      timestamp: serverTimestamp()
    })
    return sessionId
  }
}

const createChallenge = async (code: string, language: string) => {
  const user = await getUser()
  if (user) {
    const challenge = { code, language, created: new Date() }
    const docRef = doc(collection(db, 'users', user.uid, 'challenges'))
    await setDoc(docRef, { ...challenge, id: docRef.id, timestamp: serverTimestamp() })
    return docRef.id
  }
}

const getChallenge = async ({
  challengeId,
  getRandom
}: {
  challengeId?: string
  getRandom?: boolean
}): Promise<Challenge | undefined> => {
  const user = await getUser()
  if (user) {
    if (getRandom) {
      const collectionRef = collection(db, 'users', user.uid, 'challenges')
      const collectionData = await getDocs(collectionRef)
      const index = collectionData.size
      const randomDocId = Math.floor(Math.random() * index)
      const challenge = collectionData.docs[randomDocId].data() as FirebaseChallenge

      return { ...challenge, created: challenge.created.toDate() }
    }
    if (challengeId) {
      const docRef = doc(db, 'users', user.uid, 'challenges', challengeId)
      const document = await getDoc(docRef)
      const challenge = document.data() as FirebaseChallenge

      return { ...challenge, created: challenge.created.toDate() }
    }
  }
}

const getChallenges = async (): Promise<Challenge[] | undefined> => {
  const user = await getUser()
  if (user) {
    const collectionRef = collection(db, 'users', user.uid, 'challenges')
    const collections = await getDocs(collectionRef)
    return collections.docs.map(d => {
      const challenge = d.data() as FirebaseChallenge
      return { ...challenge, created: challenge.created.toDate() }
    })
  }
}

const removeChallenges = async () => {
  const user = await getUser()
  if (user) {
    const collectionRef = collection(db, 'users', user.uid, 'challenges')
    const collections = await getDocs(collectionRef)
    collections.forEach(d => {
      deleteDoc(d.ref)
    })
  }
}

const removeSessions = async () => {
  const user = await getUser()
  if (user) {
    const collectionRef = collection(db, 'users', user.uid, 'sessions')
    const collections = await getDocs(collectionRef)
    collections.forEach(d => {
      deleteDoc(d.ref)
    })
  }
}

const getSession = async (sessionId: string): Promise<undefined | Session> => {
  const user = await getUser()
  if (user) {
    const docRef = doc(db, 'users', user.uid, 'sessions', sessionId)
    const document = await getDoc(docRef)
    const session = document.data() as FirebaseSession
    return {
      ...session,
      results: {
        ...session.results,
        timeStarted: session.results.timeStarted.toDate()!,
        timeEnded: session.results.timeEnded.toDate()!
      }
    }
  }
}

const getSessionsByChallengeId = async (
  id: string,
  user: User
): Promise<FirebaseSession[]> => {
  const sessionsRef = collection(db, 'users', user.uid, 'sessions')
  const q = query(sessionsRef, where('challengeId', '==', id))
  const docs = await getDocs(q)

  return docs.docs.map(d => d.data()) as FirebaseSession[]
}

const removeChallenge = async (challengeId: string) => {
  const user = await getUser()
  if (user?.uid) {
    await deleteDoc(doc(db, 'users', user.uid, 'challenges', challengeId))
    const sessions = await getSessionsByChallengeId(challengeId, user)
    if (sessions && sessions.length) {
      for (const session of sessions) {
        await deleteDoc(doc(db, 'users', user.uid, 'sessions', session.sessionId))
      }
    }
  }
}

const getSessions = async (
  last?: number,
  options?: {
    sort?: boolean
  }
): Promise<undefined | Session[]> => {
  const user = await getUser()
  if (user) {
    const collectionRef = collection(db, 'users', user.uid, 'sessions')
    let collections: QuerySnapshot<DocumentData>
    if (last || options?.sort) {
      let q: Query<DocumentData>
      if (last && options?.sort) {
        q = query(collectionRef, orderBy('timestamp', 'desc'), limit(last))
      } else if (last) {
        q = query(collectionRef, limit(last))
      } else if (options?.sort) {
        q = query(collectionRef, orderBy('timestamp', 'desc'))
      }
      collections = await getDocs(q!)
    } else {
      collections = await getDocs(collectionRef)
    }

    return collections.docs.map(d => {
      const session = d.data() as FirebaseSession
      return {
        ...session,
        results: {
          ...session.results,
          timeStarted: session.results.timeStarted.toDate() as Date,
          timeEnded: session.results.timeEnded.toDate() as Date
        }
      }
    })
  }
}

export {
  createSession,
  createChallenge,
  getChallenge,
  getChallenges,
  getSession,
  getSessions,
  getSessionsByChallengeId,
  removeChallenge,
  removeChallenges,
  removeSessions
}
