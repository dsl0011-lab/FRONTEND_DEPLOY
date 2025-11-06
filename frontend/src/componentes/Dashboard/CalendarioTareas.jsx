import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

function toDateOnlyISO(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DOW_ES = ['L','M','X','J','V','S','D']

export default function CalendarioTareas({ tareas = [], cursos = [] }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth()) // 0-11
  const [selected, setSelected] = useState(toDateOnlyISO(today))

  const cursosById = useMemo(() => Object.fromEntries(cursos.map(c => [String(c.id), c])), [cursos])

  const tareasByDate = useMemo(() => {
    const map = {}
    for (const t of tareas || []) {
      if (!t?.fecha_entrega) continue
      const d = new Date(t.fecha_entrega)
      const key = toDateOnlyISO(d)
      if (!map[key]) map[key] = []
      map[key].push(t)
    }
    // ordena por hora
    for (const k of Object.keys(map)) {
      map[k].sort((a,b)=> new Date(a.fecha_entrega) - new Date(b.fecha_entrega))
    }
    return map
  }, [tareas])

  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDowMon0 = (firstDay.getDay() + 6) % 7

  const days = []
  for (let i = 0; i < firstDowMon0; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y=>y-1) } else { setMonth(m=>m-1) }
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y=>y+1) } else { setMonth(m=>m+1) }
  }

  function selectDay(d) {
    if (!d) return
    setSelected(toDateOnlyISO(new Date(year, month, d)))
  }

  const selectedTasks = tareasByDate[selected] || []

  useEffect(() => {
    const sel = new Date(selected)
    if (sel.getFullYear() !== year || sel.getMonth() !== month) {
      setSelected(toDateOnlyISO(new Date(year, month, 1)))
    }
  }, [year, month])

  return (
    <div className="mt-4 bg-gray-900 rounded p-3">
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="px-2 py-1 rounded border border-gray-700 hover:bg-gray-800">«</button>
        <div className="font-semibold text-gray-100">{MONTHS_ES[month]} {year}</div>
        <button onClick={nextMonth} className="px-2 py-1 rounded border border-gray-700 hover:bg-gray-800">»</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1">
        {DOW_ES.map((d)=> (<div key={d} className="py-1">{d}</div>))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, idx) => {
          const dateKey = d ? toDateOnlyISO(new Date(year, month, d)) : null
          const has = dateKey && tareasByDate[dateKey]?.length > 0
          const isSel = dateKey === selected
          return (
            <button
              key={idx}
              onClick={() => selectDay(d)}
              className={`h-16 rounded flex flex-col items-center justify-center border ${d ? 'border-gray-700' : 'border-transparent'} ${isSel ? 'bg-blue-900/40' : 'bg-gray-800'} hover:bg-gray-700/60`}
              disabled={!d}
            >
              <div className={`text-sm ${d ? 'text-gray-100' : 'text-transparent'}`}>{d || '•'}</div>
              {has && (
                <div className="mt-1 text-[10px] px-1 rounded bg-emerald-600/20 text-emerald-300">
                  {tareasByDate[dateKey].length} tareas
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-3">
        <div className="text-xs text-gray-400 mb-1">{selected}</div>
        {selectedTasks.length === 0 ? (
          <div className="text-sm opacity-70">No hay tareas para este día</div>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-auto pr-1">
            {selectedTasks.map((t) => {
              const c = cursosById[String(t.curso)]
              return (
                <li key={t.id} className="bg-gray-800 rounded p-2 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-100">{t.titulo}</div>
                    {c && <div className="text-xs text-gray-400">Asignatura: {c.nombre}</div>}
                  </div>
                  <div className="text-xs text-gray-300">{new Date(t.fecha_entrega).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

