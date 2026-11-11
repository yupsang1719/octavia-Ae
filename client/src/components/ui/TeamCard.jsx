import { Link } from 'react-router-dom'
import TagList from './TagList'
import { ArrowUpRight } from 'lucide-react'

export default function TeamCard({ member }) {
  const firstName = member.name?.replace(/^Dr\.?\s+/i, '').split(' ')[0]
  const summary = member.cardSummary || member.bio

  return (
    <Link
      to={`/our-team/${member.slug}`}
      className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden ring-1 ring-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.18)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.04),0_24px_48px_-20px_rgba(0,0,0,0.28)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Portrait */}
      <div className="aspect-[4/5] relative overflow-hidden bg-brand-green-bg">
        {member.image ? (
          <img
            src={member.image}
            alt={`${member.name}, ${member.role}`}
            className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-green/10 to-brand-green-bg">
            <div className="w-24 h-24 rounded-full bg-white/70 flex items-center justify-center">
              <span className="font-serif text-3xl text-brand-green/60 select-none">
                {member.initials || member.name?.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-6">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-green mb-2">
          {member.role}
        </p>
        <h3 className="font-sans text-xl font-semibold text-brand-dark tracking-tight leading-snug">
          {member.name}
        </h3>
        {member.postNominals && (
          <p className="mt-1.5 font-sans text-[13px] font-medium leading-snug text-[#8A6A2E]">
            {member.postNominals}
          </p>
        )}

        {summary && (
          <p className="mt-3 font-sans text-sm text-brand-muted leading-relaxed line-clamp-3">
            {summary}
          </p>
        )}

        {member.specialisms?.length > 0 && (
          <TagList items={member.specialisms.slice(0, 3)} className="mt-4 font-sans text-xs text-brand-dark/70" />
        )}

        <div className="mt-auto pt-5">
          <div className="pt-4 border-t border-brand-border flex items-center justify-between">
            <span className="font-sans text-sm font-medium text-brand-dark">
              Meet {firstName}
            </span>
            <ArrowUpRight className="w-4 h-4 text-brand-dark group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" strokeWidth={1.75} />
          </div>
        </div>
      </div>
    </Link>
  )
}
