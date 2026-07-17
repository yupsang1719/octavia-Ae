import { useId, useState, useEffect } from 'react'

// Searchable item select built on a native <datalist> — no new dependency,
// and works fine with a mobile numeric/text keyboard.
export default function ItemPicker({ items, value, onChange, placeholder = 'Search item…', className = '' }) {
  const listId = useId()
  const selected = items.find(i => i._id === value)
  const [text, setText] = useState(selected?.name || '')

  useEffect(() => {
    const item = items.find(i => i._id === value)
    setText(item?.name || '')
  }, [value, items])

  function handleInput(e) {
    const name = e.target.value
    setText(name)
    const match = items.find(i => i.name === name)
    onChange(match ? match._id : '')
  }

  return (
    <>
      <input
        list={listId}
        value={text}
        onChange={handleInput}
        placeholder={placeholder}
        className={`input ${className}`}
        autoComplete="off"
      />
      <datalist id={listId}>
        {items.map(i => <option key={i._id} value={i.name} />)}
      </datalist>
    </>
  )
}
