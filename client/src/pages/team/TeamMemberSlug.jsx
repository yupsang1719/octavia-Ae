import { useState, useEffect, useLayoutEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import TeamMemberPage from './TeamMemberPage'

export default function TeamMemberSlug() {
  const { slug } = useParams()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useLayoutEffect(() => {
    setMember(null)
    setLoading(true)
    setNotFound(false)
  }, [slug])

  useEffect(() => {
    let cancelled = false
    axios.get(`/api/team/${slug}`)
      .then(({ data }) => { if (!cancelled) { setMember(data); setLoading(false) } })
      .catch(() => { if (!cancelled) { setNotFound(true); setLoading(false) } })
    return () => { cancelled = true }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound) {
    return (
      <>
        <Helmet>
          <title>Team member not found | Octavia Dental</title>
        </Helmet>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-5">
          <h1 className="text-3xl font-serif text-brand-dark">Team member not found</h1>
          <p className="text-brand-muted">This page may have moved or the URL is incorrect.</p>
          <Link to="/our-team" className="btn-primary mt-2">Meet our team</Link>
        </div>
      </>
    )
  }

  return <TeamMemberPage member={member} />
}
